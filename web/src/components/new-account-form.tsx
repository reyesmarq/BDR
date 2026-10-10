'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { createAccount } from '@/lib/accounts';

export default function NewAccountForm() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [name, setName] = useState('');
  const [status, setStatus] = useState('new');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Account name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('You must be signed in to create an account.');
      }

      await createAccount(token, { name: trimmedName, status });
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-900"
        >
          Account name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Acme Robotics"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-slate-900"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        >
          <option value="new">New</option>
          <option value="prospecting">Prospecting</option>
          <option value="contacted">Contacted</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Creating...' : 'Create account'}
      </button>
    </form>
  );
}
