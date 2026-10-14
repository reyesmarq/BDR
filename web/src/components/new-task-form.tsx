'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { createTask } from '@/lib/tasks';

type NewTaskFormProps = {
  accountId: string;
};

export default function NewTaskForm({ accountId }: NewTaskFormProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle || !dueDate) {
      setError('Title and due date are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('You must be signed in to add a follow-up.');
      }

      const trimmedDescription = description.trim();
      await createTask(token, accountId, {
        title: trimmedTitle,
        dueDate: new Date(dueDate).toISOString(),
        ...(trimmedDescription && { description: trimmedDescription }),
      });
      setTitle('');
      setDueDate('');
      setDescription('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 max-w-md space-y-3 rounded-lg border border-slate-200 bg-white p-4"
    >
      <div>
        <label
          htmlFor="new-task-title"
          className="block text-sm font-medium text-slate-900"
        >
          Title
        </label>
        <input
          id="new-task-title"
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Send pricing follow-up"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="new-task-due"
          className="block text-sm font-medium text-slate-900"
        >
          Due date
        </label>
        <input
          id="new-task-due"
          type="date"
          required
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="new-task-description"
          className="block text-sm font-medium text-slate-900"
        >
          Notes (optional)
        </label>
        <textarea
          id="new-task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Adding...' : 'Add follow-up'}
      </button>
    </form>
  );
}
