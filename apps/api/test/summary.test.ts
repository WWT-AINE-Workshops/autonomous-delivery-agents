import { describe, expect, it } from 'vitest';
import { makeTestApp } from './helpers';

const NOW = () => new Date('2026-09-15T12:00:00.000Z');

describe('GET /api/summary', () => {
  it('counts tasks by status for the day of the clock', async () => {
    const { app } = makeTestApp({ now: NOW });
    const res = await app.inject({ method: 'GET', url: '/api/summary' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ todo: 6, doing: 3, done: 3, asOf: '2026-09-15' });
    expect(res.json().overdue).toEqual(expect.any(Number));
  });
});

describe('due dates', () => {
  const post = (payload: object) =>
    makeTestApp({ now: NOW }).app.inject({ method: 'POST', url: '/api/tasks', payload });

  it('stores a due date on a new task', async () => {
    const res = await post({ title: 'Ship it', dueDate: '2026-10-01' });
    expect(res.statusCode).toBe(201);
    expect(res.json().dueDate).toBe('2026-10-01');
  });

  it.each(['tomorrow', '2026-13-40', '2026-9-1', 20260901])('rejects due date %s', async (v) => {
    expect((await post({ title: 'x', dueDate: v })).statusCode).toBe(400);
  });
});

describe('overdue count', () => {
  const overdueOn = async (iso: string) => {
    const { app } = makeTestApp({ now: () => new Date(iso) });
    return (await app.inject({ method: 'GET', url: '/api/summary' })).json().overdue;
  };

  it('counts open tasks due before today', async () => {
    expect(await overdueOn('2026-09-15T12:00:00.000Z')).toBe(2);
  });

  it('does not count a task due today', async () => {
    expect(await overdueOn('2026-09-12T12:00:00.000Z')).toBe(1);
  });

  it('never counts a done task', async () => {
    expect(await overdueOn('2026-12-31T12:00:00.000Z')).toBe(4);
  });
});
