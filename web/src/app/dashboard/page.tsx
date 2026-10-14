import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import AccountsFilter from '@/components/accounts-filter';
import { getAccounts } from '@/lib/accounts';
import { mockTasks } from '@/lib/mock-data';
import TaskList from '@/components/task-list';
import { getUpcomingTasks } from '@/lib/tasks';

interface Me {
  id: string;
  [claim: string]: unknown;
}

async function fetchMe(token: string): Promise<Me | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as Me;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  await auth.protect();
  const { getToken } = await auth();
  const token = await getToken();
  const me = token ? await fetchMe(token) : null;
  const accounts = token ? await getAccounts(token) : [];
  const upcomingTasks = getUpcomingTasks(mockTasks);

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <Link
          href="/dashboard/resources"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Resources
        </Link>
      </div>
      <p className="mt-2 text-slate-600">Signed-in reps only.</p>
      <p className="mt-4 text-sm text-slate-500">
        {me
          ? `API confirms you as Clerk user ${me.id}.`
          : 'Could not verify your session with the API.'}
      </p>
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900">Accounts</h2>
          <Link
            href="/dashboard/new"
            className="rounded-lg bg-teal-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            New account
          </Link>
        </div>
        <AccountsFilter accounts={accounts} />
      </section>
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-medium text-slate-900">
          Upcoming follow-ups
        </h2>
        <TaskList tasks={upcomingTasks} />
      </section>
    </main>
  );
}
