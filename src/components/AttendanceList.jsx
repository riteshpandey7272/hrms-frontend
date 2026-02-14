import { CalendarCheck } from 'lucide-react'

export default function AttendanceList({ records }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-100">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Employee ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {records.map((rec) => (
            <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
                  {rec.employee_id}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-medium text-slate-900">
                {rec.employee_name || '-'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <CalendarCheck className="h-3.5 w-3.5" />
                  {new Date(rec.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    rec.status === 'Present'
                      ? 'bg-green-100 text-green-600'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {rec.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
