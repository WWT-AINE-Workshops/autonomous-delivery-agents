import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { ensureDir, mark, trace } from './lib.mjs';

const COUNTER = 'runs/done-iterations.txt';

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

// done.json: { "maxIterations": 5, "criteria": [{ "name", "run" }], "forbid": [{ "name", "pattern", "paths": [] }] }
export function runChecks(
  config,
  run = (cmd) => spawnSync(cmd, { shell: true, stdio: 'pipe' }).status,
) {
  const results = [];
  for (const c of config.criteria ?? []) results.push({ name: c.name, ok: run(c.run) === 0 });
  for (const f of config.forbid ?? []) {
    const re = new RegExp(f.pattern);
    const hits = (f.paths ?? ['.'])
      .filter((p) => existsSync(p))
      .flatMap((p) => (statSync(p).isDirectory() ? walk(p) : [p]))
      .filter((file) => /\.(ts|tsx|js|mjs)$/.test(file) && re.test(readFileSync(file, 'utf8')));
    results.push({ name: f.name, ok: hits.length === 0, detail: hits.join(', ') });
  }
  return results;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2);
  if (args.includes('--reset')) {
    ensureDir(COUNTER);
    writeFileSync(COUNTER, '0');
    console.log('Iteration counter reset.');
    process.exit(0);
  }
  const file = args.find((a) => !a.startsWith('--')) ?? 'done.json';
  if (!existsSync(file)) {
    console.error(`No ${file}. Write one first: it is the definition of done.`);
    process.exit(2);
  }
  const config = JSON.parse(readFileSync(file, 'utf8'));
  const max = config.maxIterations ?? 5;
  const used = (existsSync(COUNTER) ? Number(readFileSync(COUNTER, 'utf8')) : 0) + 1;
  ensureDir(COUNTER);
  writeFileSync(COUNTER, String(used));
  if (used > max) {
    console.log(
      `Iteration cap reached (${max}). Stop, report what is still failing, and ask a human.`,
    );
    trace({ stage: 'done-check', iteration: used, exit: 3 });
    process.exit(3);
  }
  const results = runChecks(config);
  for (const r of results)
    console.log(`${mark(r.ok)} ${r.name}${r.ok || !r.detail ? '' : ` (${r.detail})`}`);
  const ok = results.length > 0 && results.every((r) => r.ok);
  console.log(`\nIteration ${used} of ${max}: ${ok ? 'DONE' : 'NOT DONE'}`);
  trace({ stage: 'done-check', iteration: used, exit: ok ? 0 : 1 });
  process.exit(ok ? 0 : 1);
}
