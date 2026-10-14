import type { Task } from '@/types/crm';

export function getUpcomingTasks(tasks: Task[]): Task[] {
  return tasks
    .filter((task) => task.status === 'open')
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
}

export type TaskInput = {
  title: string;
  description?: string;
  dueDate: string;
};

async function parseTaskResponse(res: Response, fallback: string): Promise<Task> {
  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    const message =
      body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : fallback;
    throw new Error(message);
  }

  return (await res.json()) as Task;
}

export async function createTask(
  token: string,
  accountId: string,
  input: TaskInput,
): Promise<Task> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/${encodeURIComponent(accountId)}/tasks`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    },
  );

  return parseTaskResponse(res, 'Failed to create task');
}

export async function updateTask(
  token: string,
  accountId: string,
  taskId: string,
  input: Partial<TaskInput>,
): Promise<Task> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/${encodeURIComponent(accountId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    },
  );

  return parseTaskResponse(res, 'Failed to update task');
}

export async function completeTask(
  token: string,
  accountId: string,
  taskId: string,
): Promise<Task> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/${encodeURIComponent(accountId)}/tasks/${encodeURIComponent(taskId)}/complete`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return parseTaskResponse(res, 'Failed to complete task');
}
