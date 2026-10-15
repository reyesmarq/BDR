import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function Home() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
      <section className="py-16 sm:py-24">
        <p className="text-sm font-medium tracking-wide text-teal-700 uppercase">
          BDR CRM
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Your pipeline, laid out clearly.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          A lightweight CRM for individual B2B sales reps — see which leads
          need a call, email, or follow-up next, without the overhead of a
          full enterprise CRM.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/sign-up"
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            Get started
          </Link>
          <Link
            href="/sign-in"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-4 pb-20 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-medium text-slate-900">Accounts</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track every lead in your pipeline, searchable and filterable by
            status.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-medium text-slate-900">Follow-ups</h2>
          <p className="mt-2 text-sm text-slate-600">
            See what&apos;s due next across every account, sorted soonest
            first.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="font-medium text-slate-900">Resources</h2>
          <p className="mt-2 text-sm text-slate-600">
            Save the email templates and call scripts you actually reuse.
          </p>
        </div>
      </section>
    </main>
  );
}
