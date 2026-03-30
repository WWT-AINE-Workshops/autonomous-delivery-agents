import { appendFileSync, readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { ensureDir, trace } from './lib.mjs';

export const VERDICTS = ['approve', 'block', 'escalate'];
export const SEVERITIES = ['low', 'medium', 'high', 'critical'];

export function validateVerdict(v) {
  const problems = [];
  if (!v || typeof v !== 'object') return ['verdict must be a JSON object'];
  if (!VERDICTS.includes(v.verdict)) problems.push(`verdict must be one of ${VERDICTS.join(', ')}`);
  if (typeof v.reviewer !== 'string' || !v.reviewer) problems.push('reviewer must name the agent');
  if (!Array.isArray(v.findings)) problems.push('findings must be a list');
  else {
    v.findings.forEach((f, i) => {
      if (!SEVERITIES.includes(f?.severity)) problems.push(`findings[${i}].severity is invalid`);
      if (typeof f?.file !== 'string' || !f.file) problems.push(`findings[${i}].file is missing`);
      if (typeof f?.summary !== 'string' || !f.summary)
        problems.push(`findings[${i}].summary is missing`);
    });
  }
  return problems;
}

// 0 = may proceed, 1 = verdict file invalid, 2 = blocked, 3 = needs a human.
export function decide(v, approvedBy) {
  const problems = validateVerdict(v);
  if (problems.length > 0) return { code: 1, message: `invalid verdict: ${problems.join('; ')}` };
  const serious = v.findings.filter((f) => f.severity === 'high' || f.severity === 'critical');
  if (v.verdict === 'block') return { code: 2, message: 'blocked: the reviewer said block' };
  if (v.verdict === 'approve' && serious.length > 0) {
    return {
      code: 2,
      message: `blocked: approve with ${serious.length} high or critical finding(s)`,
    };
  }
  if (v.verdict === 'escalate' && !approvedBy) {
    return {
      code: 3,
      message: 'needs a human: re-run with --approved-by <name> after you have read the findings',
    };
  }
  return { code: 0, message: v.verdict === 'escalate' ? `approved by ${approvedBy}` : 'approved' };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith('--')) ?? 'verdict.json';
  const i = args.indexOf('--approved-by');
  const approvedBy = i >= 0 ? args[i + 1] : undefined;
  let verdict;
  try {
    verdict = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`Cannot read ${file}: ${e.message}`);
    process.exit(1);
  }
  const { code, message } = decide(verdict, approvedBy);
  console.log(message);
  if (code === 0 && approvedBy) {
    ensureDir('runs/approvals.log');
    appendFileSync('runs/approvals.log', `${new Date().toISOString()} ${approvedBy} ${file}\n`);
  }
  trace({ stage: 'verdict-gate', file, exit: code });
  process.exit(code);
}
