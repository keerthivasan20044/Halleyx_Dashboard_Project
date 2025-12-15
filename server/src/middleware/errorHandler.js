export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = err.errors[key].message
        return acc
      }, {}),
    })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
    })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    })
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
}

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
