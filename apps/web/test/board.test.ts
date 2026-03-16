import type { Task } from '@tasklane/shared';
import { describe, expect, it } from 'vitest';
import { filterTasks, groupByStatus, parseFilter, replaceTask, truncationNote } from '../src/board';

const task = (id: number, status: Task['status'], assigneeId: number | null): Task => ({
  id,
  title: `Task ${id}`,
  status,
  assigneeId,
  createdAt: '2026-09-01T09:00:00.000Z',
  dueDate: null,
});

const TASKS = [task(1, 'todo', 1), task(2, 'doing', 2), task(3, 'done', null), task(4, 'todo', 2)];

describe('filterTasks', () => {
  it('keeps everything for "all"', () => {
    expect(filterTasks(TASKS, 'all')).toEqual(TASKS);
  });

  it('keeps only the tasks of one assignee', () => {
    expect(filterTasks(TASKS, 2).map((t) => t.id)).toEqual([2, 4]);
  });

  it('keeps only unassigned tasks for "unassigned"', () => {
    expect(filterTasks(TASKS, 'unassigned').map((t) => t.id)).toEqual([3]);
  });

  it('returns nothing for an assignee with no tasks', () => {
    expect(filterTasks(TASKS, 99)).toEqual([]);
  });
});

describe('groupByStatus', () => {
  it('always returns the three columns, in input order', () => {
    const columns = groupByStatus(TASKS);
    expect(Object.keys(columns)).toEqual(['todo', 'doing', 'done']);
    expect(columns.todo.map((t) => t.id)).toEqual([1, 4]);
    expect(columns.doing.map((t) => t.id)).toEqual([2]);
    expect(columns.done.map((t) => t.id)).toEqual([3]);
  });

  it('keeps empty columns', () => {
    expect(groupByStatus([])).toEqual({ todo: [], doing: [], done: [] });
  });
});

describe('replaceTask', () => {
  it('swaps the matching task and leaves the rest', () => {
    const moved = { ...TASKS[0]!, status: 'done' as const };
    const next = replaceTask(TASKS, moved);
    expect(next[0]).toBe(moved);
    expect(next.slice(1)).toEqual(TASKS.slice(1));
  });
});

describe('parseFilter', () => {
  it('maps select values to filters', () => {
    expect(parseFilter('all')).toBe('all');
    expect(parseFilter('unassigned')).toBe('unassigned');
    expect(parseFilter('3')).toBe(3);
    expect(parseFilter('nonsense')).toBe('all');
  });
});

describe('truncationNote', () => {
  it('says how many tasks are shown when the API has more', () => {
    expect(truncationNote(50, 63)).toBe('Showing 50 of 63 tasks');
  });

  it('stays silent when everything is shown', () => {
    expect(truncationNote(12, 12)).toBeNull();
    expect(truncationNote(0, 0)).toBeNull();
  });
});
