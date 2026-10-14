'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import type { Account } from '@/types/crm';
import { updateAccount } from '@/lib/accounts';

type AccountHeaderProps = {
  account: Pick<Account, 'id' | 'name' | 'status'>;
};

export default function AccountHeader({ account }: AccountHeaderProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(account.name);
  const [status, setStatus] = useState(account.status);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
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
        throw new Error('You must be signed in.');
      }

      await updateAccount(token, account.id, {
        name: trimmedName,
        status,
      });
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="mt-3 max-w-md space-y-3 rounded-lg border border-slate-200 bg-white p-4"
      >
        <div>
          <label
            htmlFor="account-name"
            className="block text-sm font-medium text-slate-900"
          >
            Account name
          </label>
          <input
            id="account-name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="account-status"
            className="block text-sm font-medium text-slate-900"
          >
            Status
          </label>
          <select
            id="account-status"
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
            onClick={() => {
              setName(account.name);
              setStatus(account.status);
              setError(null);
              setIsEditing(false);
            }}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-3">
      <h1 className="text-2xl font-semibold text-slate-900">
        {account.name}
      </h1>
      <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
        {account.status}
      </span>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="rounded-lg border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Edit
      </button>
    </div>
  );
}
