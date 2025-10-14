import { Link } from 'react-router-dom'
import { Search, Upload, Shield, Clock, MapPin, Bell } from 'lucide-react'
const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section with Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* NIT Raipur Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/nitrr-logo.png" 
              alt="NIT Raipur Logo" 
              className="h-32 w-32 md:h-40 md:w-40 object-contain animate-fade-in"
            />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Lost & Found Portal
          </h1>
          <p className="text-2xl text-primary-600 font-semibold mb-2">
            National Institute of Technology, Raipur
          </p>
          <p className="text-lg text-gray-500 mb-8 italic">
             नित्यं यातो शुभोदयं (Let the rise of goodness happen every day)
          </p>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A centralized platform to help the NITRR community reconnect with their lost belongings. 
            Post found items, search for your lost possessions, and help others find what they've lost.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/signup" className="btn-primary text-lg px-8 py-3">
              Get Started
            </Link>
            <Link to="/signin" className="btn-secondary text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Post Found Items</h3>
              <p className="text-gray-600">
                Found something on campus? Post it with details like location, date, and images to help owners identify their belongings.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search Lost Items</h3>
              <p className="text-gray-600">
                Browse through posted items and use our search feature to quickly find your lost belongings across campus locations.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-primary-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Raise Claims</h3>
              <p className="text-gray-600">
                Found your item? Submit a claim request. The poster will review and connect with you to return your belongings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Use Our Portal?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <Shield className="text-primary-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
                <p className="text-gray-600">
                  Exclusive access for NITRR students and staff with email verification.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="text-primary-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-2">Real-time Updates</h3>
                <p className="text-gray-600">
                  Get instant notifications when items are posted or when someone claims your posted item.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="text-primary-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-2">Location-based Search</h3>
                <p className="text-gray-600">
                  Filter items by specific campus locations like hostels, CCC, canteen, sports complex, and more.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Upload className="text-primary-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-semibold text-lg mb-2">Easy to Use</h3>
                <p className="text-gray-600">
                  Simple interface to post items with images, manage your dashboard, and track claim requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join the NITRR community in making campus a better place. Sign up with your institute email today!
          </p>
          <Link to="/signup" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg inline-block transition-colors">
            Create Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/nitrr-logo.png" 
              alt="NIT Raipur Logo" 
              className="h-16 w-16 object-contain opacity-80"
            />
          </div>
          <p className="text-gray-400">
            Developed by Tanmay Srivastava | NIT Raipur Lost & Found Portal
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For NITRR community use only 
            {/* | Requires @nitrr.ac.in or @it.nitrr.ac.in email */}
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
