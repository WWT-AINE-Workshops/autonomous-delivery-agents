import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { validateVerdict } from './verdict-gate.mjs';
import { lintSpec } from './spec-lint.mjs';
import { mark } from './lib.mjs';

const RUBRICS = {
  spec: { dir: 'runs/spec', ext: '.md', problems: (t) => lintSpec(t) },
  verdict: {
    dir: 'runs/verdict',
    ext: '.json',
    problems: (t) => {
      try {
        return validateVerdict(JSON.parse(t));
      } catch (e) {
        return [`not valid JSON: ${e.message}`];
      }
    },
  },
};

// Scores every saved run in a folder against a rubric, and shows how much the runs differ.
export function evaluate(kind, dir, read = (f) => readFileSync(f, 'utf8')) {
  const rubric = RUBRICS[kind];
  if (!rubric) throw new Error(`Unknown kind "${kind}". Use: ${Object.keys(RUBRICS).join(', ')}`);
  const folder = dir ?? rubric.dir;
  const files = readdirSync(folder)
    .filter((f) => f.endsWith(rubric.ext))
    .sort();
  const runs = files.map((f) => {
    const text = read(join(folder, f));
    return { file: f, text, problems: rubric.problems(text) };
  });
  const passed = runs.filter((r) => r.problems.length === 0).length;
  const distinct = new Set(runs.map((r) => r.text.replace(/\s+/g, ' ').trim())).size;
  return { folder, runs, passed, total: runs.length, distinct };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [kind, ...rest] = process.argv.slice(2);
  const arg = (name, fallback) => {
    const i = rest.indexOf(name);
    return i >= 0 ? rest[i + 1] : fallback;
  };
  if (!kind) {
    console.error('Usage: node agent-tools/eval.mjs <spec|verdict> [--dir runs/spec] [--min 4]');
    process.exit(2);
  }
  let result;
  try {
    result = evaluate(kind, arg('--dir'));
  } catch (e) {
    console.error(
      `${e.message}\nSave each run of the agent as a file in that folder, then run this again.`,
    );
    process.exit(2);
  }
  for (const r of result.runs) {
    console.log(`${mark(r.problems.length === 0)} ${r.file}`);
    for (const p of r.problems) console.log(`    - ${p}`);
  }
  console.log(
    `\nPass rate: ${result.passed}/${result.total}. Distinct outputs: ${result.distinct}.`,
  );
  const min = Number(arg('--min', 4));
  process.exit(result.total > 0 && result.passed >= min ? 0 : 1);
}
