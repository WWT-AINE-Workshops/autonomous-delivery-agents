import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { mark } from './lib.mjs';

const SECTIONS = ['Scope', 'Out of scope', 'Acceptance criteria'];

function sectionBody(text, name) {
  const re = new RegExp(`^##\\s+${name}\\s*$`, 'im');
  const m = re.exec(text);
  if (!m) return null;
  const rest = text.slice(m.index + m[0].length);
  const next = /^##\s+/m.exec(rest);
  return (next ? rest.slice(0, next.index) : rest).trim();
}

// Returns a list of problems. An empty list means the spec passes.
export function lintSpec(text) {
  const problems = [];
  for (const name of SECTIONS) {
    const body = sectionBody(text, name);
    if (body === null) problems.push(`missing section "${name}"`);
    else if (body.length === 0) problems.push(`section "${name}" is empty`);
  }
  const criteria = (sectionBody(text, 'Acceptance criteria') ?? '')
    .split('\n')
    .filter((l) => /^\s*(?:[-*]|\d+\.)\s+/.test(l));
  if (criteria.length === 0) problems.push('no acceptance criteria listed');
  for (const line of criteria) {
    if (!/`[^`]+`/.test(line)) {
      problems.push(`criterion has no runnable check in backticks: ${line.trim().slice(0, 60)}`);
    }
  }
  return problems;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error('Usage: node agent-tools/spec-lint.mjs <spec.md> [more.md ...]');
    process.exit(2);
  }
  let failed = 0;
  for (const file of files) {
    const problems = lintSpec(readFileSync(file, 'utf8'));
    console.log(`${mark(problems.length === 0)} ${file}`);
    for (const p of problems) console.log(`    - ${p}`);
    if (problems.length > 0) failed++;
  }
  process.exit(failed > 0 ? 1 : 0);
}
