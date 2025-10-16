import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'
import { CheckCircle, Loader, XCircle } from 'lucide-react'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically exchanges the token in the URL hash
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Session error:', error)
          setStatus('error')
          setTimeout(() => navigate('/signin'), 3000)
          return
        }

        if (session) {
          console.log('Session verified:', session)
          setStatus('success')
          setTimeout(() => navigate('/dashboard'), 2000)
        } else {
          setStatus('error')
          setTimeout(() => navigate('/signin'), 3000)
        }
      } catch (error) {
        console.error('Callback error:', error)
        setStatus('error')
        setTimeout(() => navigate('/signin'), 3000)
      }
    }

    // Small delay to ensure hash params are processed
    const timer = setTimeout(handleCallback, 500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <img 
            src="/nitrr-logo.png" 
            alt="NIT Raipur Logo" 
            className="h-24 w-24 object-contain"
          />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {status === 'verifying' && (
            <>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="text-blue-600 animate-spin" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Email...</h2>
              <p className="text-gray-600">Please wait while we confirm your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Verified! ✓</h2>
              <p className="text-gray-600">Redirecting to dashboard...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="text-red-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Issue</h2>
              <p className="text-gray-600">Redirecting to sign in...</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthCallback
