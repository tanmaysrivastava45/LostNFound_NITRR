import { NITRR_EMAIL_DOMAINS, IMAGE_CONSTRAINTS } from './constants'

// Email validation - UPDATED TO ACCEPT BOTH DOMAINS
export const isValidNITRREmail = (email) => {
  if (!email) return false
  const lowerEmail = email.toLowerCase()
  return NITRR_EMAIL_DOMAINS.some(domain => lowerEmail.endsWith(domain.toLowerCase()))
}

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

// Image validation
export const isValidImage = (file) => {
  if (!file) return { valid: false, error: 'No file provided' }

  // Check file size
  if (file.size > IMAGE_CONSTRAINTS.MAX_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${IMAGE_CONSTRAINTS.MAX_SIZE / (1024 * 1024)}MB`
    }
  }

  // Check file type
  if (!IMAGE_CONSTRAINTS.ACCEPTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Only ${IMAGE_CONSTRAINTS.ACCEPTED_EXTENSIONS.join(', ')} files are allowed`
    }
  }

  return { valid: true }
}

// Date validation
export const isValidDate = (date) => {
  if (!date) return false
  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selectedDate <= today
}

// Form field validation
export const validateItemForm = (formData) => {
  const errors = {}

  if (!formData.item_name?.trim()) {
    errors.item_name = 'Item name is required'
  }

  if (!formData.description?.trim()) {
    errors.description = 'Description is required'
  }

  if (!formData.location) {
    errors.location = 'Location is required'
  }

  if (!formData.date_found) {
    errors.date_found = 'Date found is required'
  } else if (!isValidDate(formData.date_found)) {
    errors.date_found = 'Date cannot be in the future'
  }

  if (!formData.contact_details?.trim()) {
    errors.contact_details = 'Contact details are required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/[<>]/g, '')
}
