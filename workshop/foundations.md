# Foundations

Read this before the session or after it. It takes about ten minutes.

## The one idea

Most teams that adopted a coding assistant got faster at one step, building, and then stopped getting faster. The steps around it are still done by hand: writing the spec, testing, reviewing, checking security, deploying and operating. So code piles up in front of those steps. A faster build agent alone only moves the queue.

Autonomy comes from two things together. First, an agent at each stage. Second, a check between the stages that a script can run, so nobody has to take an agent's word for it. This workshop has you build both.

## Terms you will use

Each term is defined once here. The labs and the slides use the same words.

**Agent.** A prompt, a set of tools, the context it can see, and a check on its result. In this workshop an agent is a Markdown file in your repository.

**Subagent.** An agent that your Claude Code session hands one job to. It starts with a clean context, does the job and returns an answer. You name it in your prompt, for example "use the spec agent on this ticket".

**Tool.** Something an agent can do, such as read a file, search, edit or run a command. A tool for a model should be narrow, clearly described and safe to repeat. The fewer tools an agent has, the less it can break.

**Context.** Everything the agent can see while it works. It is the scarce resource. A narrow job and a short brief beat a long conversation.

**Eval.** A repeatable score for an agent. You run the agent several times on the same input and check each result with a script. One good run proves little, because the output changes from run to run.

**Gate.** A check between two stages that a script can run and that gives a clear pass or fail. An agent's own report of success is not a gate.

**Done.** A definition of finished that a script can check. If done is only written in words, the agent cannot tell when it has failed, and it will tell you it has succeeded.

**Verdict.** A review result in a fixed shape: approve, block or escalate, with a list of findings. A script can read it. A paragraph of opinion cannot be gated.

**Autonomy ladder.** Four rungs. Suggest: the agent proposes and a person acts. Act with approval: it acts after a person says yes. Act and report: it acts and tells you. Act autonomously: it acts, and a person reviews in batches. You place each stage, and each action, on a rung. You do not place the whole pipeline on one.

## How building an agent differs from building an app

An app does the same thing every time for the same input. An agent does not. That changes how you work.

- You run it several times and score the runs. You do not trust one pass.
- You design its tools for a model. Narrow, well named, safe to run twice, with error messages that say what to do next.
- You treat what it sees as a budget. Hand it the diff, not the repository.
- Its prompt is code. A project subagent is a Markdown file with a short header and a body, kept in the repository, so it is reviewed and versioned like any other file.
- You write "done" so a script can check it.
- You plan for new failures: an agent that loops, one that spends too much, one that makes a small mistake and builds on it, and one that gives a confident wrong answer.
- You limit what it can touch. Permission rules say which commands and files an agent may use. They are checked by Claude Code, not by the model, so text in a prompt or a ticket cannot argue its way past them. A hook can run a script before a command and block the command if the script says no.
- You treat text it reads as data. A ticket, a code comment or a log line can contain instructions aimed at an agent. That is prompt injection. The defence is not a cleverer prompt alone. It is an agent that has no tool to do the harm, a rule that denies it, and a gate that would catch it.
- You keep a trace. Every run writes down what happened, so you can see why a pipeline stopped.
- You re-run your evals when the model changes. A new model can behave differently, and the evals are your regression tests.

## Choose the model for the job

Each agent in this workshop runs on the model that suits its job, and the labs say why. A subagent's model is one line in its file. By default it runs on the same model as your session. You set it with the alias `opus`, `sonnet`, `haiku` or `fable`. You switch your own session's model with `/model`. The docs describe the aliases like this: `opus` for complex reasoning, `sonnet` for daily coding, `haiku` for simple tasks where speed and cost matter, and `fable` for the hardest and longest-running work. Aliases follow the newest version of each family, so they change over time. To pin a version, use the full model name.

| Job                                 | Model    | Why                                                                                                                   |
| ----------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| Spec agent (Lab 1)                  | `opus`   | A judgment call on an unclear ticket, and every later stage inherits its mistakes. Few runs, so the cost stays small. |
| Build agent (Lab 2)                 | `sonnet` | Ordinary coding, many times a day. A spec and an acceptance file steer it.                                            |
| Test agent (Lab 3)                  | `sonnet` | A loop of short edits and test runs. The done script decides when it stops.                                           |
| Reviewer and security agent (Lab 4) | `opus`   | Reasoning about intent and risk, and a different model from the builder, so it does not share its blind spots.        |
| Deploy agent (Lab 5)                | `haiku`  | One script, one exit code, one report. The smoke test and rollback are the safety.                                    |
| Operate agent (Lab 5)               | `sonnet` | Reasoning over logs. It only suggests, so a wrong guess is cheap.                                                     |

Four rules sit behind the table.

- Pay for the strongest model where a mistake spreads or the work needs judgment, and where you run it only a few times.
- Use a smaller, faster model for high-volume or scripted work, when something other than the model checks the result.
- Do not review code with the model that wrote it. Use a different one.
- Do not guess. Run your evals on each model for the job, and compare the pass rate, the spread and the cost.

The table is a starting point. Models change, and your own work may behave differently. The eval from Lab 1 is how you find out. If a model is not offered on your plan, delete the model line from the agent file and it runs on your session's model.

## The labs

- Lab 1: Anatomy of an agent and the spec agent (42 minutes). You turn a vague ticket into a testable spec, and learn why one run proves nothing.
- Lab 2: The build agent: spec to tested pull request (42 minutes). You build an agent that works from a spec in its own workspace, with limited permissions.
- Lab 3: The test agent and machine-checkable done (42 minutes). You write a definition of done as a script, and let an agent iterate until it passes.
- Lab 4: The review and security agents (42 minutes). You build read-only reviewers that return a verdict, and put a gate between them and the merge.
- Lab 5: Deploy, operate, chain and break the pipeline (42 minutes). You deploy to a simulated staging environment, triage an alert, chain every agent into one pipeline, and attack it.

Every lab ends with a ladder card: where the stage sits today, where you want it in ninety days, and the gate that would earn the move.

## After the session

You can place each stage of your own delivery process on the ladder, and you can name what stops a stage moving up: missing tests, slow builds, manual approvals, unclear ownership, cloud permissions or the layout of the repository. The wrap-up turns that into a short list of blockers, each with an owner.

_Adapted from Claude Code docs: Create custom subagents; Model configuration; Configure permissions; Hooks reference; Security._
