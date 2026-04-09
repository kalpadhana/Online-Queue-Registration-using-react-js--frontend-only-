import { useState } from 'react'
import { Lock, X, AlertCircle } from 'lucide-react'

export default function AdminAuthModal({ onSuccess, onCancel }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Admin credentials
  const ADMIN_USERNAME = 'malindi'
  const ADMIN_PASSWORD = '0000'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate a small delay for security feel
    await new Promise(resolve => setTimeout(resolve, 500))

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoading(false)
      onSuccess()
      setUsername('')
      setPassword('')
    } else {
      setIsLoading(false)
      setError('Invalid username or password')
      setPassword('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-2xl shadow-2xl w-full max-w-md p-8 mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Lock size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Access</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-[#2a3060] rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-6">
          Enter your admin credentials to access the admin dashboard
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter username"
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-[#0a0e27] border border-[#2a3060] text-white rounded-lg placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all disabled:opacity-50"
              autoFocus
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter password"
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-[#0a0e27] border border-[#2a3060] text-white rounded-lg placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all disabled:opacity-50"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg transition-all font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !username || !password}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Login'}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <p className="text-xs text-slate-500 text-center mt-4">
          Contact your administrator if you need access
        </p>
      </div>
    </div>
  )
}
