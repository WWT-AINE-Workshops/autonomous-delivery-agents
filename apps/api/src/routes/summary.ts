import type { FastifyInstance } from 'fastify';
import type { AppDeps } from '../app';
import { summarize } from '../repo';

export function summaryRoutes(app: FastifyInstance, deps: AppDeps): void {
  const now = deps.now ?? (() => new Date());
  app.get('/api/summary', async () => summarize(deps.db, now().toISOString().slice(0, 10)));
}
