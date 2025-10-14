// Location options for items
export const LOCATIONS = [
  'Hostel',
  'Main Building',
  'CCC',
  'Canteen',
  'Vihaan',
  'Amul Parlour',
  'B-Mart',
  'Playground',
  'Sports Complex',
  'Basketball Court',
  'Library',
  'Lecture Hall Complex',
  'Academic Block',
  'Admin Block',
  'Other'
]

// Item status options
export const ITEM_STATUS = {
  AVAILABLE: 'available',
  CLAIMED: 'claimed',
  RETURNED: 'returned'
}

// Claim status options
export const CLAIM_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
}

// Email domain validation
export const NITRR_EMAIL_DOMAIN = ['@nitrr.ac.in', '@it.nitrr.ac.in','@gmail.com']

// Date format options
export const DATE_FORMAT_OPTIONS = {
  SHORT: {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  },
  LONG: {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
}

// Image upload constraints
export const IMAGE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
}

// Pagination
export const ITEMS_PER_PAGE = 12

// Toast notification duration
export const TOAST_DURATION = 3000 // 3 seconds
