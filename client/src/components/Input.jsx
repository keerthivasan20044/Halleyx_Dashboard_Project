export default function Input({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  error = '',
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-lg text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-200'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
