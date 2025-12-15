import { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function Toast({
  message = '',
  type = 'success',
  duration = 3000,
  onClose,
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const icons = {
    success: <CheckCircle size={20} className="text-green-600" />,
    error: <AlertCircle size={20} className="text-red-600" />,
    info: <Info size={20} className="text-blue-600" />,
    warning: <AlertCircle size={20} className="text-yellow-600" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
  }

  return (
    <div className={`fixed top-4 right-4 max-w-sm border rounded-lg p-4 shadow-lg ${bgColors[type]}`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className={`text-sm font-medium ${textColors[type]}`}>{message}</p>
        <button
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
          className={`ml-auto text-gray-400 hover:text-gray-600`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
