import type { Account, AccountDetail } from '@/types/crm';
export type CreateAccountInput = {
  name: string;
  status?: string;
};

export async function createAccount(
  token: string,
  input: CreateAccountInput,
): Promise<Account> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    const message =
      body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : 'Failed to create account';
    throw new Error(message);
  }

  return (await res.json()) as Account;
}

export async function getAccount(
  token: string,
  id: string,
): Promise<AccountDetail | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/${encodeURIComponent(id)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    },
  );

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Failed to load account');
  }

  return (await res.json()) as AccountDetail;
}
