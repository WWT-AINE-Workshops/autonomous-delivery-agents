import { describe, expect, it } from 'vitest';
import { makeTestApp } from './helpers';

const NOW = () => new Date('2026-09-15T12:00:00.000Z');
const inject = (opts: { method: 'POST' | 'PATCH'; url: string; payload: object }) =>
  makeTestApp({ now: NOW }).app.inject(opts);

describe('task priority', () => {
  it('defaults a new task to normal', async () => {
    const res = await inject({ method: 'POST', url: '/api/tasks', payload: { title: 'x' } });
    expect(res.json().priority).toBe('normal');
  });

  it('accepts a priority on create and rejects an unknown one', async () => {
    const ok = await inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: 'x', priority: 'high' },
    });
    expect(ok.json().priority).toBe('high');
    const bad = await inject({
      method: 'POST',
      url: '/api/tasks',
      payload: { title: 'x', priority: 'urgent' },
    });
    expect(bad.statusCode).toBe(400);
  });

  it('changes priority with PATCH and leaves status alone', async () => {
    const res = await inject({
      method: 'PATCH',
      url: '/api/tasks/7',
      payload: { priority: 'low' },
    });
    expect(res.json()).toMatchObject({ id: 7, priority: 'low', status: 'todo' });
  });

  it('rejects an empty PATCH', async () => {
    const res = await inject({ method: 'PATCH', url: '/api/tasks/7', payload: {} });
    expect(res.statusCode).toBe(400);
  });
});
