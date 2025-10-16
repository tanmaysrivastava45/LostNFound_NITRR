import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AuthCallback from './pages/AuthCallback'  // MUST IMPORT THIS
import Dashboard from './pages/Dashboard'
import PostItem from './pages/PostItem'
import FindItems from './pages/FindItems'
import Navbar from './components/Navbar' 

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/signin" replace />
  }
  
  return children
}

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {user && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
            <Route path="/signin" element={user ? <Navigate to="/dashboard" /> : <SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* CRITICAL: This route MUST exist */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/post-item" element={
              <ProtectedRoute>
                <PostItem />
              </ProtectedRoute>
            } />
            
            <Route path="/find-items" element={
              <ProtectedRoute>
                <FindItems />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
