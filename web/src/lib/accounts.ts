import type { Account } from '@/types/crm';

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
