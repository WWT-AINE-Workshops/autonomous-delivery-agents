# Task priority

Ticket: `tickets/02-add-task-priority.md`, which follows from ticket 1.

## Scope

Tasks get a `priority` of `low`, `normal` or `high`. New tasks start at `normal`, and so does every
existing task. The API accepts `priority` when a task is created and when it is changed with
`PATCH /api/tasks/:id`, which may change `status`, `priority` or both. The board shows the level of
high-priority cards.

## Out of scope

- Sorting or filtering the board by priority.
- Priority for users or projects.
- Changing how status moves between columns.

## Acceptance criteria

- A new task without a priority is created as `normal`: `npm run accept -- specs/priority.acceptance.json`
- A task can be created as `high`, and an unknown level such as `urgent` is rejected with 400: `npm run accept -- specs/priority.acceptance.json`
- `PATCH /api/tasks/:id` accepts a priority alone, a status alone or both, and rejects an empty body with 400: `npm run accept -- specs/priority.acceptance.json`
- Every existing test still passes: `npm test`
- Types and lint are clean: `npm run typecheck && npm run lint`

## Concerns

Ticket 1 does not say how urgency should look on the board. This spec shows the word `High` on
high-priority cards and leaves the styling to the build agent.
