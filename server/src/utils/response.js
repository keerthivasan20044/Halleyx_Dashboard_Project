export const sendSuccess = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  })
}

export const sendError = (res, message, statusCode = 400, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  })
}

export const sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Validation error',
    errors,
  })
}

export const sendNotFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message,
  })
}

export const sendUnauthorized = (res, message = 'Unauthorized') => {
  return res.status(401).json({
    success: false,
    message,
  })
}

export const sendForbidden = (res, message = 'Forbidden') => {
  return res.status(403).json({
    success: false,
    message,
  })
}

export const sendServerError = (res, message = 'Internal server error') => {
  return res.status(500).json({
    success: false,
    message,
  })
}
