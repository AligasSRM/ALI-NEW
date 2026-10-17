import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveCoreRoutes } from '../core/route-resolver.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const apiBase = 'https://api.github.com';
const repo = process.env.GITHUB_REPOSITORY || 'AligasSRM/ALI-NEW';
const token = process.env.GITHUB_TOKEN;
const eventName = process.env.GITHUB_EVENT_NAME || 'workflow_dispatch';
const eventPath = process.env.GITHUB_EVENT_PATH;
const reportPath = path.join(root, 'artifacts', 'core-diagnostic-report.json');

function parseRunId(body = '') {
  const inline = body.match(/^\s*(?:Run ID|Workflow Run ID|رقم التشغيل)\s*:\s*(\d+)\s*$/im);
  if (inline) return inline[1];
  const formField = body.match(/^###\s+GitHub Actions Run ID\s*\r?\n\s*(\d+)\s*$/im);
  return formField?.[1] || '';
}

function parseExactPaths(value = '') {
  const candidates = value.split(/\r?\n/).map(item => item.trim());
  return [...new Set(candidates.filter(item =>
    item &&
    !/\s/.test(item) &&
    !/[`<>|]/.test(item) &&
    !item.startsWith('/') &&
    !item.split('/').some(segment => segment === '..' || segment === '.')
  ))];
}

function parseIssuePaths(body = '') {
  const match = body.match(/^###\s+Exact changed paths(?: \(optional\))?\s*\r?\n([\s\S]*)/im);
  if (!match) return [];
  const section = match[1].split(/^###\s+/m)[0].replace(/^_No response_\s*$/im, '');
  return parseExactPaths(section);
}

function safeText(value, max = 500) {
  return String(value ?? '').replace(/[\r\n\t]+/g, ' ').replace(/[`<>]/g, '').slice(0, max);
}

async function githubGet(apiPath) {
  const response = await fetch(apiBase + apiPath, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + token,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'ALI-ALEX-CORE-read-only-diagnostics'
    }
  });
  if (!response.ok) {
    const error = new Error(`GitHub API returned HTTP ${response.status} for ${apiPath}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function githubPostComment(issueNumber, body) {
  const response = await fetch(`${apiBase}/repos/${repo}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: 'Bearer ' + token,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'ALI-ALEX-CORE-read-only-diagnostics'
    },
    body: JSON.stringify({ body })
  });
  if (!response.ok) throw new Error(`Unable to write diagnostic result comment: HTTP ${response.status}`);
}

function makeReport({ runId, issueNumber, changedPaths, run, commit, jobs, route, errors = [] }) {
  const failedSteps = [];
  for (const job of jobs || []) {
    for (const step of job.steps || []) {
      if (step.conclusion === 'failure') {
        failedSteps.push({
          job: safeText(job.name),
          step: safeText(step.name),
          conclusion: 'failure'
        });
      }
    }
  }
  return {
    schemaVersion: 1,
    system: 'ALI & ALEX CORE',
    mode: 'READ_ONLY_DIAGNOSTIC',
    generatedAt: new Date().toISOString(),
    repository: repo,
    source: issueNumber ? { type: 'github_issue', issueNumber } : { type: 'workflow_dispatch' },
    input: { runId: runId || null, exactPathsProvided: changedPaths },
    workflow: run ? {
      id: run.id,
      name: safeText(run.name),
      htmlUrl: run.html_url,
      status: run.status,
      conclusion: run.conclusion,
      headBranch: run.head_branch,
      headSha: run.head_sha,
      event: run.event
    } : null,
    commit: commit ? {
      sha: commit.sha,
      htmlUrl: commit.html_url,
      changedPaths: (commit.files || []).map(file => file.filename).filter(Boolean)
    } : null,
    failedSteps,
    route,
    errors
  };
}

function formatIssueComment(report) {
  const lines = [
    '## ALI & ALEX CORE — Diagnostic result',
    '',
    `- **Mode:** READ-ONLY — no repository files were changed.`,
    `- **Status:** ${report.route.status}`,
    `- **Confidence:** ${report.route.confidence}`,
    `- **Repository:** ${report.repository}`,
    `- **Workflow run:** ${report.workflow?.htmlUrl || 'not supplied'}`,
    `- **Commit:** ${report.commit?.sha || 'not established'}`,
    `- **Failed steps observed:** ${report.failedSteps.length}`,
    '',
    `**Reason:** ${safeText(report.route.reason, 1000)}`,
    ''
  ];
  if (report.route.routes?.length) {
    lines.push('### Exact registry routes');
    for (const item of report.route.routes) {
      lines.push(`- ${item.route} — \`${item.path}\` — [open file](${item.url})`);
    }
    lines.push('');
  }
  if (report.failedSteps.length) {
    lines.push('### Failed workflow steps (metadata only)');
    for (const step of report.failedSteps) lines.push(`- ${step.job} / ${step.step}`);
    lines.push('');
  }
  if (report.route.unmatchedPaths?.length) {
    lines.push('### Unmapped paths');
    for (const item of report.route.unmatchedPaths) lines.push(`- \`${safeText(item, 300)}\``);
    lines.push('');
  }
  if (report.errors.length) {
    lines.push('### Collection limitations');
    for (const error of report.errors) lines.push(`- ${safeText(error, 500)}`);
    lines.push('');
  }
  lines.push('The report contains metadata only. It does not fetch full logs, infer root cause, modify code, create a branch, or deploy.');
  return lines.join('\n');
}

async function main() {
  if (!token) throw new Error('GITHUB_TOKEN is required; refusing to continue without scoped GitHub authorization.');
  let event = {};
  if (eventPath && fs.existsSync(eventPath)) event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));

  const issue = event.issue || null;
  if (eventName === 'issues' && issue?.user?.login !== 'AligasSRM') {
    throw new Error('Untrusted issue author; diagnostic workflow is restricted to the repository owner.');
  }
  const issueNumber = issue?.number ? String(issue.number) : (process.env.INPUT_ISSUE_NUMBER || '').trim();
  const manualRunId = (process.env.INPUT_RUN_ID || '').trim();
  const runId = manualRunId || parseRunId(issue?.body || '');
  const manualPaths = [...parseExactPaths(process.env.INPUT_CHANGED_PATHS || ''), ...parseIssuePaths(issue?.body || '')];
  const errors = [];
  let run = null;
  let commit = null;
  let jobs = [];
  let paths = [...manualPaths];

  if (runId) {
    if (!/^\d+$/.test(runId)) throw new Error('Run ID must contain digits only.');
    try {
      run = await githubGet(`/repos/${repo}/actions/runs/${runId}`);
      if (run.head_sha && /^[0-9a-f]{40}$/i.test(run.head_sha)) {
        commit = await githubGet(`/repos/${repo}/commits/${run.head_sha}`);
        paths.push(...(commit.files || []).map(file => file.filename).filter(Boolean));
      } else {
        errors.push('The selected workflow run did not expose a valid commit SHA.');
      }
      try {
        const jobsResponse = await githubGet(`/repos/${repo}/actions/runs/${runId}/jobs?per_page=100`);
        jobs = jobsResponse.jobs || [];
      } catch (error) {
        errors.push('Failed-step metadata unavailable: ' + error.message);
      }
    } catch (error) {
      errors.push('Workflow/commit evidence could not be collected: ' + error.message);
    }
  } else {
    errors.push('No workflow Run ID supplied. Add a line such as "Run ID: 39048168421" to the issue body or use workflow_dispatch.');
  }

  paths = [...new Set(paths)];
  let route;
  if (paths.length) {
    const registry = JSON.parse(fs.readFileSync(path.join(root, 'core', 'registry.json'), 'utf8'));
    route = resolveCoreRoutes(registry, {
      repositoryFullName: repo,
      changedPaths: paths,
      commitSha: commit?.sha || run?.head_sha || null,
      runUrl: run?.html_url || null
    });
  } else {
    route = {
      status: 'UNKNOWN',
      label: 'UNKNOWN — targeted investigation required',
      confidence: 'NONE',
      routes: [],
      unmatchedPaths: [],
      reason: 'No verified changed paths were available; CORE refused to guess a destination.'
    };
  }

  const report = makeReport({ runId, issueNumber, changedPaths: manualPaths, run, commit, jobs, route, errors });
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  const comment = formatIssueComment(report);
  if (issueNumber) {
    if (!/^\d+$/.test(issueNumber)) throw new Error('Issue number must contain digits only.');
    if (eventName === 'issues' && String(issue?.number) !== issueNumber) throw new Error('Issue identity mismatch; refusing to comment.');
    await githubPostComment(issueNumber, comment);
  }
  const summary = [
    '# ALI & ALEX CORE — Read-only diagnostic',
    '',
    `- Status: **${route.status}**`,
    `- Confidence: **${route.confidence}**`,
    `- Repository: ${repo}`,
    `- Workflow run: ${run?.html_url || 'not supplied'}`,
    `- Failed steps: ${report.failedSteps.length}`,
    `- Route count: ${route.routes?.length || 0}`,
    `- Unmapped path count: ${route.unmatchedPaths?.length || 0}`,
    '',
    safeText(route.reason, 1000),
    '',
    'Read-only: no code changes, repository writes, or deployments were performed.'
  ].join('\n');
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + '\n');
  console.log(JSON.stringify({ reportPath, status: route.status, confidence: route.confidence, routeCount: route.routes?.length || 0, failedSteps: report.failedSteps.length, issueNumber: issueNumber || null }, null, 2));
}

export { parseRunId, parseExactPaths, parseIssuePaths, makeReport, formatIssueComment };
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error('CORE diagnostic stopped safely:', error.message);
    process.exitCode = 1;
  });
}
