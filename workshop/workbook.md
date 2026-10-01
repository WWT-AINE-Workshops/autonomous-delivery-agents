# Workbook

Use this workbook as you go. At the end of each lab, fill in the page for that lab, including the ladder card. At the end of the session, use the two tables to turn your notes into a plan.

The four rungs of the autonomy ladder: **Suggest**, **Act with approval**, **Act and report**, **Act autonomously**.

---

## Lab 1: Anatomy of an agent and the spec agent

**What I did.**

**What surprised me.**

**What I will try in my own work.**

**The model I used and why.**

**Ladder card: Plan and discover.**

| Question                     | My answer |
| ---------------------------- | --------- |
| Rung in my team today        |           |
| Rung I want in 90 days       |           |
| The gate that earns the move |           |

**Where did we stall?** (missing tests, slow builds, manual approvals, unclear ownership, cloud permissions, repo layout)

---

## Lab 2: The build agent: spec to tested pull request

**What I did.**

**What surprised me.**

**What I will try in my own work.**

**The model I used and why.**

**Ladder card: Build.**

| Question                     | My answer |
| ---------------------------- | --------- |
| Rung in my team today        |           |
| Rung I want in 90 days       |           |
| The gate that earns the move |           |

**Where did we stall?**

---

## Lab 3: The test agent and machine-checkable done

**What I did.**

**What surprised me.**

**What I will try in my own work.**

**The model I used and why.**

**Ladder card: Test and verify.**

| Question                     | My answer |
| ---------------------------- | --------- |
| Rung in my team today        |           |
| Rung I want in 90 days       |           |
| The gate that earns the move |           |

**Where did we stall?**

---

## Lab 4: The review and security agents

**What I did.**

**What surprised me.**

**What I will try in my own work.**

**The model I used and why.**

**Ladder card: Review and secure.**

| Question                     | My answer |
| ---------------------------- | --------- |
| Rung in my team today        |           |
| Rung I want in 90 days       |           |
| The gate that earns the move |           |

**Where did we stall?**

---

## Lab 5: Deploy, operate, chain and break the pipeline

**What I did.**

**What surprised me.**

**What I will try in my own work.**

**The model I used and why.**

**Ladder cards: Deploy, and Operate and improve.**

| Question                     | Deploy | Operate |
| ---------------------------- | ------ | ------- |
| Rung in my team today        |        |         |
| Rung I want in 90 days       |        |         |
| The gate that earns the move |        |         |

**Where did we stall?**

---

## My ladder, stage by stage

Fill this in during the wrap-up. Be honest. A blank row is fine.

| Stage               | Rung today | Rung in 90 days | Gate that earns the move | Owner |
| ------------------- | ---------- | --------------- | ------------------------ | ----- |
| Plan and discover   |            |                 |                          |       |
| Design              |            |                 |                          |       |
| Build               |            |                 |                          |       |
| Test and verify     |            |                 |                          |       |
| Review and secure   |            |                 |                          |       |
| Deploy              |            |                 |                          |       |
| Operate and improve |            |                 |                          |       |

---

## My blockers

List at least three. For each one, pick a category and name a person who owns it.

| Blocker | Category | Which stage it stops | Owner | First small step |
| ------- | -------- | -------------------- | ----- | ---------------- |
|         |          |                      |       |                  |
|         |          |                      |       |                  |
|         |          |                      |       |                  |

Categories: missing tests, slow builds, manual approvals, unclear ownership, cloud permissions, repo layout.

## My takeaway

Write one thing you will do differently on Monday.

---

## Glossary

| Term             | Meaning                                                                             |
| ---------------- | ----------------------------------------------------------------------------------- |
| Agent            | A prompt, tools, context and a check on its result                                  |
| Subagent         | An agent your session hands one job to, with a clean context                        |
| Tool             | Something an agent can do, such as read, search, edit or run a command              |
| Context          | Everything the agent can see while it works                                         |
| Eval             | A repeatable score: run the agent several times and check each result with a script |
| Gate             | A check between two stages that a script can run, with a clear pass or fail         |
| Done             | A definition of finished that a script can check                                    |
| Verdict          | A review result in a fixed shape: approve, block or escalate, with findings         |
| Permission rule  | An allow or deny rule that Claude Code enforces for commands and files              |
| Hook             | A script that runs before a tool call and can block it                              |
| Prompt injection | Text an agent reads that tries to change what it does                               |
| Autonomy ladder  | Suggest, act with approval, act and report, act autonomously                        |
