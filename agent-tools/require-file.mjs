import { existsSync } from 'node:fs';

const missing = process.argv.slice(2).filter((p) => !existsSync(p));
for (const p of missing) console.log(`Missing: ${p}`);
process.exit(missing.length === 0 ? 0 : 1);
