import { appendFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function ensureDir(file) {
  mkdirSync(dirname(file), { recursive: true });
}

// One JSON line per event. trace.mjs reads this file.
export function trace(event, file = 'runs/trace.jsonl') {
  ensureDir(file);
  appendFileSync(file, `${JSON.stringify({ ts: new Date().toISOString(), ...event })}\n`);
}

export const mark = (ok) => (ok ? '✓' : '✗');
