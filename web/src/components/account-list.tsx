import type { Account } from '@/types/crm';

type AccountListProps = {
  accounts: Account[];
};

export default function AccountList({ accounts }: AccountListProps) {
  if (accounts.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
        No accounts yet, please create your first lead to start.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {accounts.map((account) => (
        <li
          key={account.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
        >
          <p className="font-medium text-slate-900">{account.name}</p>
          <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
            {account.status}
          </span>
        </li>
      ))}
    </ul>
  );
}
