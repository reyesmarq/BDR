import type { Resource, ResourceType } from '@/types/crm';

export type CreateResourceInput = {
  title: string;
  type: ResourceType;
  content: string;
};

async function parseResourceResponse(
  res: Response,
  fallback: string,
): Promise<Resource> {
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

  return (await res.json()) as Resource;
}

export async function createResource(
  token: string,
  input: CreateResourceInput,
): Promise<Resource> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  return parseResourceResponse(res, 'Failed to create resource');
}

export async function getResources(token: string): Promise<Resource[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to load resources');
  }

  return (await res.json()) as Resource[];
}
