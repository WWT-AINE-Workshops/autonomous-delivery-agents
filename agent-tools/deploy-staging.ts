import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildApp } from '../apps/api/src/app';
import { openDb } from '../apps/api/src/db';
import { resetDatabase } from '../apps/api/src/seed';
import { trace } from './lib.mjs';

// A simulated non-prod environment: a database file under .staging/ plus a record of the live release.
const DIR = '.staging';
const DB = join(DIR, 'staging.db');
const STATE = join(DIR, 'current.json');
const NOW = new Date('2026-09-15T12:00:00.000Z');

const args = process.argv.slice(2);
const command = args[0] && !args[0].startsWith('--') ? args[0] : 'deploy';
const flag = (name: string, fallback?: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
};

function state(): { release: string; previous: string | null; rolledBack?: boolean } {
  return existsSync(STATE)
    ? JSON.parse(readFileSync(STATE, 'utf8'))
    : { release: 'none', previous: null };
}

async function smoke(kind: string): Promise<boolean> {
  const db = openDb(DB);
  const app = buildApp({ db, now: () => NOW });
  const paths =
    kind === 'full'
      ? ['/api/health', '/api/tasks?status=todo', '/api/summary', '/api/tasks/1']
      : ['/api/health'];
  let ok = true;
  for (const url of paths) {
    const res = await app.inject({ method: 'GET', url });
    console.log(`${res.statusCode === 200 ? '✓' : '✗'} GET ${url} -> ${res.statusCode}`);
    if (res.statusCode !== 200) ok = false;
  }
  db.close();
  return ok;
}

function rollback(): void {
  const { release, previous, rolledBack } = state();
  if (rolledBack) {
    console.log(`Staging is already on ${release}. There is nothing to roll back.`);
    return;
  }
  const backup = join(DIR, `backup-before-${release}.db`);
  if (!existsSync(backup)) {
    console.error(`No backup for ${release}: nothing to roll back to.`);
    process.exit(2);
  }
  copyFileSync(backup, DB);
  writeFileSync(
    STATE,
    JSON.stringify({ release: previous ?? 'none', previous: null, rolledBack: true }),
  );
  console.log(`Rolled back ${release}. Staging is on ${previous ?? 'none'}.`);
  trace({ stage: 'deploy-staging', cmd: `rollback ${release}`, exit: 0 });
}

if (command === 'rollback') {
  rollback();
} else if (command === 'status') {
  console.log(JSON.stringify(state()));
} else {
  const env = flag('--env', 'staging');
  if (env !== 'staging') {
    console.error('Only staging can be deployed here. Production needs a human and a ticket.');
    process.exit(4);
  }
  const release = flag('--release');
  if (!release || !existsSync(join('ops', 'releases', release, 'migration.sql'))) {
    console.error(
      'Usage: npm run deploy:staging -- --release <r41|r42> [--smoke health|full] [--auto-rollback]',
    );
    process.exit(2);
  }
  mkdirSync(DIR, { recursive: true });
  const current = state();
  if (current.release === release && !current.rolledBack) {
    console.log(`${release} is already live on staging. Running the smoke test only.`);
    const same = await smoke(flag('--smoke', 'health') ?? 'health');
    trace({ stage: 'deploy-staging', cmd: `smoke ${release}`, exit: same ? 0 : 1 });
    if (!same && args.includes('--auto-rollback')) rollback();
    process.exit(same ? 0 : 1);
  }
  if (!existsSync(DB)) {
    const fresh = openDb(DB);
    resetDatabase(fresh);
    fresh.close();
  }
  const before = state();
  const live = openDb(DB);
  live.pragma('wal_checkpoint(TRUNCATE)');
  live.close();
  copyFileSync(DB, join(DIR, `backup-before-${release}.db`));
  const db = openDb(DB);
  db.exec(readFileSync(join('ops', 'releases', release, 'migration.sql'), 'utf8'));
  db.close();
  writeFileSync(
    STATE,
    JSON.stringify({
      release,
      previous: before.release === 'none' || before.release === release ? null : before.release,
    }),
  );
  console.log(`Deployed ${release} to staging.`);
  const ok = await smoke(flag('--smoke', 'health') ?? 'health');
  trace({ stage: 'deploy-staging', cmd: `deploy ${release}`, exit: ok ? 0 : 1 });
  if (!ok && args.includes('--auto-rollback')) rollback();
  process.exit(ok ? 0 : 1);
}
