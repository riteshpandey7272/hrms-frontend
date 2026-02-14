import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'No data found', description = '', icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-slate-300" />
      <h3 className="mt-4 text-lg font-medium text-slate-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
    </div>
  )
}
