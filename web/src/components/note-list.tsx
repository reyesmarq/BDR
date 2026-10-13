import type { Note } from '@/types/crm';

type NoteListProps = {
  notes: Note[];
};

export default function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
        No notes yet.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li
          key={note.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <p className="whitespace-pre-wrap text-slate-900">{note.body}</p>
          <p className="mt-1 text-sm text-slate-600">
            {new Date(note.createdAt).toLocaleDateString('en-US', {
              dateStyle: 'medium',
              timeZone: 'UTC',
            })}
          </p>
        </li>
      ))}
    </ul>
  );
}
