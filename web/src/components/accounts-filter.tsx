'use client';

import { useMemo, useState } from 'react';
import type { Account } from '@/types/crm';
import AccountList from './account-list';

type AccountsFilterProps = {
  accounts: Account[];
};

export default function AccountsFilter({ accounts }: AccountsFilterProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');

  const statuses = useMemo(
    () => Array.from(new Set(accounts.map((account) => account.status))).sort(),
    [accounts],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesSearch =
        !term || account.name.toLowerCase().includes(term);
      const matchesStatus = status === 'all' || account.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [accounts, search, status]);

  if (accounts.length === 0) {
    return <AccountList accounts={accounts} />;
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search accounts by name"
          aria-label="Search accounts by name"
          className="flex-1 min-w-48 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter accounts by status"
          className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
        >
          <option value="all">All statuses</option>
          {statuses.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      {filtered.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
          No accounts match your search.
        </p>
      ) : (
        <AccountList accounts={filtered} />
      )}
    </div>
  );
}
