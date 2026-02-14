import { useState } from 'react'
import { X } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Design', 'Product']

export default function EmployeeForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.employee_id.trim()) errs.employee_id = 'Employee ID is required'
    if (!form.full_name.trim()) errs.full_name = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.department) errs.department = 'Department is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await api.post('/api/employees', form)
      toast.success('Employee added successfully')
      onSuccess()
      onClose()
    } catch (err) {
      const message = err.response?.data?.detail || 'Failed to add employee'
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
          <h2 className="text-lg font-semibold text-slate-900">Add New Employee</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Employee ID</label>
            <input
              type="text"
              value={form.employee_id}
              onChange={(e) => handleChange('employee_id', e.target.value)}
              placeholder="e.g. EMP001"
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.employee_id ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.employee_id && <p className="mt-1 text-xs text-red-500">{errors.employee_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="e.g. Ritesh Pandey"
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.full_name ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.full_name && <p className="mt-1 text-xs text-red-500">{errors.full_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. ritesh@company.com"
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            <select
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className={`w-full rounded-lg border px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.department ? 'border-red-300 bg-red-50' : 'border-slate-300'
              }`}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department}</p>}
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
                  Adding...
                </span>
              ) : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
