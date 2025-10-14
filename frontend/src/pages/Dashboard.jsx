import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'
import { Package, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react'

const Dashboard = () => {
  const { user, session } = useAuth()
  const [myItems, setMyItems] = useState([])
  const [receivedClaims, setReceivedClaims] = useState([])
  const [sentClaims, setSentClaims] = useState([]) // NEW: Claims you submitted
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('myItems') // NEW: Tab state
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's posted items
      const itemsRes = await fetch(`${apiUrl}/api/items/my-items`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const itemsData = await itemsRes.json()
      setMyItems(itemsData)

      // Fetch claim requests RECEIVED (on your items)
      const receivedClaimsRes = await fetch(`${apiUrl}/api/claims/received`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const receivedClaimsData = await receivedClaimsRes.json()
      setReceivedClaims(receivedClaimsData)

      // NEW: Fetch claim requests SENT (you submitted)
      const sentClaimsRes = await fetch(`${apiUrl}/api/claims/sent`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })
      const sentClaimsData = await sentClaimsRes.json()
      setSentClaims(sentClaimsData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateItemStatus = async (itemId, status) => {
    try {
      await fetch(`${apiUrl}/api/items/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status })
      })
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const updateClaimStatus = async (claimId, status) => {
    try {
      await fetch(`${apiUrl}/api/claims/${claimId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status })
      })
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating claim:', error)
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
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.user_metadata?.full_name}!</p>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Items Posted</p>
              <p className="text-3xl font-bold text-gray-900">{myItems.length}</p>
            </div>
            <Package className="text-primary-600" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Claims Received</p>
              <p className="text-3xl font-bold text-gray-900">
                {receivedClaims.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <Clock className="text-yellow-600" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Claims Sent</p>
              <p className="text-3xl font-bold text-gray-900">{sentClaims.length}</p>
            </div>
            <Send className="text-blue-600" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Items Returned</p>
              <p className="text-3xl font-bold text-gray-900">
                {myItems.filter(i => i.status === 'returned').length}
              </p>
            </div>
            <CheckCircle className="text-green-600" size={40} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('myItems')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'myItems'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Posted Items ({myItems.length})
            </button>
            <button
              onClick={() => setActiveTab('receivedClaims')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'receivedClaims'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Claims Received ({receivedClaims.length})
            </button>
            <button
              onClick={() => setActiveTab('sentClaims')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'sentClaims'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Claim Requests ({sentClaims.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* My Posted Items Tab */}
          {activeTab === 'myItems' && (
            <div>
              {myItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">You haven't posted any items yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.item_name} className="w-20 h-20 object-cover rounded" />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.item_name}</h3>
                          <p className="text-sm text-gray-600">Found at: {item.location}</p>
                          <p className="text-sm text-gray-500">{new Date(item.date_found).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <select
                          value={item.status}
                          onChange={(e) => updateItemStatus(item.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="available">Available</option>
                          <option value="claimed">Claimed</option>
                          <option value="returned">Returned</option>
                        </select>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'returned' ? 'bg-green-100 text-green-800' :
                          item.status === 'claimed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Claims Received Tab */}
          {activeTab === 'receivedClaims' && (
            <div>
              {receivedClaims.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No claim requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedClaims.map((claim) => (
                    <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{claim.items.item_name}</h3>
                          <p className="text-sm text-gray-600">Claimed by: {claim.users.email}</p>
                          <p className="text-sm text-gray-500">{new Date(claim.created_at).toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                          claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {claim.status}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <p className="text-sm text-gray-700"><strong>Message:</strong> {claim.message}</p>
                      </div>
                      {claim.status === 'pending' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => updateClaimStatus(claim.id, 'approved')}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateClaimStatus(claim.id, 'rejected')}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sent Claims Tab - NEW */}
          {activeTab === 'sentClaims' && (
            <div>
              {sentClaims.length === 0 ? (
                <div className="text-center py-12">
                  <Send className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">You haven't submitted any claim requests yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentClaims.map((claim) => (
                    <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          {claim.items.image_url && (
                            <img src={claim.items.image_url} alt={claim.items.item_name} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{claim.items.item_name}</h3>
                            <p className="text-sm text-gray-600">Location: {claim.items.location}</p>
                            <p className="text-sm text-gray-500">Submitted: {new Date(claim.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                          claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {claim.status === 'approved' ? 'Approved ✓' :
                           claim.status === 'rejected' ? 'Rejected ✗' :
                           'Pending Review'}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm text-gray-700"><strong>Your message:</strong> {claim.message}</p>
                      </div>
                      {claim.status === 'approved' && (
                        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-800">
                            ✓ Your claim has been approved! Contact the item poster to arrange pickup.
                          </p>
                        </div>
                      )}
                      {claim.status === 'rejected' && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            ✗ Your claim was not approved. The item poster may have found the rightful owner.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
