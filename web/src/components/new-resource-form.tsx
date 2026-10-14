'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import type { ResourceType } from '@/types/crm';
import { createResource } from '@/lib/resources';

export default function NewResourceForm() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ResourceType>('email_template');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('You must be signed in to save a resource.');
      }

      await createResource(token, {
        title: trimmedTitle,
        type,
        content: trimmedContent,
      });
      setTitle('');
      setContent('');
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
      className="mb-6 max-w-2xl space-y-4 rounded-lg border border-slate-200 bg-white p-4"
    >
      <div>
        <label
          htmlFor="resource-title"
          className="block text-sm font-medium text-slate-900"
        >
          Title
        </label>
        <input
          id="resource-title"
          type="text"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Cold outreach email"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="resource-type"
          className="block text-sm font-medium text-slate-900"
        >
          Type
        </label>
        <select
          id="resource-type"
          value={type}
          onChange={(event) => setType(event.target.value as ResourceType)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        >
          <option value="email_template">Email template</option>
          <option value="call_script">Call script</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="resource-content"
          className="block text-sm font-medium text-slate-900"
        >
          Content
        </label>
        <textarea
          id="resource-content"
          required
          rows={6}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Hi {{name}}, ..."
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Saving...' : 'Save resource'}
      </button>
    </form>
  );
}
