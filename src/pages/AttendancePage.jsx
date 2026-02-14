import { useState, useEffect } from 'react'
import { CalendarPlus, CalendarCheck, Filter, X } from 'lucide-react'
import api from '../api/axios'
import AttendanceForm from '../components/AttendanceForm'
import AttendanceList from '../components/AttendanceList'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import EmptyState from '../components/ui/EmptyState'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function AttendancePage() {
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [filterEmployee, setFilterEmployee] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterDate) params.append('date', filterDate)
      if (filterEmployee) params.append('employee_id', filterEmployee)
      const query = params.toString() ? `?${params.toString()}` : ''

      const [attendanceRes, employeesRes] = await Promise.all([
        api.get(`/api/attendance${query}`),
        api.get('/api/employees'),
      ])
      setRecords(attendanceRes.data)
      setEmployees(employeesRes.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load attendance records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [filterDate, filterEmployee])

  const clearFilters = () => {
    setFilterDate('')
    setFilterEmployee('')
  }

  const hasFilters = filterDate || filterEmployee

  // Calculate present days per employee
  const presentDays = {}
  records.forEach((r) => {
    if (r.status === 'Present') {
      presentDays[r.employee_id] = (presentDays[r.employee_id] || 0) + 1
    }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="text-sm text-slate-500 mt-1">Track and manage employee attendance</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <CalendarPlus className="h-4 w-4" />
          Mark Attendance
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filters:</span>
        </div>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
        />
        <select
          value={filterEmployee}
          onChange={(e) => setFilterEmployee(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
        >
          <option value="">All Employees</option>
          {employees.map((emp) => (
            <option key={emp.employee_id} value={emp.employee_id}>
              {emp.full_name}
            </option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Present days summary */}
      {Object.keys(presentDays).length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(presentDays).map(([empId, count]) => {
            const emp = employees.find((e) => e.employee_id === empId)
            return (
              <span
                key={empId}
                className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600 border border-green-200"
              >
                {emp?.full_name || empId}: {count} day{count !== 1 ? 's' : ''} present
              </span>
            )
          })}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <LoadingSpinner message="Loading attendance records..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchData} />
        ) : records.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No attendance records"
            description={hasFilters ? 'No records match the applied filters' : 'Mark attendance to get started'}
          />
        ) : (
          <AttendanceList records={records} />
        )}
      </div>

      {showForm && (
        <AttendanceForm
          employees={employees}
          onClose={() => setShowForm(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  )
}
