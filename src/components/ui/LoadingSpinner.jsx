import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      <p className="mt-3 text-sm text-gray-500">{message}</p>
    </div>
  )
}
