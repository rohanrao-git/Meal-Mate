import fs from 'node:fs';

const inputPath = process.argv[2] || 'reports/npm-audit.json';
const outputPath = process.argv[3] || 'reports/security-summary.txt';

const failSeverities = new Set(['high', 'critical']);

function severityRank(sev) {
  return { critical: 4, high: 3, moderate: 2, low: 1, info: 0 }[sev] ?? 0;
}

function write(msg) {
  fs.appendFileSync(outputPath, msg + '\n');
  process.stdout.write(msg + '\n');
}

fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync(outputPath, 'Security Scan Summary\n=====================\n\n');

if (!fs.existsSync(inputPath)) {
  write(`No npm audit report found at ${inputPath}.`);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, 'utf8');
const audit = JSON.parse(raw);
const vulnerabilities = audit.vulnerabilities || {};
const entries = Object.entries(vulnerabilities);

if (entries.length === 0) {
  write('No known vulnerabilities reported by npm audit.');
  process.exit(0);
}

const sorted = entries.sort((a, b) => {
  const aSev = a[1]?.severity || 'info';
  const bSev = b[1]?.severity || 'info';
  return severityRank(bSev) - severityRank(aSev);
});

let hasBlocking = false;
write(`Total vulnerable packages: ${sorted.length}`);
write('');

for (const [pkg, details] of sorted.slice(0, 20)) {
  const severity = details.severity || 'unknown';
  const via = Array.isArray(details.via) ? details.via : [];
  const firstVia = via.find((v) => typeof v === 'object') || {};
  const issue = firstVia.title || 'Vulnerability reported in dependency graph.';
  const fixAvailable = details.fixAvailable
    ? typeof details.fixAvailable === 'object'
      ? `Update to ${details.fixAvailable.name}@${details.fixAvailable.version}`
      : 'Fix available via npm audit fix.'
    : 'No automatic fix available. Manual review required.';

  write(`Package: ${pkg}`);
  write(`Issue: ${issue}`);
  write(`Severity: ${severity}`);
  write(`Addressed: ${fixAvailable}`);
  write('');

  if (failSeverities.has(severity)) {
    hasBlocking = true;
  }
}

if (hasBlocking) {
  write('Result: Blocking vulnerabilities found (high/critical). Failing pipeline.');
  process.exit(2);
}

write('Result: Only low/moderate vulnerabilities found. Continuing pipeline.');
