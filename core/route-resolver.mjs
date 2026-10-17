const ALLOWED_STATUSES = new Set(['PLANNED', 'UNMAPPED', 'YELLOW', 'ORANGE', 'GREEN', 'LOCKED', 'RED', 'RETIRED']);

export function resolveCoreRoutes(registry, evidence) {
  if (!registry || !Array.isArray(registry.repositories) || !Array.isArray(registry.nodes)) {
    return { status: 'UNKNOWN', label: 'UNKNOWN — targeted investigation required', confidence: 'NONE', routes: [], reason: 'Registry structure is unavailable or invalid.' };
  }
  const repositoryFullName = typeof evidence?.repositoryFullName === 'string' ? evidence.repositoryFullName.trim() : '';
  const paths = Array.isArray(evidence?.changedPaths) ? [...new Set(evidence.changedPaths.filter(p => typeof p === 'string' && p.length > 0))] : [];
  if (!repositoryFullName || paths.length === 0) {
    return { status: 'UNKNOWN', label: 'UNKNOWN — targeted investigation required', confidence: 'NONE', routes: [], reason: 'Exact repository name and at least one changed path are required; keywords alone are not sufficient.' };
  }
  const repository = registry.repositories.find(repo => repo.fullName === repositoryFullName && repo.approvalStatus === 'APPROVED');
  if (!repository) {
    return { status: 'UNKNOWN', label: 'UNKNOWN — targeted investigation required', confidence: 'NONE', routes: [], reason: 'Repository is not present in the approved registry.' };
  }
  const routes = [];
  const unmatchedPaths = [];
  for (const path of paths) {
    const matches = registry.nodes.filter(node =>
      node.level === 'C' &&
      node.repositoryFullName === repositoryFullName &&
      node.path === path &&
      node.parentId &&
      ALLOWED_STATUSES.has(node.status)
    );
    if (matches.length !== 1) {
      unmatchedPaths.push(path);
      continue;
    }
    const node = matches[0];
    const parentParts = node.parentId.split('/');
    if (parentParts.length !== 2) {
      unmatchedPaths.push(path);
      continue;
    }
    const phase = registry.nodes.find(item => item.level === 'A' && item.id === parentParts[0]);
    const section = registry.nodes.find(item => item.level === 'B' && item.id === parentParts[1] && item.parentId === parentParts[0]);
    if (!phase || !section) {
      unmatchedPaths.push(path);
      continue;
    }
    routes.push({
      route: phase.id + ' → ' + section.id + ' → ' + node.id,
      repositoryFullName,
      path: node.path,
      url: node.url,
      resourceStatus: node.status,
      resourceName: node.name,
      phase: { id: phase.id, name: phase.name },
      section: { id: section.id, name: section.name },
      evidence: { changedPathExactMatch: true, commitSha: evidence.commitSha || null, runUrl: evidence.runUrl || null }
    });
  }
  if (unmatchedPaths.length || routes.length === 0) {
    return {
      status: 'UNKNOWN',
      label: 'UNKNOWN — targeted investigation required',
      confidence: routes.length ? 'PARTIAL_EXACT_MATCH' : 'NONE',
      routes,
      unmatchedPaths,
      reason: 'One or more changed paths have no unique, verified C-node mapping. Do not guess a replacement path.'
    };
  }
  return {
    status: 'ROUTED',
    label: 'Exact registry path match',
    confidence: 'HIGH',
    routes,
    unmatchedPaths: [],
    reason: 'Every supplied changed path matched exactly one approved-repository C node and its verified A/B parents.'
  };
}
