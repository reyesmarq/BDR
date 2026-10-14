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

export type Contact = {
  id: string;
  accountId: string;
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
};

export type Note = {
  id: string;
  accountId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type AccountDetail = Account & {
  contacts: Contact[];
  tasks: Task[];
  notes: Note[];
};
