import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, TASK_PRIORITIES, TASK_STATUSES } from '@tasklane/shared';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { AppDeps } from '../app';
import { HttpError, notFound, toId } from '../errors';
import { createTask, getTask, listTasks, updateTask, userExists } from '../repo';

// Keeps (page - 1) * pageSize inside what SQLite accepts as an OFFSET.
const MAX_PAGE = 100_000;

const ListQuery = z.object({
  status: z.enum(TASK_STATUSES).optional(),
  page: z.coerce.number().int().min(1).max(MAX_PAGE).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

const DueDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD')
  .refine((v) => !Number.isNaN(Date.parse(`${v}T00:00:00Z`)), 'must be a real date');

const CreateBody = z.object({
  title: z.string().trim().min(1).max(200),
  assigneeId: z.number().int().positive().nullable().default(null),
  dueDate: DueDate.nullable().default(null),
  priority: z.enum(TASK_PRIORITIES).default('normal'),
});

const PatchBody = z
  .object({
    status: z.enum(TASK_STATUSES).optional(),
    priority: z.enum(TASK_PRIORITIES).optional(),
  })
  .refine(
    (b) => b.status !== undefined || b.priority !== undefined,
    'send status, priority or both',
  );

export function taskRoutes(app: FastifyInstance, deps: AppDeps): void {
  const { db } = deps;
  const now = deps.now ?? (() => new Date());

  app.get('/api/tasks', async (request) => listTasks(db, ListQuery.parse(request.query)));

  app.get<{ Params: { id: string } }>('/api/tasks/:id', async (request) => {
    const id = toId(request.params.id);
    const task = getTask(db, id);
    if (!task) throw notFound(`Task ${id}`);
    return task;
  });

  app.post('/api/tasks', async (request, reply) => {
    const body = CreateBody.parse(request.body);
    if (body.assigneeId !== null && !userExists(db, body.assigneeId)) {
      throw new HttpError(400, `Unknown assignee ${body.assigneeId}`);
    }
    return reply.code(201).send(createTask(db, body, now()));
  });

  app.patch<{ Params: { id: string } }>('/api/tasks/:id', async (request) => {
    const id = toId(request.params.id);
    const task = updateTask(db, id, PatchBody.parse(request.body));
    if (!task) throw notFound(`Task ${id}`);
    return task;
  });
}
