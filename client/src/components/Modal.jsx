import { X } from 'lucide-react'

export default function Modal({
  isOpen = false,
  onClose,
  title = '',
  children,
  actions = [],
  size = 'md',
}) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-xl ${sizes[size]} w-full mx-4`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${action.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : action.variant === 'secondary'
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }
                `}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
