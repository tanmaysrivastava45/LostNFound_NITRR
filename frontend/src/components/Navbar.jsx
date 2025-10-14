import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Upload, Search, LayoutDashboard, LogOut } from 'lucide-react'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img 
                src="/nitrr-logo.png" 
                alt="NIT Raipur" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="text-xl font-bold text-primary-600">Lost & Found</div>
                <div className="text-xs text-gray-500">NIT Raipur</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive('/dashboard')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard size={20} className="mr-2" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              to="/post-item"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive('/post-item')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Upload size={20} className="mr-2" />
              <span className="font-medium">Post Item</span>
            </Link>

            <Link
              to="/find-items"
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                isActive('/find-items')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Search size={20} className="mr-2" />
              <span className="font-medium">Find Items</span>
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-2"
            >
              <LogOut size={20} className="mr-2" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
