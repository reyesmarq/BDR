import { auth } from '@clerk/nextjs/server';

interface Me {
  id: string;
  [claim: string]: unknown;
}

async function fetchMe(token: string): Promise<Me | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<Me>;
}

export default async function DashboardPage() {
  await auth.protect();
  const { getToken } = await auth();
  const token = await getToken();
  const me = token ? await fetchMe(token) : null;

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">Signed-in reps only.</p>
      <p className="mt-4 text-sm text-slate-500">
        {me
          ? `API confirms you as Clerk user ${me.id}.`
          : 'Could not verify your session with the API.'}
      </p>
    </main>
  );
}
