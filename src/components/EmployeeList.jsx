import { Trash2, Mail, Building2 } from 'lucide-react'

export default function EmployeeList({ employees, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-100">
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Employee ID</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Department</th>
            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <tr key={emp.employee_id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
                  {emp.employee_id}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                    {emp.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-900">{emp.full_name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Mail className="h-3.5 w-3.5" />
                  {emp.email}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Building2 className="h-3.5 w-3.5" />
                  {emp.department}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onDelete(emp)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete employee"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
