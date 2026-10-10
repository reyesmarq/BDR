import type { Task } from '@/types/crm';

export function getUpcomingTasks(tasks: Task[]): Task[] {
  return tasks
    .filter((task) => task.status === 'open')
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
}
