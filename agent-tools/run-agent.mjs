import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { ensureDir, trace } from './lib.mjs';

// Optional: runs a subagent headless with the claude command and saves each answer under runs/.
// Without the claude command, run the agent in the Code tab and save its answer to the same folder.
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const args = process.argv.slice(2);
  const flag = (name, fallback) => {
    const i = args.indexOf(name);
    return i >= 0 ? args[i + 1] : fallback;
  };
  const agent = args.find((a) => !a.startsWith('--'));
  const promptFile = flag('--prompt-file');
  if (!agent || !promptFile) {
    console.error(
      'Usage: node agent-tools/run-agent.mjs <agent> --prompt-file <file> [--runs 1] [--out runs/<agent>] [--budget 1] [--timeout 600] [--ext md]',
    );
    process.exit(2);
  }
  if (spawnSync('claude', ['--version'], { stdio: 'ignore' }).status !== 0) {
    console.error(
      'The claude command is not installed. That is fine: run the agent in the Code tab and save each answer in the output folder.',
    );
    process.exit(2);
  }
  const runs = Number(flag('--runs', 1));
  const out = flag('--out', `runs/${agent}`);
  const ext = flag('--ext', 'md');
  const prompt = `Use the ${agent} subagent for this task.\n\n${readFileSync(promptFile, 'utf8')}`;
  for (let n = 1; n <= runs; n++) {
    const started = Date.now();
    const res = spawnSync(
      'claude',
      ['-p', prompt, '--output-format', 'text', '--max-budget-usd', flag('--budget', '1')],
      { encoding: 'utf8', timeout: Number(flag('--timeout', 600)) * 1000 },
    );
    const file = `${out}/run-${n}.${ext}`;
    ensureDir(file);
    writeFileSync(file, res.stdout ?? '');
    trace({ stage: `agent:${agent}`, file, exit: res.status ?? 124, ms: Date.now() - started });
    console.log(`run ${n} of ${runs}: ${file} (exit ${res.status ?? 'timeout'})`);
  }
}
