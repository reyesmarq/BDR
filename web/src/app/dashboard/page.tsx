import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  await auth.protect();
  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">Signed-in reps only.</p>
    </main>
  );
}
