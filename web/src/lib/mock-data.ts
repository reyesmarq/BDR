import type { Account, Task } from '@/types/crm';

export const mockAccounts: Account[] = [
  {
    id: 'a1',
    userId: 'user_mock',
    name: 'Acme Robotics',
    status: 'prospecting',
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'a2',
    userId: 'user_mock',
    name: 'Northwind Foods',
    status: 'contacted',
    createdAt: '2026-10-02T09:00:00Z',
    updatedAt: '2026-10-05T09:00:00Z',
  },
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    accountId: 'a1',
    title: 'Send intro email to Acme Robotics',
    description: 'Use the cold outreach template',
    dueDate: '2026-10-20T15:00:00Z',
    status: 'open',
    completedAt: null,
    createdAt: '2026-10-08T09:00:00Z',
  },
  {
    id: 't2',
    accountId: 'a2',
    title: 'Follow-up call with Northwind Foods',
    description: null,
    dueDate: '2026-10-14T16:00:00Z',
    status: 'open',
    completedAt: null,
    createdAt: '2026-10-09T09:00:00Z',
  },
  {
    id: 't3',
    accountId: 'a1',
    title: 'Discovery call with Acme Robotics',
    description: 'Intro call done, sent notes to the AE',
    dueDate: '2026-10-09T17:00:00Z',
    status: 'complete',
    completedAt: '2026-10-09T17:30:00Z',
    createdAt: '2026-10-05T09:00:00Z',
  },
];
