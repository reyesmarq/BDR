import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import NewResourceForm from '@/components/new-resource-form';
import ResourceList from '@/components/resource-list';
import { getResources } from '@/lib/resources';

export default async function ResourcesPage() {
  await auth.protect();
  const { getToken } = await auth();
  const token = await getToken();
  const resources = token ? await getResources(token) : [];

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <Link
        href="/dashboard"
        className="text-sm text-teal-700 hover:text-teal-800"
      >
        ← Back to dashboard
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-slate-900">
        Resources
      </h1>
      <p className="mt-2 text-slate-600">
        Reusable email templates and call scripts for quick reuse.
      </p>
      <section className="mt-6">
        <NewResourceForm />
        <ResourceList resources={resources} />
      </section>
    </main>
  );
}
