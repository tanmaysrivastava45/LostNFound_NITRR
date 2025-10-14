import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../utils/supabaseClient'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'

const LOCATIONS = [
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
  'Other'
]

const PostItem = () => {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    location: '',
    date_found: '',
    contact_details: '',
    additional_info: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const apiUrl = import.meta.env.VITE_API_URL

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setImageFile(file)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let imageUrl = null

      // Upload image to Supabase Storage if file exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('item-images')
          .upload(fileName, imageFile)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('item-images')
          .getPublicUrl(fileName)

        imageUrl = publicUrl
      }

      // Post item via API
      const response = await fetch(`${apiUrl}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
          status: 'available'
        })
      })

      if (!response.ok) throw new Error('Failed to post item')

      navigate('/dashboard')
    } catch (error) {
      setError(error.message || 'Failed to post item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post Found Item</h1>
        <p className="text-gray-600 mt-2">Help someone find their lost belongings</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle size={20} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Black Wallet, Red Water Bottle"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="input-field resize-none"
              placeholder="Describe the item in detail..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Found *
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Found *
              </label>
              <input
                type="date"
                name="date_found"
                value={formData.date_found}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Details *
            </label>
            <input
              type="text"
              name="contact_details"
              value={formData.contact_details}
              onChange={handleChange}
              className="input-field"
              placeholder="Phone number or email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information
            </label>
            <textarea
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
              rows="3"
              className="input-field resize-none"
              placeholder="Any other relevant details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-2" size={40} />
                <p className="text-sm text-gray-600">
                  {imageFile ? imageFile.name : 'Click to upload image (Max 5MB)'}
                </p>
              </label>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Item'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostItem
