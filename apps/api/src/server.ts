import { existsSync } from 'node:fs';
import { buildApp } from './app';
import { openDb } from './db';
import { DB_FILE } from './paths';

if (!existsSync(DB_FILE)) {
  console.error(`No database at ${DB_FILE}. Run "npm run setup" first.`);
  process.exit(1);
}

// The board reads the same on every machine: the clock is pinned unless TASKLANE_CLOCK says otherwise.
const clock = process.env.TASKLANE_CLOCK ?? '2026-09-15T12:00:00.000Z';
const app = buildApp({ db: openDb(DB_FILE), logger: true, now: () => new Date(clock) });
const port = Number(process.env.PORT ?? 3001);

app.listen({ port, host: '127.0.0.1' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
