import { useState, useEffect } from 'react'
import { Users, UserCheck, UserX, Clock, CalendarCheck } from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorMessage from '../components/ui/ErrorMessage'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [recentAttendance, setRecentAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const [summaryRes, attendanceRes] = await Promise.all([
        api.get('/api/attendance/summary/today'),
        api.get('/api/attendance'),
      ])
      setSummary(summaryRes.data)
      setRecentAttendance(attendanceRes.data.slice(0, 10))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) return <LoadingSpinner message="Loading dashboard..." />
  if (error) return <ErrorMessage message={error} onRetry={fetchDashboard} />

  const stats = [
    {
      label: 'Total Employees',
      value: summary?.total_employees || 0,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-blue-200',
    },
    {
      label: 'Present Today',
      value: summary?.present || 0,
      icon: UserCheck,
      color: 'bg-green-50 text-green-600',
      border: 'border-green-200',
    },
    {
      label: 'Absent Today',
      value: summary?.absent || 0,
      icon: UserX,
      color: 'bg-red-50 text-red-600',
      border: 'border-red-200',
    },
    {
      label: 'Not Marked',
      value: summary?.not_marked || 0,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
      border: 'border-amber-200',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, border }) => (
          <div key={label} className={`rounded-xl border ${border} bg-white p-5 shadow-sm`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
              </div>
              <div className={`rounded-lg p-3 ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent attendance */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Recent Attendance</h2>
          <p className="text-xs text-slate-500 mt-0.5">Latest 10 attendance records</p>
        </div>
        {recentAttendance.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarCheck className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No attendance records yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
                          {(rec.employee_name || rec.employee_id).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{rec.employee_name || rec.employee_id}</p>
                          <p className="text-xs text-slate-400">{rec.employee_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
        )}
      </div>
    </div>
  )
}
