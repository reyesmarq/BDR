import type { Task } from '@/types/crm';

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
        <li
          key={task.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <p className="font-medium text-slate-900">{task.title}</p>
          <p className="text-sm text-slate-600">
            Due{' '}
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              dateStyle: 'medium',
              timeZone: 'UTC',
            })}
          </p>
        </li>
      ))}
    </ul>
  );
}
