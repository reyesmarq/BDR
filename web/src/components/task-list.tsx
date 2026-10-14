import type { Task } from '@/types/crm';
import TaskItem from './task-item';

type TaskListProps = {
  tasks: Task[];
};

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
        No upcoming follow-ups. You&apos;re all caught up.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
