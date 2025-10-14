const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

class ApiService {
  constructor() {
    this.baseURL = API_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  setAuthToken(token) {
    this.token = token
  }

  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {}
  }

  // Items endpoints
  async getItems(token) {
    return this.request('/api/items', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async getMyItems(token) {
    return this.request('/api/items/my-items', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async searchItems(query, location, token) {
    const params = new URLSearchParams()
    if (query) params.append('query', query)
    if (location) params.append('location', location)
    
    return this.request(`/api/items/search?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async createItem(itemData, token) {
    return this.request('/api/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(itemData)
    })
  }

  async updateItemStatus(itemId, status, token) {
    return this.request(`/api/items/${itemId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
  }

  async deleteItem(itemId, token) {
    return this.request(`/api/items/${itemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  // Claims endpoints
  async getReceivedClaims(token) {
    return this.request('/api/claims/received', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async getSentClaims(token) {
    return this.request('/api/claims/sent', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }

  async createClaim(claimData, token) {
    return this.request('/api/claims', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(claimData)
    })
  }

  async updateClaimStatus(claimId, status, token) {
    return this.request(`/api/claims/${claimId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

export const apiService = new ApiService()
export default apiService
