import { mkdtempSync, mkdirSync, writeFileSync, cpSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { lintSpec } from '../spec-lint.mjs';
import { decide, validateVerdict } from '../verdict-gate.mjs';
import { evaluate } from '../eval.mjs';
import { runChecks } from '../done-check.mjs';
import { runPipeline } from '../pipeline.mjs';
import { check as checkMerge } from '../merge-gate.mjs';

const GOOD_SPEC = `# Spec
## Scope
Add a thing.
## Out of scope
Everything else.
## Acceptance criteria
- Creating one returns 201: \`npm run accept -- specs/x.acceptance.json\`
- Bad input returns 400: \`npm test\`
`;

describe('spec-lint', () => {
  it('passes a spec with scope, out of scope and runnable criteria', () => {
    expect(lintSpec(GOOD_SPEC)).toEqual([]);
  });
  it('flags a missing section and a criterion with no check', () => {
    const problems = lintSpec('## Scope\nx\n## Acceptance criteria\n- It should be nice\n');
    expect(problems).toContain('missing section "Out of scope"');
    expect(problems.some((p) => p.startsWith('criterion has no runnable check'))).toBe(true);
  });
});

describe('verdict-gate', () => {
  const finding = { severity: 'low', file: 'a.ts', summary: 's' };
  it('approves a clean approve verdict', () => {
    expect(decide({ verdict: 'approve', reviewer: 'reviewer', findings: [finding] }).code).toBe(0);
  });
  it('blocks an approve that carries a high finding', () => {
    const v = { verdict: 'approve', reviewer: 'r', findings: [{ ...finding, severity: 'high' }] };
    expect(decide(v).code).toBe(2);
  });
  it('holds an escalation until a human approves it', () => {
    const v = { verdict: 'escalate', reviewer: 'r', findings: [finding] };
    expect(decide(v).code).toBe(3);
    expect(decide(v, 'Sam').code).toBe(0);
  });
  it('never lets a block through', () => {
    expect(decide({ verdict: 'block', reviewer: 'r', findings: [] }, 'Sam').code).toBe(2);
  });
  it('rejects a malformed verdict', () => {
    expect(validateVerdict({ verdict: 'maybe' }).length).toBeGreaterThan(0);
  });
});

describe('merge-gate', () => {
  const merge = { tool_input: { command: 'gh pr merge 3' } };
  const clean = { verdict: 'approve', reviewer: 'r', findings: [] };
  it('ignores commands that are not merges', () => {
    expect(checkMerge({ tool_input: { command: 'npm test' } }).code).toBe(0);
  });
  it('blocks a merge when there is no verdict', () => {
    const result = checkMerge(merge, () => {
      throw new Error('missing');
    });
    expect(result.code).toBe(2);
  });
  it('blocks a merge on a block verdict and allows one on a clean approve', () => {
    expect(checkMerge(merge, () => ({ ...clean, verdict: 'block' })).code).toBe(2);
    expect(checkMerge(merge, () => clean).code).toBe(0);
  });
});

describe('eval', () => {
  it('scores saved runs and counts distinct outputs', () => {
    const dir = mkdtempSync(join(tmpdir(), 'eval-'));
    writeFileSync(join(dir, 'run-1.md'), GOOD_SPEC);
    writeFileSync(join(dir, 'run-2.md'), GOOD_SPEC);
    writeFileSync(join(dir, 'run-3.md'), '## Scope\nonly this\n');
    const result = evaluate('spec', dir);
    expect(result).toMatchObject({ passed: 2, total: 3, distinct: 2 });
  });
});

describe('done-check', () => {
  it('fails when a command fails or a forbidden pattern is present', () => {
    const dir = mkdtempSync(join(tmpdir(), 'done-'));
    writeFileSync(join(dir, 'a.test.ts'), "it.skip('x', () => {});\n");
    const results = runChecks(
      {
        criteria: [{ name: 'tests', run: 'ok' }],
        forbid: [{ name: 'no skipped tests', pattern: '\\.skip\\(', paths: [dir] }],
      },
      () => 0,
    );
    expect(results.map((r) => r.ok)).toEqual([true, false]);
  });
});

describe('pipeline', () => {
  it('stops at the first failing gate and skips the rest', () => {
    const config = {
      stages: [
        { name: 'plan', run: 'a' },
        { name: 'design', run: 'b', advisory: true },
        { name: 'review', run: 'c' },
        { name: 'deploy', run: 'd' },
      ],
    };
    const report = runPipeline(config, (cmd: string) => (cmd === 'a' ? 0 : 1));
    expect(report.stages.map((s: { status: string }) => s.status)).toEqual([
      'passed',
      'advisory-failed',
      'failed',
      'skipped',
    ]);
    expect(report.stoppedAt).toBe('review');
    expect(report.ok).toBe(false);
  });
});

describe('deploy-staging', () => {
  const root = resolve(__dirname, '..', '..');
  const run = (cwd: string, ...args: string[]) =>
    spawnSync(
      join(root, 'node_modules', '.bin', 'tsx'),
      [join(root, 'agent-tools', 'deploy-staging.ts'), ...args],
      {
        cwd,
        encoding: 'utf8',
      },
    );
  const scratch = () => {
    const dir = mkdtempSync(join(tmpdir(), 'staging-'));
    cpSync(join(root, 'ops'), join(dir, 'ops'), { recursive: true });
    mkdirSync(join(dir, 'runs'), { recursive: true });
    return dir;
  };

  it('deploys a good release and passes the full smoke test', () => {
    const dir = scratch();
    expect(run(dir, 'deploy', '--release', 'r41', '--smoke', 'full').status).toBe(0);
  });

  it('rolls back a release that fails the full smoke test', () => {
    const dir = scratch();
    expect(run(dir, 'deploy', '--release', 'r41', '--smoke', 'full').status).toBe(0);
    const bad = run(dir, 'deploy', '--release', 'r42', '--smoke', 'full', '--auto-rollback');
    expect(bad.status).toBe(1);
    expect(run(dir, 'status').stdout).toContain('"release":"r41"');
    expect(run(dir, 'deploy', '--release', 'r41', '--smoke', 'full').status).toBe(0);
  });

  it('is safe to repeat: a live release is only smoke tested, and a second rollback does nothing', () => {
    const dir = scratch();
    expect(run(dir, 'deploy', '--release', 'r41', '--smoke', 'full').status).toBe(0);
    const again = run(dir, 'deploy', '--release', 'r41', '--smoke', 'full');
    expect(again.status).toBe(0);
    expect(again.stdout).toContain('already live');
    run(dir, 'deploy', '--release', 'r42', '--smoke', 'full', '--auto-rollback');
    const second = run(dir, 'rollback');
    expect(second.status).toBe(0);
    expect(second.stdout).toContain('nothing to roll back');
    expect(run(dir, 'status').stdout).toContain('"release":"r41"');
  });

  it('refuses production', () => {
    expect(run(scratch(), 'deploy', '--release', 'r41', '--env', 'prod').status).toBe(4);
  });
});
