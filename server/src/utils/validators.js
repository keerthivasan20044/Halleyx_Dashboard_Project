const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
const zipCodeRegex = /^\d{5}(-\d{4})?$/

export const validateEmail = (email) => {
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  return phoneRegex.test(phone)
}

export const validateZipCode = (zip) => {
  return zipCodeRegex.test(zip)
}

export const validateOrder = (data) => {
  const errors = {}

  if (!data.customer) {
    errors.customer = 'Customer information is required'
  } else {
    if (!data.customer.firstName?.trim()) errors.customerFirstName = 'First name is required'
    if (!data.customer.lastName?.trim()) errors.customerLastName = 'Last name is required'
    if (!data.customer.email?.trim()) {
      errors.customerEmail = 'Email is required'
    } else if (!validateEmail(data.customer.email)) {
      errors.customerEmail = 'Invalid email format'
    }
    if (!data.customer.phone?.trim()) {
      errors.customerPhone = 'Phone is required'
    } else if (!validatePhone(data.customer.phone)) {
      errors.customerPhone = 'Invalid phone format'
    }
  }

  if (!data.order) {
    errors.order = 'Order information is required'
  } else {
    if (!data.order.product?.trim()) errors.orderProduct = 'Product is required'
    if (!data.order.quantity || data.order.quantity < 1) errors.orderQuantity = 'Quantity must be at least 1'
    if (!data.order.unitPrice || data.order.unitPrice < 0) errors.orderUnitPrice = 'Unit price must be greater than 0'
    if (!Object.values(['Pending', 'In Progress', 'Completed']).includes(data.order.status)) {
      errors.orderStatus = 'Invalid status'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateDashboardConfig = (data) => {
  const errors = {}

  if (!Array.isArray(data.layout)) errors.layout = 'Layout must be an array'
  if (!Array.isArray(data.widgets)) errors.widgets = 'Widgets must be an array'

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id)
}
