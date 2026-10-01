# Best practices

A take-home reference. Each practice says what to do, why it works, and which lab step practises it.

## Write "done" as a script

Put every criterion in a form a command can check, and run the commands. A criterion with no command is a wish. Why: an agent can only correct itself when something tells it that it failed. Practised in Lab 1 step 4, Lab 2 step 1 and Lab 3 step 2.

## Run an agent more than once

Run it five times on the same input and score each run with a script. Look at the pass rate and at how different the outputs are. Why: output changes from run to run, so one good run can be luck. Practised in Lab 1 steps 2 and 3.

## Give each agent the fewest tools it needs

Use a tools list of plain tool names. An agent that only reads needs Read, Grep and Glob, and nothing else. An agent with the Bash tool can change files through it. Why: what an agent cannot do, it cannot do wrong. Practised in Lab 1 step 4 and Lab 4 step 2.

## Put command limits in permission rules

Allow the narrow commands an agent needs, and deny the dangerous ones, such as pushing. Deny rules are checked first and win. Why: Claude Code enforces rules. A line in a prompt does not. Practised in Lab 2 step 2 and Lab 5 step 9.

## Cap the attempts

Tell an agent to stop after a fixed number of attempts at the same failing check, and make your done script count its own iterations. Why: an agent without a cap can loop and spend. Practised in Lab 2, the break step, and Lab 3 step 3.

## Isolate the work

Run a build agent in its own git worktree, so a bad run can be thrown away. Why: it keeps a half-finished change away from your working copy. Practised in Lab 2 step 3.

## Return a verdict, not an essay

Make reviewers return a fixed shape: approve, block or escalate, with findings. Let a script read it. Why: a script can gate on a verdict. Nobody can gate on a paragraph. Practised in Lab 4 steps 3 and 4.

## Put a gate before every irreversible step

Block merges and production deploys with a hook that runs a check, and let a person release a hold. Why: a hook that exits with code 2 blocks the command, and Claude Code shows the reason. Practised in Lab 4 step 5.

## Treat what an agent reads as data

Say so in the prompt, take away the tools that could do harm, deny the writes you never want, and keep a check that would notice. Why: tickets, comments and logs can carry instructions aimed at agents. Practised in Lab 4 step 6 and Lab 5 steps 8 and 9.

## Validate real behavior, not only health

After a deploy, request the real endpoints, and roll back automatically when one fails. Why: a health check that says ok can sit in front of a broken app. Practised in Lab 5 steps 2 to 5.

## Keep a trace

Write one line per stage with the time, the stage and the result. Why: when a pipeline stops, the trace tells you where and why. Practised in Lab 5 step 7.

## Pick the model for the job

Set the `model` line in each agent's file. Use a stronger model for judgment and for work that few runs carry, a mid-sized one for steady coding, a small one for scripted work with a check behind it, and a different one for review than for building. Why: models differ in cost, speed and depth, and the right one depends on the task. Then run your eval on each choice, because a guess is not a measurement. Practised in Lab 1 step 4, Lab 2 step 2, Lab 3 step 3, Lab 4 steps 2 and 4, and Lab 5 steps 5 and 6.

## Place stages on the ladder one at a time

Decide, stage by stage and action by action, which rung each belongs on, and write down the gate that earns a move up. Why: trust is earned by evidence, not by a global setting. Practised in every lab, and in the wrap-up.

_Adapted from Claude Code docs: Create custom subagents; Configure permissions; Hooks reference; Security._
