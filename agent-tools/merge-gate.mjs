import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { decide } from './verdict-gate.mjs';
import { trace } from './lib.mjs';

const MERGE = /\b(git\s+merge|gh\s+pr\s+merge)\b/;

// A PreToolUse hook for the Bash tool. It reads the tool call as JSON on stdin and blocks a merge
// (exit 2, with the reason on stderr) unless the verdict file lets it through.
export function check(input, readVerdict = () => JSON.parse(readFileSync('verdict.json', 'utf8'))) {
  const command = input?.tool_input?.command ?? '';
  if (!MERGE.test(command)) return { code: 0, message: '' };
  let verdict;
  try {
    verdict = readVerdict();
  } catch {
    return {
      code: 2,
      message: 'Merge blocked: there is no readable verdict.json. Run the review first.',
    };
  }
  const { code, message } = decide(verdict, process.env.APPROVED_BY);
  return code === 0
    ? { code: 0, message: '' }
    : { code: 2, message: `Merge blocked by the verdict gate: ${message}` };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  let input = {};
  try {
    input = JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    // No readable input: let the normal permission flow decide.
  }
  const { code, message } = check(input);
  if (message) console.error(message);
  if (MERGE.test(input?.tool_input?.command ?? '')) trace({ stage: 'merge-gate', exit: code });
  process.exit(code);
}
