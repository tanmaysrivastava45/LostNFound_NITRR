import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Search, MapPin, Calendar, User, AlertCircle } from 'lucide-react'

const FindItems = () => {
  const { session, user } = useAuth()
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [loading, setLoading] = useState(true)
  const [claimModal, setClaimModal] = useState(null)
  const [claimMessage, setClaimMessage] = useState('')
  const [submittingClaim, setSubmittingClaim] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL

  const LOCATIONS = ['All', 'Hostel', 'Main Building', 'CCC', 'Canteen', 'Vihaan', 'Amul Parlour', 'B-Mart', 'Playground', 'Sports Complex', 'Basketball Court', 'Library', 'Other']

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [searchQuery, selectedLocation, items])

  const fetchItems = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/items`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const data = await response.json()
      setItems(data.filter(item => item.status === 'available'))
      setFilteredItems(data.filter(item => item.status === 'available'))
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = items

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedLocation && selectedLocation !== 'All') {
      filtered = filtered.filter(item => item.location === selectedLocation)
    }

    setFilteredItems(filtered)
  }

  const handleClaimSubmit = async (e) => {
    e.preventDefault()
    setSubmittingClaim(true)

    try {
      const response = await fetch(`${apiUrl}/api/claims`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          item_id: claimModal.id,
          message: claimMessage,
          status: 'pending'
        })
      })

      if (response.ok) {
        alert('Claim request submitted successfully!')
        setClaimModal(null)
        setClaimMessage('')
      }
    } catch (error) {
      console.error('Error submitting claim:', error)
      alert('Failed to submit claim')
    } finally {
      setSubmittingClaim(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Lost Items</h1>
        <p className="text-gray-600 mt-2">Search through found items on campus</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name or description..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="input-field"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc === 'All' ? '' : loc}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">No items found matching your criteria</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.item_name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.item_name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    <span>Found on {new Date(item.date_found).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User size={16} className="mr-2" />
                    <span>Posted by {item.users?.email}</span>
                  </div>
                </div>

                {item.user_id !== user.id && (
                  <button
                    onClick={() => setClaimModal(item)}
                    className="w-full btn-primary"
                  >
                    This is My Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Claim Modal */}
      {claimModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Claim Item</h2>
            <p className="text-gray-600 mb-4">
              You're claiming: <span className="font-semibold">{claimModal.item_name}</span>
            </p>
            <form onSubmit={handleClaimSubmit}>
              <textarea
                value={claimMessage}
                onChange={(e) => setClaimMessage(e.target.value)}
                placeholder="Explain why this item is yours and provide any identifying details..."
                rows="5"
                className="input-field resize-none mb-4"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {submittingClaim ? 'Submitting...' : 'Submit Claim'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClaimModal(null)
                    setClaimMessage('')
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FindItems
