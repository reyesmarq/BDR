import type { Contact } from '@/types/crm';

type ContactListProps = {
  contacts: Contact[];
};

export default function ContactList({ contacts }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
        No contacts yet.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {contacts.map((contact) => (
        <li
          key={contact.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <p className="font-medium text-slate-900">{contact.name}</p>
          {contact.title && (
            <p className="text-sm text-slate-600">{contact.title}</p>
          )}
          {contact.email && (
            <p className="text-sm text-slate-600">{contact.email}</p>
          )}
          {contact.phone && (
            <p className="text-sm text-slate-600">{contact.phone}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
