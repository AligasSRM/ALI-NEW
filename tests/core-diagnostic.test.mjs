import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseRunId, parseExactPaths, parseIssuePaths, makeReport, formatIssueComment } from '../scripts/run-core-diagnostic.mjs';
import { resolveCoreRoutes } from '../core/route-resolver.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registry = JSON.parse(fs.readFileSync(path.join(root, 'core', 'registry.json'), 'utf8'));

test('extracts only a numeric run ID from an explicit issue field', () => {
  assert.equal(parseRunId('Problem summary\nRun ID: 39048168421\nMore detail'), '39048168421');
  assert.equal(parseRunId('The number 39048168421 appears in free text'), '');
  assert.equal(parseRunId('Run ID: abc'), '');
  assert.equal(parseRunId('### GitHub Actions Run ID\n39048168421'), '39048168421');
});

test('normalizes exact paths and rejects prose or unsafe path segments', () => {
  assert.deepEqual(parseExactPaths('index.html\n\nindex.html\n core/registry.json \nThis text is not a file path\n../secrets.txt\n/absolute/path'), ['index.html', 'core/registry.json']);
});

test('extracts exact paths from the structured issue form only', () => {
  const body = '### Observed symptom\nBuild failed\n\n### Exact changed paths (optional)\ncore/route-resolver.mjs\ntests/core-route-resolver.test.mjs\n\n### Extra section\nignore/me';
  assert.deepEqual(parseIssuePaths(body), ['core/route-resolver.mjs', 'tests/core-route-resolver.test.mjs']);
  assert.deepEqual(parseIssuePaths('### Observed symptom\nindex.html'), []);
});

test('routes a known exact path using the repository registry', () => {
  const route = resolveCoreRoutes(registry, {
    repositoryFullName: 'AligasSRM/ALI-NEW',
    changedPaths: ['core/route-resolver.mjs'],
    commitSha: '9820b861c20bc1fc61f5c57e84d63bb667663c71',
    runUrl: 'https://github.com/AligasSRM/ALI-NEW/actions/runs/39048168421'
  });
  assert.equal(route.status, 'ROUTED');
  assert.equal(route.confidence, 'HIGH');
  assert.equal(route.routes[0].path, 'core/route-resolver.mjs');
});

test('unknown paths stay UNKNOWN rather than guessing', () => {
  const route = resolveCoreRoutes(registry, {
    repositoryFullName: 'AligasSRM/ALI-NEW',
    changedPaths: ['not/a/real/registry/path.txt']
  });
  assert.equal(route.status, 'UNKNOWN');
  assert.deepEqual(route.unmatchedPaths, ['not/a/real/registry/path.txt']);
});

test('issue comment explicitly describes read-only scope and limitations', () => {
  const route = resolveCoreRoutes(registry, {
    repositoryFullName: 'AligasSRM/ALI-NEW',
    changedPaths: ['core/route-resolver.mjs']
  });
  const report = makeReport({
    runId: '39048168421',
    issueNumber: '7',
    changedPaths: [],
    run: { id: 39048168421, name: 'Test run', html_url: 'https://github.com/AligasSRM/ALI-NEW/actions/runs/39048168421', status: 'completed', conclusion: 'success', head_branch: 'main', head_sha: '9820b861c20bc1fc61f5c57e84d63bb667663c71', event: 'push' },
    commit: { sha: '9820b861c20bc1fc61f5c57e84d63bb667663c71', html_url: 'https://github.com/AligasSRM/ALI-NEW/commit/9820b861c20bc1fc61f5c57e84d63bb667663c71', files: [{ filename: 'core/route-resolver.mjs' }] },
    jobs: [{ name: 'checks', steps: [{ name: 'unit test', conclusion: 'failure' }] }],
    route
  });
  const comment = formatIssueComment(report);
  assert.match(comment, /READ-ONLY/);
  assert.match(comment, /A3/);
  assert.match(comment, /unit test/);
  assert.match(comment, /does not fetch full logs/);
});




test('pull-request diagnostics have no write permission and trusted diagnostics use default-branch code', () => {
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'core-diagnostic.yml'), 'utf8');
  const prStart = workflow.indexOf('  diagnose_pull_request:');
  const trustedStart = workflow.indexOf('  diagnose_trusted:', prStart);
  const pullRequestJob = prStart >= 0 && trustedStart > prStart ? workflow.slice(prStart, trustedStart) : '';
  const trustedJob = trustedStart >= 0 ? workflow.slice(trustedStart) : '';

  assert.notEqual(pullRequestJob, '');
  assert.ok(pullRequestJob.includes("if: github.event_name == 'pull_request'"));
  assert.ok(pullRequestJob.includes('contents: read'));
  assert.ok(pullRequestJob.includes('actions: read'));
  assert.ok(!pullRequestJob.includes('issues: write'));
  assert.ok(trustedJob.includes("if: github.event_name == 'workflow_dispatch' || (github.event_name == 'issues'"));
  assert.ok(trustedJob.includes('issues: write'));
  assert.ok(trustedJob.includes('ref: ${{ github.event.repository.default_branch }}'));
});
