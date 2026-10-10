import { auth } from '@clerk/nextjs/server';
import NewAccountForm from '@/components/new-account-form';

export default async function NewAccountPage() {
  await auth.protect();

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold text-slate-900">New account</h1>
      <p className="mt-2 text-slate-600">
        Add a lead to start tracking it in your pipeline.
      </p>
      <section className="mt-6">
        <NewAccountForm />
      </section>
    </main>
  );
}
