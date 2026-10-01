import { TASK_STATUSES, type Summary, type Task, type TaskStatus } from '@tasklane/shared';
import { useEffect, useMemo, useState } from 'react';
import { api } from './api';
import {
  COLUMN_TITLES,
  filterTasks,
  groupByStatus,
  parseFilter,
  replaceTask,
  truncationNote,
  type AssigneeFilter,
} from './board';
import { USERS, userName } from './users';

export function App() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [assignee, setAssignee] = useState<AssigneeFilter>('all');

  useEffect(() => {
    api
      .tasks()
      .then((page) => {
        setTasks(page.items);
        setTotal(page.total);
      })
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    api
      .summary()
      .then(setSummary)
      .catch((e: Error) => setError(e.message));
  }, []);

  const columns = useMemo(
    () => groupByStatus(filterTasks(tasks ?? [], assignee)),
    [tasks, assignee],
  );

  async function move(task: Task, status: TaskStatus) {
    setError(null);
    try {
      const updated = await api.moveTask(task.id, status);
      setTasks((current) => (current ? replaceTask(current, updated) : current));
      api
        .summary()
        .then(setSummary)
        .catch(() => undefined);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <main>
      <header>
        <h1>Tasklane</h1>
        {summary && (
          <p className="summary" data-testid="overdue">
            Overdue <strong>{summary.overdue}</strong>
          </p>
        )}
        <label>
          Assignee
          <select
            value={String(assignee)}
            onChange={(e) => setAssignee(parseFilter(e.target.value))}
          >
            <option value="all">Everyone</option>
            <option value="unassigned">Unassigned</option>
            {Object.entries(USERS).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </header>
      {error && <p role="alert">{error}</p>}
      {tasks !== null && truncationNote(tasks.length, total) && (
        <p className="note">{truncationNote(tasks.length, total)}</p>
      )}
      {tasks === null && !error && <p>Loading tasks…</p>}
      {tasks !== null && (
        <div className="board">
          {TASK_STATUSES.map((status) => (
            <section
              key={status}
              aria-label={COLUMN_TITLES[status]}
              data-testid={`column-${status}`}
            >
              <h2>
                {COLUMN_TITLES[status]} <span className="count">{columns[status].length}</span>
              </h2>
              <ul>
                {columns[status].map((task) => (
                  <li key={task.id} data-testid="task-card">
                    <p className="title">{task.title}</p>
                    {task.priority === 'high' && <p className="badge">High</p>}
                    <p className="assignee">{userName(task.assigneeId)}</p>
                    {task.dueDate && <p className="due">Due {task.dueDate}</p>}
                    <div className="moves">
                      {TASK_STATUSES.filter((s) => s !== status).map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-label={`Move ${task.title} to ${COLUMN_TITLES[s]}`}
                          onClick={() => move(task, s)}
                        >
                          {COLUMN_TITLES[s]}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
