import type { Account, AccountDetail } from '@/types/crm';
export type CreateAccountInput = {
  name: string;
  status?: string;
};

export type UpdateAccountInput = Partial<CreateAccountInput>;

async function parseAccountResponse(
  res: Response,
  fallback: string,
): Promise<Account> {
  if (!res.ok) {
    const body: unknown = await res.json().catch(() => null);
    const message =
      body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : fallback;
    throw new Error(message);
  }

  return (await res.json()) as Account;
}

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

  return parseAccountResponse(res, 'Failed to create account');
}

export async function updateAccount(
  token: string,
  id: string,
  input: UpdateAccountInput,
): Promise<Account> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
    },
  );

  return parseAccountResponse(res, 'Failed to update account');
}

export async function archiveAccount(token: string, id: string): Promise<Account> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/accounts/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return parseAccountResponse(res, 'Failed to delete account');
}

export async function getAccounts(token: string): Promise<Account[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to load accounts');
  }

  return (await res.json()) as Account[];
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
