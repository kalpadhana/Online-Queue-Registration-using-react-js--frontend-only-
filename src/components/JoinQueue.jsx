import { useState } from 'react'
import { UserPlus, Clock, Users, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import Sidebar from './Sidebar'

export default function JoinQueue({ onNavigateToDashboard, onNavigateToTrackQueue, onNavigateToCrowdLevel, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings }) {
  const [selectedService, setSelectedService] = useState(null)
  const [formData, setFormData] = useState({
    serviceName: '',
    location: '',
    priority: 'normal',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [tokenNumber, setTokenNumber] = useState(null)

  const services = [
    { id: 1, name: 'Customer Service', icon: '👨‍💼', waitTime: '15 min', people: 12 },
    { id: 2, name: 'Banking', icon: '🏦', waitTime: '8 min', people: 5 },
    { id: 3, name: 'Mobile Recharge', icon: '📱', waitTime: '5 min', people: 3 },
    { id: 4, name: 'Bill Payment', icon: '💳', waitTime: '12 min', people: 9 },
    { id: 5, name: 'General Inquiry', icon: '❓', waitTime: '20 min', people: 15 },
    { id: 6, name: 'Document Verification', icon: '📄', waitTime: '25 min', people: 18 },
  ]

  const locations = [
    'Downtown Branch',
    'Airport Plaza',
    'City Center',
    'Mall Location',
    'North Branch',
  ]

  const handleSelect = (service) => {
    setSelectedService(service)
    setFormData({ ...formData, serviceName: service.name })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedService || !formData.location) {
      alert('Please select a service and location')
      return
    }
    // Generate token
    const token = `Q-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    setTokenNumber(token)
    setIsSubmitted(true)
    setTimeout(() => {
      // Auto reset after 5 seconds
      setIsSubmitted(false)
      setSelectedService(null)
      setFormData({ serviceName: '', location: '', priority: 'normal' })
    }, 5000)
  }

  if (isSubmitted && tokenNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#0f1535] to-[#0a0e27] flex items-center justify-center px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/30">
                <CheckCircle size={48} className="text-green-400 animate-bounce" />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2">Queue Joined!</h1>
            <p className="text-slate-400 mb-8">You're successfully added to the queue</p>

            <div className="bg-[#1a1f3a]/70 backdrop-blur-xl border border-[#2a3060] rounded-2xl p-8 mb-6">
              <p className="text-slate-400 text-sm mb-2">Your Token Number</p>
              <p className="text-6xl font-black text-green-400 mb-6 font-mono">{tokenNumber}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                  <p className="text-slate-400 text-sm">Service</p>
                  <p className="text-white font-semibold ml-auto">{formData.serviceName}</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                  <p className="text-slate-400 text-sm">Location</p>
                  <p className="text-white font-semibold ml-auto">{formData.location}</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                  <p className="text-slate-400 text-sm">Position</p>
                  <p className="text-white font-semibold ml-auto">#{selectedService?.people + 1}</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                  <p className="text-slate-400 text-sm">Est. Wait Time</p>
                  <p className="text-white font-semibold ml-auto">{selectedService?.waitTime}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Keep this token number handy. You'll be called when it's your turn.
              </p>
            </div>

            <button
              onClick={onNavigateToDashboard}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="joinQueue"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToJoinQueue={() => {}}
        onNavigateToTrackQueue={onNavigateToTrackQueue}
        onNavigateToCrowdLevel={onNavigateToCrowdLevel}
        onNavigateToNotifications={onNavigateToNotifications}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateToPriorityQueue={onNavigateToPriorityQueue}
        onNavigateToSettings={onNavigateToSettings}
      />

      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        {/* Header */}
        <header className="bg-[#1a1f3a]/50 backdrop-blur-sm border-b border-[#2a3060] px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Join Queue</h1>
              <p className="text-slate-400 text-sm">Get a token and join the waiting line</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Services */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <UserPlus size={24} className="text-blue-400" />
                  Select a Service
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleSelect(service)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedService?.id === service.id
                          ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20'
                          : 'bg-[#1a1f3a] border-[#2a3060] hover:border-blue-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-3xl">{service.icon}</span>
                        {selectedService?.id === service.id && (
                          <CheckCircle size={20} className="text-blue-400" />
                        )}
                      </div>
                      <h3 className="font-bold text-white mb-3">{service.name}</h3>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock size={14} />
                          {service.waitTime} avg wait
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Users size={14} />
                          {service.people} people ahead
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a1f3a]/70 backdrop-blur-xl border border-[#2a3060] rounded-2xl p-6 sticky top-8">
                <h2 className="text-xl font-bold text-white mb-6">Queue Details</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Display */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Selected Service
                    </label>
                    <div className="p-4 bg-[#0a0e27] border border-[#2a3060] rounded-xl">
                      <p className="text-white font-semibold">
                        {formData.serviceName || 'No service selected'}
                      </p>
                      {selectedService && (
                        <p className="text-blue-400 text-sm mt-1">
                          {selectedService.waitTime} wait • {selectedService.people} ahead
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Location
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full bg-[#0a0e27] border border-[#2a3060] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      required
                    >
                      <option value="">Choose a location</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Zap size={16} className="text-amber-400" />
                      Priority
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'normal', label: 'Normal' },
                        { value: 'priority', label: 'Priority (if eligible)' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="priority"
                            value={option.value}
                            checked={formData.priority === option.value}
                            onChange={(e) =>
                              setFormData({ ...formData, priority: e.target.value })
                            }
                            className="w-4 h-4 accent-blue-500"
                          />
                          <span className="text-sm text-slate-400">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                    <div className="flex gap-2">
                      <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-200">
                        You'll receive notifications when your turn approaches. Keep your token
                        number safe.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!selectedService || !formData.location}
                    className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Join Queue Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
