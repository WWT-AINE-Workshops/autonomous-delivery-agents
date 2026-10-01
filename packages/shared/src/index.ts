export const TASK_STATUSES = ['todo', 'doing', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['low', 'normal', 'high'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  assigneeId: number | null;
  createdAt: string;
  // Calendar day as YYYY-MM-DD, or null when the task has no deadline.
  dueDate: string | null;
  priority: TaskPriority;
}

export interface TaskPage {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Summary {
  todo: number;
  doing: number;
  done: number;
  overdue: number;
  // The calendar day the counts were computed for, YYYY-MM-DD.
  asOf: string;
}

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;
