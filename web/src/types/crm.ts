export type TaskStatus = 'open' | 'complete';

export type Account = {
  id: string;
  userId: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  accountId: string;
  title: string;
  description: string | null;
  dueDate: string;
  status: TaskStatus;
  completedAt: string | null;
  createdAt: string;
};
