import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-orange-500" />
      <h3 className="mt-4 text-lg font-medium text-slate-900">Error</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
