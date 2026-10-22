import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const inventoryPath = 'core/inventory.snapshot.json';
const registryPath = 'core/registry.json';
const failures = [];
const fail = (message) => failures.push(message);
let inventory;
let registry;

try {
  inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
} catch (error) {
  console.error('FAIL: cannot read valid JSON from ' + inventoryPath + ': ' + error.message);
  process.exit(1);
}

try {
  registry = JSON.parse(await readFile(registryPath, 'utf8'));
} catch (error) {
  console.error('FAIL: cannot read valid JSON from ' + registryPath + ': ' + error.message);
  process.exit(1);
}

if (inventory.schemaVersion !== '1.0.0') fail('unsupported schemaVersion');
if (!['PARTIALLY_VERIFIED', 'VERIFIED'].includes(inventory.inventoryStatus)) fail('invalid inventoryStatus');
if (inventory.repository?.fullName !== 'AligasSRM/ALI-NEW') fail('unexpected repository fullName');
if (inventory.repository?.defaultBranch !== 'main') fail('unexpected default branch');
if (!/^[0-9a-f]{40}$/.test(inventory.sourceCommit || '')) fail('sourceCommit must be a full 40-character commit SHA');
if (!Array.isArray(inventory.files) || inventory.files.length === 0) fail('files must be a non-empty array');
if (!Array.isArray(registry.nodes) || !Array.isArray(registry.unmappedResources)) fail('canonical registry is missing nodes or unmappedResources');

const mappedByPath = new Map(
  (registry.nodes || [])
    .filter((node) => node.level === 'C' && typeof node.path === 'string' && node.path.length > 0)
    .map((node) => [node.path, node])
);
const unmappedByPath = new Map(
  (registry.unmappedResources || [])
    .filter((item) => typeof item.path === 'string' && item.path.length > 0)
    .map((item) => [item.path, item])
);

const seenPaths = new Set();
let mapped = 0;
let unmapped = 0;

for (const [index, file] of (inventory.files || []).entries()) {
  const label = 'files[' + index + ']';
  if (!file || typeof file !== 'object') {
    fail(label + ' must be an object');
    continue;
  }

  const path = file.path;
  if (typeof path !== 'string' || !path || path.startsWith('/') || path.split('/').includes('..')) {
    fail(label + ' has an invalid repository-relative path');
    continue;
  }
  if (seenPaths.has(path)) fail('duplicate path: ' + path);
  seenPaths.add(path);

  if (!/^[0-9a-f]{40}$/.test(file.blobSha || '')) fail(label + ' has an invalid blob SHA');
  if (!Number.isInteger(file.sizeBytes) || file.sizeBytes < 0) fail(label + ' has invalid sizeBytes');

  const expectedUrl = 'https://github.com/AligasSRM/ALI-NEW/blob/main/' + path;
  if (file.url !== expectedUrl) fail(label + ' URL does not match its exact path: ' + path);

  const canonicalNode = mappedByPath.get(path);
  const explicitUnmapped = unmappedByPath.has(path);
  if (canonicalNode) {
    mapped++;
    if (file.mappingStatus !== 'MAPPED') fail(label + ' must be MAPPED because the canonical registry assigns this path');
    const expectedRoute = canonicalNode.parentId + '/' + canonicalNode.id;
    if (file.hierarchyRoute !== expectedRoute) fail(label + ' hierarchyRoute must equal ' + expectedRoute);
  } else if (explicitUnmapped) {
    unmapped++;
    if (file.mappingStatus !== 'UNMAPPED') fail(label + ' must be UNMAPPED until the canonical registry assigns this path');
    if (file.hierarchyRoute !== undefined && file.hierarchyRoute !== null) fail(label + ' UNMAPPED resource must not claim a hierarchyRoute');
  } else {
    fail(label + ' is missing from both canonical registry mappings and explicit unmappedResources: ' + path);
  }
}

if (inventory.counts?.files !== inventory.files?.length) fail('counts.files does not match files.length');
if (inventory.counts?.mapped !== mapped) fail('counts.mapped does not match actual mapped records');
if (inventory.counts?.unmapped !== unmapped) fail('counts.unmapped does not match actual unmapped records');

const expectedStatus = unmapped === 0 ? 'VERIFIED' : 'PARTIALLY_VERIFIED';
if (inventory.inventoryStatus !== expectedStatus) {
  fail('inventoryStatus must be ' + expectedStatus + ' for ' + unmapped + ' unmapped resources');
}

const gitFiles = spawnSync('git', ['ls-files', '-z'], { encoding: 'utf8' });
if (gitFiles.status !== 0) {
  fail('git ls-files failed; cannot verify complete tracked-file coverage');
} else {
  const tracked = gitFiles.stdout.split('\0').filter(Boolean);
  const unaccounted = tracked.filter((path) => !seenPaths.has(path));
  const stale = [...seenPaths].filter((path) => !tracked.includes(path));
  if (unaccounted.length) fail('tracked files missing from inventory snapshot: ' + unaccounted.join(', '));
  if (stale.length) fail('inventory snapshot contains paths not tracked by git: ' + stale.join(', '));
}

console.log('CORE inventory snapshot: ' + (inventory.files || []).length + ' files; ' + mapped + ' mapped; ' + unmapped + ' explicitly unmapped.');
console.log('Snapshot source commit: ' + (inventory.sourceCommit || 'MISSING'));
console.log('Canonical registry cross-check and tracked-file coverage: ' + (failures.length ? 'FAIL' : 'PASS') + '.');
console.log('Inventory verification describes this snapshot only; it is not a production-readiness claim.');

if (failures.length) {
  for (const failure of failures) console.error('FAIL: ' + failure);
  process.exitCode = 1;
} else {
  console.log('CORE inventory structural and mapping validation: PASS.');
}
