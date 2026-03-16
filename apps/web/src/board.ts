import { TASK_STATUSES, type Task, type TaskStatus } from '@tasklane/shared';

// 'all' shows everyone, 'unassigned' shows tasks without an assignee, a number is a user id.
export type AssigneeFilter = 'all' | 'unassigned' | number;

export const COLUMN_TITLES: Record<TaskStatus, string> = {
  todo: 'Todo',
  doing: 'Doing',
  done: 'Done',
};

export function filterTasks(tasks: Task[], assignee: AssigneeFilter): Task[] {
  if (assignee === 'all') return tasks;
  if (assignee === 'unassigned') return tasks.filter((t) => t.assigneeId === null);
  return tasks.filter((t) => t.assigneeId === assignee);
}

export function groupByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const columns = Object.fromEntries(TASK_STATUSES.map((s) => [s, [] as Task[]])) as Record<
    TaskStatus,
    Task[]
  >;
  for (const task of tasks) columns[task.status].push(task);
  return columns;
}

export function replaceTask(tasks: Task[], updated: Task): Task[] {
  return tasks.map((t) => (t.id === updated.id ? updated : t));
}

// Parses the <select> value back into a filter.
export function parseFilter(value: string): AssigneeFilter {
  if (value === 'all' || value === 'unassigned') return value;
  const id = Number(value);
  return Number.isInteger(id) ? id : 'all';
}

// The board loads one page. When the API has more tasks than that page, say so.
export function truncationNote(shown: number, total: number): string | null {
  return total > shown ? `Showing ${shown} of ${total} tasks` : null;
}
