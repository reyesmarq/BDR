import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import ContactList from '@/components/contact-list';
import { getAccount } from '@/lib/accounts';
import NoteList from '@/components/note-list';
import TaskList from '@/components/task-list';
import { getUpcomingTasks } from '@/lib/tasks';

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await auth.protect();
  const { id } = await params;
  const { getToken } = await auth();
  const token = await getToken();
  const account = token ? await getAccount(token, id) : null;
  if (!account) {
    notFound();
  }
  const openTasks = getUpcomingTasks(account.tasks);
  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard"
        className="text-sm text-teal-700 hover:text-teal-800"
      >
        ← Back to dashboard
      </Link>
      <div className="mt-3 flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          {account.name}
        </h1>
        <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
          {account.status}
        </span>
      </div>
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-medium text-slate-900">Contacts</h2>
        <ContactList contacts={account.contacts} />
      </section>
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-medium text-slate-900">
          Open follow-ups
        </h2>
        <TaskList tasks={openTasks} />
      </section>
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-medium text-slate-900">Notes</h2>
        <NoteList notes={account.notes} />
      </section>
    </main>
  );
}
