import { readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const registryPath = 'core/registry.json';
const failures = [];
const errors = (message) => failures.push(message);
let registry;

try {
  registry = JSON.parse(await readFile(registryPath, 'utf8'));
} catch (error) {
  console.error('FAIL: cannot read ' + registryPath + ': ' + error.message);
  process.exit(1);
}

const allowedStatuses = new Set(['PLANNED', 'UNMAPPED', 'YELLOW', 'ORANGE', 'GREEN', 'LOCKED', 'RED', 'RETIRED']);
const allowedTypes = new Set(['REPOSITORY', 'SECTION', 'FILE', 'WORKFLOW', 'TEST', 'ISSUE', 'PULL_REQUEST', 'COMMIT', 'SERVICE', 'EVIDENCE', 'DOCUMENT', 'OTHER']);
if (registry.schemaVersion !== '1.0.0') errors('unsupported schemaVersion');
if (!['DRAFT', 'PARTIALLY_VERIFIED', 'VERIFIED'].includes(registry.registryStatus)) errors('invalid registryStatus');
if (!Array.isArray(registry.repositories) || registry.repositories.length === 0) errors('repositories must be a non-empty array');
if (!Array.isArray(registry.nodes)) errors('nodes must be an array');
if (!Array.isArray(registry.unmappedResources)) errors('unmappedResources must be an array');

const repoKeys = new Set();
const repoNames = new Set();
for (const [i, repo] of (registry.repositories || []).entries()) {
  if (!/^R-[A-Z0-9-]+$/.test(repo.repositoryId || '')) errors('repositories[' + i + '] repositoryId must use R- namespace');
  if (repoKeys.has(repo.repositoryId)) errors('duplicate repositoryId: ' + repo.repositoryId);
  if (repoNames.has(repo.fullName)) errors('duplicate repository fullName: ' + repo.fullName);
  repoKeys.add(repo.repositoryId);
  repoNames.add(repo.fullName);
  if (!/^https:\/\//.test(repo.url || '')) errors('invalid repository URL for ' + repo.fullName);
  if (!['PENDING', 'APPROVED', 'REVOKED'].includes(repo.approvalStatus)) errors('invalid approvalStatus for ' + repo.fullName);
}

const nodes = registry.nodes || [];
const byRoute = new Map();
const siblingIds = new Set();
const mappedPaths = new Set();
let phaseCount = 0, sectionCount = 0, resourceCount = 0;

for (const [i, node] of nodes.entries()) {
  const label = 'nodes[' + i + ']';
  const expectedPrefix = node.level;
  if (!['A', 'B', 'C'].includes(node.level) || !new RegExp('^' + expectedPrefix + '[0-9]+$').test(node.id || '')) {
    errors(label + ' id/level mismatch');
    continue;
  }
  if (!allowedStatuses.has(node.status)) errors(label + ' has invalid status');
  if (!allowedTypes.has(node.resourceType)) errors(label + ' has invalid resourceType');

  let route;
  if (node.level === 'A') {
    phaseCount++;
    if (node.parentId !== null) errors(label + ' A node must have parentId=null');
    route = node.id;
  } else if (node.level === 'B') {
    sectionCount++;
    if (!byRoute.has(node.parentId) || byRoute.get(node.parentId).level !== 'A') errors(label + ' parentId must reference an existing A node');
    route = node.parentId + '/' + node.id;
  } else {
    resourceCount++;
    const parts = String(node.parentId || '').split('/');
    if (parts.length !== 2 || !byRoute.has(parts.join('/')) || byRoute.get(parts.join('/')).level !== 'B') {
      errors(label + ' parentId must reference an existing A/B route');
    }
    route = node.parentId + '/' + node.id;
  }
  if (siblingIds.has(route)) errors('duplicate hierarchical route: ' + route);
  siblingIds.add(route);
  byRoute.set(route, node);

  if (node.level === 'C' && node.path) {
    if (mappedPaths.has(node.path)) errors('path mapped more than once: ' + node.path);
    mappedPaths.add(node.path);
    const expectedUrl = 'https://github.com/' + node.repositoryFullName + '/blob/' + node.branch + '/' + node.path;
    if (node.url !== expectedUrl) errors(label + ' URL does not match repository/branch/path');
    if (!repoNames.has(node.repositoryFullName)) errors(label + ' references an unregistered repository');
    try { await access(node.path); } catch { errors(label + ' path does not exist in checkout: ' + node.path); }
  } else if (node.level === 'C' && node.status !== 'PLANNED') {
    errors(label + ' non-planned C resource must have an exact path');
  }
}

const unmappedPaths = new Set();
for (const [i, item] of (registry.unmappedResources || []).entries()) {
  if (item.status !== 'UNMAPPED') errors('unmappedResources[' + i + '] status must be UNMAPPED');
  if (!item.path || unmappedPaths.has(item.path)) errors('invalid or duplicate unmapped path: ' + item.path);
  if (mappedPaths.has(item.path)) errors('path cannot be both mapped and UNMAPPED: ' + item.path);
  unmappedPaths.add(item.path);
  if (item.url !== 'https://github.com/AligasSRM/ALI-NEW/blob/main/' + item.path) errors('unmapped URL does not match exact path: ' + item.path);
  try { await access(item.path); } catch { errors('unmapped path does not exist in checkout: ' + item.path); }
}

const gitFiles = spawnSync('git', ['ls-files', '-z'], { encoding: 'utf8' });
if (gitFiles.status !== 0) errors('git ls-files failed; cannot verify complete tracked-file coverage');
else {
  const tracked = gitFiles.stdout.split('\0').filter(Boolean);
  const unaccounted = tracked.filter(path => !mappedPaths.has(path) && !unmappedPaths.has(path));
  const staleMapped = [...mappedPaths, ...unmappedPaths].filter(path => !tracked.includes(path));
  if (unaccounted.length) errors('tracked files missing from registry mapping: ' + unaccounted.join(', '));
  if (staleMapped.length) errors('registry contains paths not tracked by git: ' + staleMapped.join(', '));
}

console.log('CORE registry: ' + phaseCount + ' A phases, ' + sectionCount + ' B sections, ' + resourceCount + ' C resources.');
console.log('Tracked-file coverage: ' + (mappedPaths.size + unmappedPaths.size) + ' registry paths.');
console.log('Registry status: ' + registry.registryStatus + ' (this is not proof of live GitHub integration or production readiness).');
if (failures.length) {
  for (const failure of failures) console.error('FAIL: ' + failure);
  process.exitCode = 1;
} else {
  console.log('CORE registry hierarchy, links, local paths, and tracked-file coverage: PASS.');
}
