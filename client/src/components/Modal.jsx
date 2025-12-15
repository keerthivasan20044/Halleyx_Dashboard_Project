import { X } from 'lucide-react'
import { useEffect } from 'react'

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

  const validSize = sizes[size] ? size : 'md'
  const validActions = Array.isArray(actions) ? actions : []

  const handleClose = () => {
    try {
      onClose?.()
    } catch (error) {
      console.error('Modal close error:', error)
    }
  }

  const handleActionClick = (action) => {
    try {
      action?.onClick?.()
    } catch (error) {
      console.error('Modal action error:', error)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className={`relative bg-white rounded-lg shadow-xl ${sizes[validSize]} w-full mx-4`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title || 'Modal'}</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Actions */}
        {validActions.length > 0 && (
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
            {validActions.map((action, index) => (
              <button
                key={action.key || index}
                onClick={() => handleActionClick(action)}
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
                {action.label || 'Action'}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
