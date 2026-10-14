import Link from 'next/link';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import AccountHeader from '@/components/account-header';
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
      <AccountHeader
        account={{ id: account.id, name: account.name, status: account.status }}
      />
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
