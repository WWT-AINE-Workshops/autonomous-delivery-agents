import { describe, expect, it } from 'vitest';
import { makeTestApp } from './helpers';

const search = (qs: string) =>
  makeTestApp().app.inject({ method: 'GET', url: `/api/tasks/search?${qs}` });

describe('GET /api/tasks/search', () => {
  it('finds tasks by words in the title', async () => {
    const body = (await search('q=roadmap')).json();
    expect(body.total).toBe(1);
    expect(body.items[0].title).toBe('Draft the Q3 roadmap outline');
  });

  it('returns nothing when no title matches', async () => {
    expect((await search('q=zebra')).json()).toEqual({ items: [], total: 0 });
  });

  it('limits the number of results', async () => {
    expect((await search('q=&limit=3')).json().items).toHaveLength(3);
  });

  it('filters by the assignee name', async () => {
    const body = (await search('q=&assignee=Noor')).json();
    expect(body.items.every((t: { assigneeId: number }) => t.assigneeId === 3)).toBe(true);
  });
});
