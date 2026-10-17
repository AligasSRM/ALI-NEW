import { readFile } from 'node:fs/promises';

const path = 'core/inventory.snapshot.json';
const failures = [];
let inventory;

try {
  inventory = JSON.parse(await readFile(path, 'utf8'));
} catch (error) {
  console.error('FAIL: cannot read valid JSON from ' + path + ': ' + error.message);
  process.exit(1);
}

if (inventory.schemaVersion !== '1.0.0') failures.push('unsupported schemaVersion');
if (inventory.inventoryStatus !== 'PARTIALLY_VERIFIED') failures.push('inventoryStatus must remain PARTIALLY_VERIFIED until hierarchy mapping is complete');
if (inventory.repository?.fullName !== 'AligasSRM/ALI-NEW') failures.push('unexpected repository fullName');
if (inventory.repository?.defaultBranch !== 'main') failures.push('unexpected default branch');
if (!/^[0-9a-f]{40}$/.test(inventory.sourceCommit || '')) failures.push('sourceCommit must be a full 40-character commit SHA');
if (!Array.isArray(inventory.files) || inventory.files.length === 0) failures.push('files must be a non-empty array');

const seenPaths = new Set();
const seenShas = new Set();
let unmapped = 0;

for (const [index, file] of (inventory.files || []).entries()) {
  const label = 'files[' + index + ']';
  if (!file || typeof file !== 'object') {
    failures.push(label + ' must be an object');
    continue;
  }
  if (typeof file.path !== 'string' || !file.path || file.path.startsWith('/') || file.path.split('/').includes('..')) {
    failures.push(label + ' has an invalid repository-relative path');
  } else if (seenPaths.has(file.path)) {
    failures.push('duplicate path: ' + file.path);
  } else {
    seenPaths.add(file.path);
  }
  if (!/^[0-9a-f]{40}$/.test(file.blobSha || '')) failures.push(label + ' has an invalid blob SHA');
  if (!Number.isInteger(file.sizeBytes) || file.sizeBytes < 0) failures.push(label + ' has invalid sizeBytes');
  const expectedUrl = 'https://github.com/AligasSRM/ALI-NEW/blob/main/' + file.path;
  if (file.url !== expectedUrl) failures.push(label + ' URL does not match its exact path: ' + file.path);
  if (file.mappingStatus === 'UNMAPPED') unmapped++;
  else failures.push(label + ' must remain explicitly UNMAPPED until a verified A/B/C assignment exists');
}

if (inventory.counts?.files !== inventory.files?.length) failures.push('counts.files does not match files.length');
if (inventory.counts?.unmapped !== unmapped) failures.push('counts.unmapped does not match actual unmapped records');

console.log('CORE inventory snapshot: ' + (inventory.files || []).length + ' files; ' + unmapped + ' explicitly unmapped.');
console.log('Source commit: ' + (inventory.sourceCommit || 'MISSING'));
if (failures.length) {
  for (const failure of failures) console.error('FAIL: ' + failure);
  process.exitCode = 1;
} else {
  console.log('CORE inventory structural validation: PASS.');
}
