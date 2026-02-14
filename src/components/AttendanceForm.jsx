import { useState } from 'react'
import { X } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function AttendanceForm({ employees, onClose, onSuccess }) {
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    employee_id: '',
    date: today,
    status: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.employee_id) errs.employee_id = 'Select an employee'
    if (!form.date) errs.date = 'Date is required'
    if (!form.status) errs.status = 'Select attendance status'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await api.post('/api/attendance', form)
      toast.success('Attendance marked successfully')
      onSuccess()
      onClose()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to mark attendance'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Mark Attendance</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
            <select
              value={form.employee_id}
              onChange={(e) => handleChange('employee_id', e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.employee_id ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            >
              <option value="">Select employee</option>
              {employees.map((emp) => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
            {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.date ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleChange('status', 'Present')}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
                  form.status === 'Present'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Present
              </button>
              <button
                type="button"
                onClick={() => handleChange('status', 'Absent')}
                className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all active:scale-[0.97] ${
                  form.status === 'Absent'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Absent
              </button>
            </div>
            {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 active:scale-[0.98] disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </span>
              ) : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
