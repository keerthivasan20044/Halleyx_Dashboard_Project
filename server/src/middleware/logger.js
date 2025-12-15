export function requestLogger(req, res, next) {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`)
  })
  next()
}

export function errorHandler(err, req, res, next) {
  console.error('Error:', err)
  const status = err.status || 500
  res.status(status).json({ message: err.message || 'Internal Server Error' })
}
