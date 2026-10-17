import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const failures = [];
const sources = ['index.html', 'design-preview/index.html'];
const sourceByPath = new Map();

for (const path of sources) {
  const html = await readFile(path, 'utf8');
  sourceByPath.set(path, html);
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicates.length) failures.push(path + ' duplicate IDs: ' + duplicates.join(', '));

  const targets = [...html.matchAll(/\bdata-target=["']([^"']+)["']/g)].map(m => m[1]);
  const missingTargets = targets.filter(id => !ids.includes(id));
  if (missingTargets.length) failures.push(path + ' missing navigation targets: ' + missingTargets.join(', '));

  const buttons = [...html.matchAll(/<button\b([^>]*)>/gi)].map(m => m[1]);
  const untypedButtons = buttons.filter(attrs => !/\btype\s*=/.test(attrs));
  if (untypedButtons.length) failures.push(path + ' has ' + untypedButtons.length + ' buttons without explicit type');

  const anchors = [...html.matchAll(/<a\b[^>]*href=["']([^"']*)["'][^>]*>/gi)];
  const emptyLinks = anchors.filter(m => !m[1].trim());
  if (emptyLinks.length) failures.push(path + ' has ' + emptyLinks.length + ' empty links');
  const unsafeBlankLinks = anchors.filter(m => /\btarget=["']_blank["']/i.test(m[0]) && !/\brel=["'][^"']*noopener/i.test(m[0]));
  if (unsafeBlankLinks.length) failures.push(path + ' has ' + unsafeBlankLinks.length + ' target=_blank links without rel=noopener');

  const inlineScripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
  if (inlineScripts.trim()) {
    const syntax = spawnSync(process.execPath, ['--check', '-'], { input: inlineScripts, encoding: 'utf8' });
    if (syntax.status !== 0) failures.push(path + ' inline JavaScript syntax failed: ' + (syntax.stderr || syntax.stdout).trim());
  }
  console.log(path + ': ' + ids.length + ' IDs, ' + targets.length + ' navigation targets, ' + buttons.length + ' buttons, ' + anchors.length + ' links.');
}

if (failures.length) {
  for (const failure of failures) console.error('FAIL: ' + failure);
  process.exitCode = 1;
} else {
  console.log('A0 source invariants and inline JavaScript syntax: PASS for the root Ali Tree and design preview.');
}

for (const [path, html] of sourceByPath) {
  const response = await fetch('https://validator.w3.org/nu/?out=json', {
    method: 'POST',
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'User-Agent': 'ALI-NEW-A0-Validation/1.0' },
    body: html,
    signal: AbortSignal.timeout(45000)
  });
  if (!response.ok) {
    console.error('Nu HTML Checker failed for ' + path + ' with HTTP ' + response.status);
    process.exitCode = 1;
    continue;
  }
  const report = await response.json();
  const messages = report.messages || [];
  const errors = messages.filter(m => m.type === 'error');
  const warnings = messages.filter(m => m.type === 'info' && m.subType === 'warning');
  console.log(path + ' — Nu HTML Checker: ' + errors.length + ' errors, ' + warnings.length + ' warnings.');
  for (const message of [...errors, ...warnings]) {
    const location = message.lastLine ? 'line ' + message.lastLine + (message.lastColumn ? ':' + message.lastColumn : '') + ': ' : '';
    console.log(message.type.toUpperCase() + ': ' + path + ' ' + location + message.message);
  }
  if (errors.length) process.exitCode = 1;
}
