import { readFileSync } from 'node:fs';
import { makeTestApp } from '../apps/api/test/helpers';

// An acceptance file lists requests and what must come back. It is the machine-checkable "done" for a spec.
// { "name": "...", "now": "2026-09-15T12:00:00Z", "steps": [{ "before"?: "SQL", "method", "url", "body"?, "status", "json"? }] }
interface Step {
  before?: string;
  method: 'GET' | 'POST' | 'PATCH';
  url: string;
  body?: object;
  status: number;
  json?: Record<string, unknown>;
}

const file = process.argv[2];
if (!file) {
  console.error('Usage: npx tsx agent-tools/accept.ts <spec.acceptance.json>');
  process.exit(2);
}
const spec = JSON.parse(readFileSync(file, 'utf8')) as {
  name: string;
  now?: string;
  steps: Step[];
};

let failed = 0;
for (const [i, step] of spec.steps.entries()) {
  const now = spec.now ? new Date(spec.now) : undefined;
  const { app, db } = makeTestApp(now ? { now: () => now } : {});
  if (step.before) db.exec(step.before);
  const res = await app.inject({ method: step.method, url: step.url, payload: step.body });
  const body = res.body ? JSON.parse(res.body) : {};
  const wrong = Object.entries(step.json ?? {}).filter(
    ([k, v]) => JSON.stringify(body[k]) !== JSON.stringify(v),
  );
  const ok = res.statusCode === step.status && wrong.length === 0;
  if (!ok) failed++;
  const why = ok
    ? ''
    : ` (got ${res.statusCode}${wrong.map(([k]) => `, ${k}=${JSON.stringify(body[k])}`).join('')})`;
  console.log(`${ok ? '✓' : '✗'} ${i + 1}. ${step.method} ${step.url} -> ${step.status}${why}`);
}
console.log(`\n${spec.name}: ${spec.steps.length - failed} of ${spec.steps.length} steps pass`);
process.exit(failed > 0 ? 1 : 0);
