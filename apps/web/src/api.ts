import type { Summary, Task, TaskPage, TaskStatus } from '@tasklane/shared';
import { MAX_PAGE_SIZE } from '@tasklane/shared';

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'content-type': 'application/json', ...init?.headers },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new Error(body?.error ?? `Request failed (${res.status})`);
  return body as T;
}

export const api = {
  // One page of the maximum size holds the seeded board (12 tasks). The board says so when it does not.
  tasks: () => call<TaskPage>(`/api/tasks?pageSize=${MAX_PAGE_SIZE}`),
  summary: () => call<Summary>('/api/summary'),
  moveTask: (id: number, status: TaskStatus) =>
    call<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};
