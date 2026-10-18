const ALLOWED_STATUSES = new Set(['PLANNED', 'UNMAPPED', 'YELLOW', 'ORANGE', 'GREEN', 'LOCKED', 'RED', 'RETIRED']);
const LEVEL_PATTERN = /^[A-Z]$/;
const ID_PATTERN = /^([A-Z])[0-9]+$/;

function unknown(reason, routes = [], unmatchedPaths = []) {
  return { status: 'UNKNOWN', label: 'UNKNOWN — targeted investigation required', confidence: routes.length ? 'PARTIAL_EXACT_MATCH' : 'NONE', routes, unmatchedPaths, reason };
}

function routeOf(node) {
  return node.level === 'A' ? node.id : `${node.parentId}/${node.id}`;
}

export function resolveCoreRoutes(registry, evidence) {
  if (!registry || !Array.isArray(registry.repositories) || !Array.isArray(registry.nodes)) {
    return unknown('Registry structure is unavailable or invalid.');
  }
  const repositoryFullName = typeof evidence?.repositoryFullName === 'string' ? evidence.repositoryFullName.trim() : '';
  const paths = Array.isArray(evidence?.changedPaths) ? [...new Set(evidence.changedPaths.filter(p => typeof p === 'string' && p.length > 0))] : [];
  if (!repositoryFullName || paths.length === 0) {
    return unknown('Exact repository name and at least one changed path are required; keywords alone are not sufficient.');
  }
  const repositoryMatches = registry.repositories.filter(repo => repo.fullName === repositoryFullName && repo.approvalStatus === 'APPROVED');
  if (repositoryMatches.length !== 1) return unknown('Repository is absent, duplicated, or not approved in the registry.');
  const nodes = registry.nodes;
  const byRoute = new Map();
  for (const node of nodes) {
    if (!node || !LEVEL_PATTERN.test(String(node.level || '')) || !ID_PATTERN.test(String(node.id || '')) || node.id[0] !== node.level) {
      return unknown('Registry contains an invalid node identity.');
    }
    const route = routeOf(node);
    if (byRoute.has(route)) return unknown('Registry contains a duplicate canonical route: ' + route);
    byRoute.set(route, node);
  }
  const routes = [];
  const unmatchedPaths = [];
  for (const path of paths) {
    const matches = nodes.filter(node =>
      node.level !== 'A' &&
      node.repositoryFullName === repositoryFullName &&
      node.path === path &&
      node.parentId &&
      ALLOWED_STATUSES.has(node.status)
    );
    if (matches.length !== 1) {
      unmatchedPaths.push(path);
      continue;
    }
    const target = matches[0];
    const chain = [];
    let current = target;
    const seen = new Set();
    let valid = true;
    while (current) {
      const route = routeOf(current);
      if (seen.has(route)) { valid = false; break; }
      seen.add(route);
      chain.unshift(current);
      if (current.level === 'A') {
        if (current.parentId !== null) valid = false;
        break;
      }
      const parentRoute = current.parentId;
      const parent = byRoute.get(parentRoute);
      if (!parent || parent.level === current.level || !parentRoute) { valid = false; break; }
      current = parent;
    }
    if (!valid || chain[0]?.level !== 'A' || chain[chain.length - 1] !== target) {
      unmatchedPaths.push(path);
      continue;
    }
    const labels = chain.map(node => node.id);
    routes.push({
      route: labels.join(' → '),
      canonicalRoute: labels.join('/'),
      repositoryFullName,
      path: target.path,
      url: target.url,
      resourceStatus: target.status,
      resourceName: target.name,
      hierarchy: chain.map(node => ({ id: node.id, level: node.level, name: node.name, resourceType: node.resourceType, status: node.status })),
      phase: { id: chain[0].id, name: chain[0].name },
      section: chain.length > 1 ? { id: chain[1].id, name: chain[1].name } : null,
      evidence: { changedPathExactMatch: true, commitSha: evidence.commitSha || null, runUrl: evidence.runUrl || null }
    });
  }
  if (unmatchedPaths.length || routes.length === 0) {
    return unknown('One or more changed paths have no unique exact resource mapping or valid parent chain. Do not guess a replacement path.', routes, unmatchedPaths);
  }
  return { status: 'ROUTED', label: 'Exact registry path match', confidence: 'HIGH', routes, unmatchedPaths: [], reason: 'Every supplied changed path matched exactly one approved-repository resource and a valid canonical parent chain.' };
}
