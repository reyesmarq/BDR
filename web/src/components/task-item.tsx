'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import type { Task } from '@/types/crm';
import { completeTask, updateTask } from '@/lib/tasks';

type TaskItemProps = {
  task: Task;
};

export default function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.dueDate.slice(0, 10));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function getRequiredToken(): Promise<string> {
    const token = await getToken();
    if (!token) {
      throw new Error('You must be signed in.');
    }
    return token;
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle || !dueDate) {
      setError('Title and due date are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getRequiredToken();
      await updateTask(token, task.accountId, task.id, {
        title: trimmedTitle,
        dueDate: new Date(dueDate).toISOString(),
      });
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleComplete() {
    setError(null);
    setIsSubmitting(true);
    try {
      const token = await getRequiredToken();
      await completeTask(token, task.accountId, task.id);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setIsSubmitting(false);
    }
  }

  if (isEditing) {
    return (
      <li className="rounded-lg border border-slate-200 bg-white p-4">
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label
              htmlFor={`title-${task.id}`}
              className="block text-sm font-medium text-slate-900"
            >
              Title
            </label>
            <input
              id={`title-${task.id}`}
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor={`due-${task.id}`}
              className="block text-sm font-medium text-slate-900"
            >
              Due date
            </label>
            <input
              id={`due-${task.id}`}
              type="date"
              required
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
      <div>
        <p className="font-medium text-slate-900">{task.title}</p>
        <p className="text-sm text-slate-600">
          Due{' '}
          {new Date(task.dueDate).toLocaleDateString('en-US', {
            dateStyle: 'medium',
            timeZone: 'UTC',
          })}
        </p>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleComplete}
          disabled={isSubmitting}
          className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Mark complete'}
        </button>
      </div>
    </li>
  );
}
