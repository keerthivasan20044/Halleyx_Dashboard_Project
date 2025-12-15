export default function Card({
  children,
  title = '',
  description = '',
  actions = [],
  className = '',
  ...props
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`} {...props}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      )}

      <div className="mb-6">{children}</div>

      {actions.length > 0 && (
        <div className="flex gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                action.variant === 'primary'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
