# Workshop materials

Welcome to _From Coding Assistants to Autonomous Delivery Agents_, a 4-hour workshop from World Wide Technology. You will work through five short labs on a working app. Everything in this folder is course material. It is not part of the app.

## Agenda

| Time | Segment                                              | Minutes |
| ---- | ---------------------------------------------------- | ------- |
| 0:00 | AI-Native Engineering at WWT                         | 6       |
| 0:06 | Overview                                             | 9       |
| 0:15 | Lab 1: Anatomy of an agent and the spec agent        | 42      |
| 0:57 | Lab 2: The build agent: spec to tested pull request  | 42      |
| 1:39 | Lab 3: The test agent and machine-checkable done     | 42      |
| 2:21 | Lab 4: The review and security agents                | 42      |
| 3:03 | Lab 5: Deploy, operate, chain and break the pipeline | 42      |
| 3:45 | Wrap-up, questions and close                         | 15      |

## Your materials

- [Pre-work](pre-work.md) ([Word version](pre-work.docx)): set up your computer before the session.
- [Foundations](foundations.md): the ideas behind the labs. Read it before or after the session.
- [Lab 1: Anatomy of an agent and the spec agent](labs/01-lab-1.md) (42 minutes)
- [Lab 2: The build agent: spec to tested pull request](labs/02-lab-2.md) (42 minutes)
- [Lab 3: The test agent and machine-checkable done](labs/03-lab-3.md) (42 minutes)
- [Lab 4: The review and security agents](labs/04-lab-4.md) (42 minutes)
- [Lab 5: Deploy, operate, chain and break the pipeline](labs/05-lab-5.md) (42 minutes)
- [Best practices](best-practices.md): a take-home reference for working with Claude Code.
- [Workbook](workbook.md) ([Word version](workbook.docx)): notes and exercises to fill in as you go.
- [Slides](slides.pptx): the deck from the session.

## Scripts

| Script                      | What it does                                                                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/setup-workshop.sh` | Sets up your copy after the clone, one step at a time, asking before each step (`--yes` answers yes to all)                                   |
| `scripts/check-setup.sh`    | Checks your computer has everything the workshop needs and tells you how to fix anything missing                                              |
| `scripts/seed-github.sh`    | Creates the workshop issues (and any draft pull requests) in your copy of the repository, and the branches the pull request labs are based on |
| `scripts/reset-lab.sh <n>`  | Moves you to the start of lab `n` on a fresh branch                                                                                           |

Fell behind? `./scripts/reset-lab.sh <lab number>` puts you at the start of any lab.

## Next steps

Anthropic Academy has follow-on courses at https://anthropic.skilljar.com:

- Claude Code 101
- Claude Code in Action
- Introduction to agent skills
- Introduction to subagents
