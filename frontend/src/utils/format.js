import { DATE_FORMAT_OPTIONS } from './constants'

// Format date
export const formatDate = (dateString, format = 'SHORT') => {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', DATE_FORMAT_OPTIONS[format])
  } catch (error) {
    return 'Invalid Date'
  }
}

// Format relative time
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'N/A'

  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
    
    return formatDate(dateString)
  } catch (error) {
    return 'Invalid Date'
  }
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Capitalize first letter
export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Extract name from email
export const getNameFromEmail = (email) => {
  if (!email) return 'Unknown'
  const name = email.split('@')[0]
  return name.split('.').map(capitalizeFirst).join(' ')
}
