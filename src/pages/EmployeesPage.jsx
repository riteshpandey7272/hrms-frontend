import { useState, useEffect } from 'react'
import { UserPlus, Users } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import EmployeeForm from '../components/EmployeeForm'
import EmployeeList from '../components/EmployeeList'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchEmployees = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/api/employees')
      setEmployees(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/api/employees/${deleteTarget.employee_id}`)
      toast.success(`Employee "${deleteTarget.full_name}" deleted`)
      setDeleteTarget(null)
      fetchEmployees()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete employee')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your employee records</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <LoadingSpinner message="Loading employees..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchEmployees} />
        ) : employees.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No employees yet"
            description="Add your first employee to get started"
          />
        ) : (
          <EmployeeList employees={employees} onDelete={setDeleteTarget} />
        )}
      </div>

      {showForm && (
        <EmployeeForm onClose={() => setShowForm(false)} onSuccess={fetchEmployees} />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl animate-slideUp">
            <h3 className="text-lg font-semibold text-slate-900">Delete Employee</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete <strong>{deleteTarget.full_name}</strong> ({deleteTarget.employee_id})?
              This will also remove all their attendance records.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {deleting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Deleting...
                  </span>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
