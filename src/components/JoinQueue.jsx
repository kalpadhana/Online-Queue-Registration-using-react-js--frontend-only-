import { useState, useEffect } from 'react'
import { UserPlus, Clock, Users, CheckCircle, AlertCircle, Zap } from 'lucide-react'
import Sidebar from './Sidebar'

export default function JoinQueue({ userName, email, userId, onQueueJoined, onNavigateToDashboard, onNavigateToTrackQueue, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings, onLogout }) {
  const [selectedService, setSelectedService] = useState(null)
  const [formData, setFormData] = useState({
    serviceName: '',
    location: '',
    priority: 'normal',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [tokenNumber, setTokenNumber] = useState(null)
  const [services, setServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [servicesError, setServicesError] = useState(null)

  // Fetch services from backend database
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true)
        const response = await fetch("http://localhost:8080/api/v1/service")
        
        if (response.ok) {
          const data = await response.json()
          console.log("✅ Services fetched from backend:", data)
          
          // Map service API data with icons and formatted wait times
          const iconMap = {
            'Customer Service': '👨‍💼',
            'Banking': '🏦',
            'Mobile Recharge': '📱',
            'Bill Payment': '💳',
            'General Inquiry': '❓',
            'Document Verification': '📄'
          }
          
          // Normalize data with icons based on service name
          const normalizedData = data.map(service => ({
            ...service,
            id: service.id || service.serviceId,
            icon: iconMap[service.name] || '🔧',
            waitTime: `${service.avgWaitTime || 15} min`,
            people: Math.floor(Math.random() * 20) + 1 // Mock people count
          }))
          setServices(normalizedData)
          setServicesError(null)
        } else {
          // Backend endpoint not available yet, use mock data
          console.log("ℹ️ Backend /api/services not available (status: " + response.status + "), using mock data")
          setServicesError(null)
          throw new Error("FALLBACK_TO_MOCK")
        }
      } catch (error) {
        // Silently fallback to mock data - don't show error unless explicitly needed
        if (error.message !== "FALLBACK_TO_MOCK") {
          console.warn("⚠️ Failed to fetch services:", error.message)
        }
        
        // Fallback to mock data if backend fails
        const mockServices = [
          { id: 1, name: 'Customer Service', icon: '👨‍💼', waitTime: '15 min', people: 12 },
          { id: 2, name: 'Banking', icon: '🏦', waitTime: '8 min', people: 5 },
          { id: 3, name: 'Mobile Recharge', icon: '📱', waitTime: '5 min', people: 3 },
          { id: 4, name: 'Bill Payment', icon: '💳', waitTime: '12 min', people: 9 },
          { id: 5, name: 'General Inquiry', icon: '❓', waitTime: '20 min', people: 15 },
          { id: 6, name: 'Document Verification', icon: '📄', waitTime: '25 min', people: 18 },
        ]
        setServices(mockServices)
      } finally {
        setIsLoadingServices(false)
      }
    }
    
    fetchServices()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate email exists (user must be signed up)
    if (!email) {
      alert('You must sign up first to join a queue. Please create an account with your email.')
      return
    }
    
    // Validate all required fields
    if (!selectedService || !formData.location) {
      alert('Please select a service and location')
      return
    }

    try {
      // Find branch ID based on selected location name or default to 1
      const branchIndex = locations.findIndex(loc => loc === formData.location);
      const branchId = branchIndex >= 0 ? branchIndex + 1 : 1;

      // Create the exact payload your backend expects
      const requestPayload = {
        userId: userId || 1, // Send actual userId from state, fallback to 1
        serviceId: selectedService.id || selectedService.serviceId, // Make sure service id is correct
        branchId: branchId
      };

      // ✨ DEBUG LOGGING - Check what we're sending to backend ✨
      console.log("=== QUEUE JOIN REQUEST ===");
      console.log("Payload being sent to backend:", requestPayload);
      console.log("Email from user account:", email);
      console.log("User ID:", requestPayload.userId);
      console.log("Branch ID:", requestPayload.branchId);
      console.log("Service ID:", requestPayload.serviceId);
      console.log("=== END DEBUG ===");

      // Send request to backend
      const response = await fetch("http://localhost:8080/api/v1/queues/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      // Handle non-successful responses
      if (!response.ok) {
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("Backend error response:", errorData);
          errorMsg = JSON.stringify(errorData);
        } catch (e) {
          const errorText = await response.text();
          if (errorText) {
            console.error("Backend error text:", errorText);
            errorMsg = errorText;
          }
        }
        throw new Error(errorMsg);
      }

      // Success! Parse the response
      const data = await response.json();
      console.log("Queue join successful! Full Response:", data);
      
      // Extract token from nested response structure (APIResponse<QueueDTO>)
      const queueData = data.data || data;
      const token = queueData.token || queueData.queueId || `Q-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      console.log("Extracted token:", token, "from queue data:", queueData);
      
      // Store email in localStorage for later retrieval by TrackQueue
      if (email) {
        localStorage.setItem('userEmail', email);
        console.log("Stored email in localStorage:", email);
      }
      
      setTokenNumber(token);
      
      // Pass token to parent component (App.jsx) to store globally
      if (onQueueJoined) {
        onQueueJoined(token);
        console.log("Called onQueueJoined with token:", token);
      }
      
      setIsSubmitted(true);

      // Auto reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setSelectedService(null)
        setFormData({ serviceName: '', location: '', priority: 'normal' })
      }, 5000)

    } catch (error) {
      console.error("❌ Queue join failed:", error.message);
      alert(`Failed to join queue:\n${error.message}`);
    }
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
        userName={userName}
        email={email}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToJoinQueue={() => {}}
        onNavigateToTrackQueue={onNavigateToTrackQueue}
        onNavigateToNotifications={onNavigateToNotifications}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateToPriorityQueue={onNavigateToPriorityQueue}
        onNavigateToSettings={onNavigateToSettings}
        onLogout={onLogout}
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
                
                {/* Loading State */}
                {isLoadingServices && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="p-6 rounded-xl bg-[#1a1f3a] border border-[#2a3060] animate-pulse">
                        <div className="h-8 w-8 bg-[#2a3060] rounded mb-3"></div>
                        <div className="h-5 w-32 bg-[#2a3060] rounded mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-[#2a3060] rounded"></div>
                          <div className="h-4 w-24 bg-[#2a3060] rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Error State */}
                {servicesError && !isLoadingServices && (
                  <div className="p-4 bg-amber-600/10 border border-amber-500/30 rounded-xl mb-4">
                    <p className="text-amber-200 text-sm">
                      Could not load services from server. Showing cached data.
                    </p>
                  </div>
                )}
                
                {/* Services List */}
                {!isLoadingServices && (
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
                          <span className="text-3xl">{service.icon || '🔧'}</span>
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
                )}
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
