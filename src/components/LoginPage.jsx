import { useState, useEffect, useRef } from 'react'
import { Lock, Mail, ArrowRight, Eye, EyeOff, Zap } from 'lucide-react'

export default function LoginPage({ onNavigateSignup, onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [showPhonePrompt, setShowPhonePrompt] = useState(false)
  const [pendingUserData, setPendingUserData] = useState(null)
  const googleInitializedRef = useRef(false)

  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number')
      return
    }

    try {
      // Update user profile with phone number
      const updateRes = await fetch('http://localhost:8080/api/v1/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: pendingUserData.userId,
          fullName: pendingUserData.fullName,
          email: pendingUserData.email,
          phone: phoneNumber
        })
      })

      if (updateRes.ok) {
        console.log('✅ Phone number updated successfully')
        setShowPhonePrompt(false)
        // Proceed with login
        onLoginSuccess({
          userId: pendingUserData.userId,
          email: pendingUserData.email,
          fullName: pendingUserData.fullName,
          token: pendingUserData.token,
          phone: phoneNumber
        })
      } else {
        alert('Failed to save phone number. Please try again.')
      }
    } catch (error) {
      console.error('Error updating phone:', error)
      alert('Failed to save phone number')
    }
  }

  const handleGoogleSuccess = async (response) => {
    try {
      setIsLoading(true)
      console.log('🔵 Google sign-in successful')

      // Send the token to your backend
      const res = await fetch('http://localhost:8080/api/v1/auth/google/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      })

      const result = await res.json()

      if (res.ok && result.data) {
        console.log('✅ Backend authentication successful')
        // Store JWT token and user info
        localStorage.setItem('jwtToken', result.data.token)
        localStorage.setItem('userEmail', result.data.email)
        localStorage.setItem('userId', result.data.userId)
        localStorage.setItem('fullName', result.data.fullName)

        // Show phone number prompt
        setPendingUserData({
          userId: result.data.userId,
          email: result.data.email,
          fullName: result.data.fullName,
          token: result.data.token
        })
        setShowPhonePrompt(true)
        setPhoneNumber('')
      } else {
        alert('Authentication failed: ' + result.message)
      }
    } catch (error) {
      console.error('❌ Google login error:', error)
      alert('Failed to authenticate with Google')
    } finally {
      setIsLoading(false)
    }
  }

  // Load Google Sign-In script and initialize
  useEffect(() => {
    // Only initialize once
    if (googleInitializedRef.current) return

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    
    script.onload = () => {
      if (window.google && !googleInitializedRef.current) {
        googleInitializedRef.current = true
        
        window.google.accounts.id.initialize({
          client_id: '1030305046580-ltjejnm2f7cfpjung0e8lv7ca31gofrt.apps.googleusercontent.com',
          callback: handleGoogleSuccess
        })

        const buttonElement = document.getElementById('google-signin-button')
        if (buttonElement) {
          window.google.accounts.id.renderButton(buttonElement, {
            theme: 'filled_blue',
            size: 'large',
            type: 'standard',
            text: 'signin'
          })
        }
      }
    }
    
    document.head.appendChild(script)
  }, [handleGoogleSuccess])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch("http://localhost:8080/api/v1/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        let errorMsg = `Invalid email or password`;
        try {
          const errorData = await response.json();
          errorMsg = (typeof errorData.data === 'string' ? errorData.data : undefined) || errorData.message || errorMsg;
        } catch (e) {
          // ignore
        }
        throw new Error(errorMsg);
      }

      const result = await response.json()
      setIsLoading(false)
      
      const userData = result.data || result;
      
      console.log('✅ LOGIN SUCCESSFUL');
      console.log('📊 User Data from Backend:', userData);
      
      // Store JWT token in localStorage (critical for authenticated queue joins)
      if (userData.token) {
        localStorage.setItem('jwtToken', userData.token);
        console.log('🔐 JWT token stored in localStorage');
      }
      
      // Store userId in localStorage
      if (userData.userId) {
        localStorage.setItem('userId', userData.userId.toString());
        console.log('👤 User ID stored in localStorage:', userData.userId);
      }
      
      // Store email in localStorage for persistent access
      localStorage.setItem('userEmail', email);
      localStorage.setItem('email', email);
      console.log('📧 Email stored in localStorage:', email);
      
      // Pass the fully authenticated user data with email to App.jsx
      onLoginSuccess({ ...userData, email: email, token: userData.token })
    } catch (error) {
      console.error("Login failed:", error)
      alert("Failed to log in: " + error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1535] to-[#0a0e27] flex items-center justify-center px-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Phone Number Prompt Modal */}
      {showPhonePrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h2>
            <p className="text-slate-400 mb-6">Please provide your phone number to receive SMS queue notifications</p>
            
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl">📱</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+94779649968"
                    className="w-full bg-[#0a0e27] border border-[#2a3060] text-white text-sm rounded-xl pl-12 pr-4 py-3 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Format: +94779649968 or +94 77 964 9968</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 mt-6"
              >
                {isLoading ? 'Saving...' : 'Save & Continue'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
              <Zap size={32} className="text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              QueueSmart
            </span>
          </h1>
          <p className="text-slate-400">Welcome back to your queue management</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1a1f3a]/70 backdrop-blur-xl border border-[#2a3060] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#0a0e27] border border-[#2a3060] text-white text-sm rounded-xl pl-12 pr-4 py-3.5 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-white">Password</label>
                <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0a0e27] border border-[#2a3060] text-white text-sm rounded-xl pl-12 pr-12 py-3.5 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a3060]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-slate-500 bg-[#1a1f3a]">Or continue with Google</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <div className="flex justify-center">
            <div id="google-signin-button" className="mb-6"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-slate-400 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onNavigateSignup}
              className="text-blue-400 font-semibold hover:text-blue-300 transition"
            >
              Create one
            </button>
          </p>
        </div>

        {/* Security Note */}
        <p className="text-center text-slate-500 text-xs mt-6">
          🔒 Your data is secured with end-to-end encryption
        </p>
      </div>
    </div>
  )
}
