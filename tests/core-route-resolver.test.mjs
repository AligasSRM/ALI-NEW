import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveCoreRoutes } from '../core/route-resolver.mjs';

const registry = JSON.parse(await readFile(new URL('../core/registry.json', import.meta.url), 'utf8'));

test('routes an exact changed path to its canonical A/B/C address', () => {
  const result = resolveCoreRoutes(registry, {
    repositoryFullName: 'AligasSRM/ALI-NEW',
    changedPaths: ['tests/ali-new-a0.spec.ts'],
    commitSha: '0123456789012345678901234567890123456789',
    runUrl: 'https://github.com/AligasSRM/ALI-NEW/actions/runs/1'
  });
  assert.equal(result.status, 'ROUTED');
  assert.equal(result.confidence, 'HIGH');
  assert.equal(result.routes.length, 1);
  assert.equal(result.routes[0].route, 'A0 → B2 → C0');
  assert.equal(result.routes[0].evidence.changedPathExactMatch, true);
});

test('returns UNKNOWN instead of guessing an unmapped path', () => {
  const result = resolveCoreRoutes(registry, {
    repositoryFullName: 'AligasSRM/ALI-NEW',
    changedPaths: ['src/not-in-this-repository.ts']
  });
  assert.equal(result.status, 'UNKNOWN');
  assert.equal(result.label, 'UNKNOWN — targeted investigation required');
  assert.deepEqual(result.unmatchedPaths, ['src/not-in-this-repository.ts']);
});

test('refuses a repository that is not approved in the registry', () => {
  const result = resolveCoreRoutes(registry, {
    repositoryFullName: 'someone/else',
    changedPaths: ['tests/ali-new-a0.spec.ts']
  });
  assert.equal(result.status, 'UNKNOWN');
  assert.equal(result.routes.length, 0);
});

test('partial matches preserve exact routes and flag unmatched paths', () => {
  const result = resolveCoreRoutes(registry, {
    repositoryFullName: 'AligasSRM/ALI-NEW',
    changedPaths: ['tests/ali-new-a0.spec.ts', 'made-up/file.ts']
  });
  assert.equal(result.status, 'UNKNOWN');
  assert.equal(result.confidence, 'PARTIAL_EXACT_MATCH');
  assert.equal(result.routes.length, 1);
  assert.deepEqual(result.unmatchedPaths, ['made-up/file.ts']);
});

test('requires exact changed paths; free-text alone cannot create a route', () => {
  const result = resolveCoreRoutes(registry, {
    repositoryFullName: 'AligasSRM/ALI-NEW',
    errorText: 'The test file tests/ali-new-a0.spec.ts failed'
  });
  assert.equal(result.status, 'UNKNOWN');
  assert.equal(result.routes.length, 0);
});
