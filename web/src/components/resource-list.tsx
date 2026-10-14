import type { Resource } from '@/types/crm';

type ResourceListProps = {
  resources: Resource[];
};

const TYPE_LABELS: Record<Resource['type'], string> = {
  email_template: 'Email template',
  call_script: 'Call script',
};

export default function ResourceList({ resources }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <p className="rounded-lg border border-slate-200 bg-white p-4 text-slate-600">
        No saved resources yet.
      </p>
    );
  }
  return (
    <ul className="space-y-3">
      {resources.map((resource) => (
        <li
          key={resource.id}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <p className="font-medium text-slate-900">{resource.title}</p>
            <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
              {TYPE_LABELS[resource.type]}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
            {resource.content}
          </p>
        </li>
      ))}
    </ul>
  );
}
