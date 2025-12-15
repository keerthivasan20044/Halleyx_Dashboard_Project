export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  ...props
}) {
  const baseStyles = 'font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
  }
  
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  // Validate variant and size
  const validVariant = variants[variant] ? variant : 'primary'
  const validSize = sizes[size] ? size : 'md'
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    try {
      onClick?.(e)
    } catch (error) {
      console.error('Button click error:', error)
    }
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[validVariant]} ${sizes[validSize]} ${disabledStyles} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}
