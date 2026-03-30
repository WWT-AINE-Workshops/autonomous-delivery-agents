import { existsSync, readFileSync } from 'node:fs';

const file = process.argv[2] ?? 'runs/trace.jsonl';
if (!existsSync(file)) {
  console.error(`No trace at ${file}. Run a stage first: every script writes one line per step.`);
  process.exit(2);
}
const rows = readFileSync(file, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l));
console.log('time (UTC)            stage              exit  detail');
for (const r of rows) {
  const detail = r.cmd ?? r.file ?? (r.iteration ? `iteration ${r.iteration}` : '');
  console.log(
    `${r.ts.slice(0, 19)}  ${String(r.stage).padEnd(18)} ${String(r.exit ?? '').padEnd(5)} ${detail}`,
  );
}
const total = rows.reduce((n, r) => n + (r.ms ?? 0), 0);
console.log(`\n${rows.length} steps, ${total} ms in timed stages.`);
