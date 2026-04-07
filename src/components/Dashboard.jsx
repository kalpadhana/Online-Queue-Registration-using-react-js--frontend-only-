import {
  Bell,
  TrendingUp,
  UserPlus,
  MapPin,
  Users,
  Shield,
  Zap,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

export default function Dashboard({ userId, email, userName, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToDashboard, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings, onLogout }) {
  const [activeQueues, setActiveQueues] = useState([])
  const [userQueues, setUserQueues] = useState([])
  const [notifications, setNotifications] = useState([])
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set())
  const [stats, setStats] = useState({
    activeQueuesCount: 0,
    avgWaitTime: '5 min',
    totalServices: 6,
    userPosition: '---',
    userQueueCount: 0,
    completedQueues: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch active queues and user's queue history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch active queues from branch
        const activeResponse = await fetch('http://localhost:8080/api/v1/queues/active/branch/1')
        if (activeResponse.ok) {
          const apiResponse = await activeResponse.json()
          const queues = apiResponse.data || []
          setActiveQueues(queues)
          
          if (queues.length > 0) {
            const avgWait = Math.round(
              queues.reduce((sum, q) => sum + (q.estimatedWaitTime || 0), 0) / queues.length
            )
            setStats(prev => ({
              ...prev,
              activeQueuesCount: queues.length,
              avgWaitTime: `${avgWait} min`
            }))
          }
        }

        // Fetch user's personal queue history if userId exists
        if (userId) {
          console.log("Fetching queue history for user:", userId)
          const userResponse = await fetch(`http://localhost:8080/api/v1/queues/user/${userId}`)
          if (userResponse.ok) {
            const userApiResponse = await userResponse.json()
            const queues = userApiResponse.data || []
            console.log("User queues:", queues)
            setUserQueues(queues)
            
            // Calculate stats
            setStats(prev => ({
              ...prev,
              userQueueCount: queues.length,
              completedQueues: queues.filter(q => q.status === 'COMPLETED').length
            }))
          }

          // Fetch notifications for user
          const notifResponse = await fetch(`http://localhost:8080/api/v1/notification/user/${userId}`)
          if (notifResponse.ok) {
            const notifData = await notifResponse.json()
            const notifs = Array.isArray(notifData) ? notifData : (notifData.data || [])
            setNotifications(notifs)
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Fetch immediately and set up polling
    fetchData()
    const interval = setInterval(fetchData, 5000)
    
    return () => clearInterval(interval)
  }, [userId])

  const statsList = [
    { label: 'Active Queues', value: stats.activeQueuesCount, icon: '📊' },
    { label: 'Avg Wait Time', value: stats.avgWaitTime, icon: '⏱️' },
    { label: 'Total Services', value: stats.totalServices, icon: '🏢' },
    { label: 'Your Queues', value: stats.userQueueCount, icon: '📍' },
  ]

  const handleDismissNotification = (notificationId) => {
    setDismissedNotifications(new Set([...dismissedNotifications, notificationId]))
  }

  // Filter out dismissed and read notifications
  const visibleNotifications = notifications.filter(n => !dismissedNotifications.has(n.notificationId) && !n.isRead)

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        userName={userName}
        activePage="dashboard"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToJoinQueue={onNavigateToJoinQueue}
        onNavigateToTrackQueue={onNavigateToTrackQueue}
        onNavigateToNotifications={onNavigateToNotifications}
        onNavigateToAdminDashboard={onNavigateToAdminDashboard}
        onNavigateToPriorityQueue={onNavigateToPriorityQueue}
        onNavigateToSettings={onNavigateToSettings}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col overflow-hidden ml-64">
        <header className="bg-[#1a1f3a]/50 backdrop-blur-sm border-b border-[#2a3060] px-8 py-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Overview</h1>
              <p className="text-slate-400">Welcome back! {email && <span>({email})</span>} Here's your queue management dashboard. {loading && <span className="text-xs text-blue-400">Updating...</span>}</p>
            </div>
            <button className="relative p-3 rounded-xl bg-[#2a3060] hover:bg-[#3a4080] border border-[#3a4080] transition-all">
              <Bell size={22} className="text-slate-300" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
          <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Notifications Section */}
              {visibleNotifications.length > 0 && (
                <div className="space-y-3">
                  {visibleNotifications.map((notification) => (
                    <div key={notification.notificationId} className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/50 rounded-xl p-5 flex items-start justify-between gap-4 animate-pulse">
                      <div className="flex items-start gap-4 flex-1">
                        <AlertCircle size={24} className="text-blue-400 flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-bold text-white mb-1">{notification.title}</h3>
                          <p className="text-sm text-slate-200">{notification.message}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDismissNotification(notification.notificationId)}
                        className="flex-shrink-0 p-2 hover:bg-blue-600/30 rounded-lg transition-all"
                      >
                        <X size={18} className="text-blue-300" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statsList.map((stat, i) => (
                  <div key={i} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-[#1a1f3a] border border-[#2a3060] rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-3xl">{stat.icon}</span>
                        <TrendingUp size={18} className="text-green-400" />
                      </div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="relative bg-gradient-to-br from-[#1a2f4a] to-[#1a1f3a] border border-blue-500/20 rounded-2xl p-7">
                  <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 w-fit mb-6"><UserPlus size={24} className="text-blue-300" /></div>
                  <h3 className="text-xl font-bold mb-2">Join Queue</h3>
                  <p className="text-sm text-slate-400 mb-6">Add yourself to the waiting list and start tracking in real-time.</p>
                  <button onClick={onNavigateToJoinQueue} className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all">Get Started</button>
                </div>

                <div className="relative bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-7">
                  <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 w-fit mb-6"><MapPin size={24} className="text-purple-300" /></div>
                  <h3 className="text-xl font-bold mb-4">Track Queue</h3>
                  <div className="bg-[#0a0e27] rounded-xl p-4 border border-[#2a3060] mb-5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Token</p>
                    <p className="text-4xl font-black text-purple-400">A-142</p>
                  </div>
                  <div className="flex items-center justify-between mb-3"><p className="text-sm text-slate-400">Position</p><p className="text-sm font-bold text-slate-200">15 ahead</p></div>
                  <div className="w-full h-3 bg-[#0a0e27] rounded-full overflow-hidden border border-[#2a3060]"><div className="h-full w-2/3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div></div>
                  <button onClick={onNavigateToTrackQueue} className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all mt-4">View Details</button>
                </div>

                <div className="relative bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-7">
                  <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 w-fit mb-6"><Bell size={24} className="text-cyan-300" /></div>
                  <h3 className="text-xl font-bold mb-4">Notifications</h3>
                  <div className="space-y-3">
                    {['Your turn is coming soon','Queue delay updated','Counter 3 available'].map((t,i)=><div key={i} className="p-3 bg-[#0a0e27] border border-[#2a3060] rounded-lg"><p className="text-sm font-medium text-slate-200">{t}</p></div>)}
                  </div>
                </div>

                <div className="relative bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-7">
                  <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 w-fit mb-6"><Users size={24} className="text-green-300" /></div>
                  <h3 className="text-xl font-bold mb-4">Crowd Level</h3>
                  <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-xl p-5 border border-green-500/20 text-center mb-5">
                    <p className="text-3xl font-black text-green-400">Low</p>
                    <p className="text-xs text-slate-400">Optimal time to visit</p>
                  </div>
                  <div className="flex justify-between mb-2"><p className="text-xs font-semibold text-slate-400">Capacity</p><p className="text-sm font-bold text-slate-200">32%</p></div>
                  <div className="w-full h-2.5 bg-[#0a0e27] rounded-full overflow-hidden border border-[#2a3060]"><div className="h-full w-1/3 bg-green-500 rounded-full"></div></div>
                </div>

                <div className="relative bg-gradient-to-br from-[#3d2a1a] to-[#1a1f3a] border border-amber-500/20 rounded-2xl p-7">
                  <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30 w-fit mb-6"><Zap size={24} className="text-amber-300" /></div>
                  <h3 className="text-xl font-bold mb-4">Priority Queue</h3>
                  <div className="bg-amber-600/10 rounded-xl p-5 border border-amber-500/20 mb-5">
                    <p className="text-5xl font-black text-amber-400 mb-1">12</p>
                    <p className="text-sm text-amber-200/70">Special Access Users</p>
                  </div>
                  <div className="text-sm text-amber-200/60 space-y-2">
                    <p>• Elderly citizens</p>
                    <p>• Pregnant women</p>
                    <p>• Disabled persons</p>
                  </div>
                </div>
              </div>

              {/* Active Queues List Section */}
              <div className="relative bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-7">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">Active Queues (Downtown Branch)</h3>
                    <p className="text-sm text-slate-400 mt-1">{activeQueues.length} queues currently active</p>
                  </div>
                  <div className="animate-pulse">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                {activeQueues.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-400">No active queues at the moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                    {activeQueues.map((queue, index) => (
                      <div key={index} className="bg-gradient-to-br from-[#0a0e27] to-[#0f1535] border border-[#2a3060] rounded-xl p-5 hover:border-blue-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Token</p>
                            <p className="text-xl font-black text-white">{queue.token || '--'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-purple-400 uppercase">Position #{queue.position || '--'}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3 border-t border-[#2a3060] pt-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">Service:</p>
                            <p className="text-sm font-bold text-slate-200">{queue.serviceName || 'N/A'}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">Wait Time:</p>
                            <p className="text-sm font-bold text-green-400">{queue.estimatedWaitTime ? `${queue.estimatedWaitTime} min` : 'N/A'}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-400">Status:</p>
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold uppercase">
                              {queue.status || 'Waiting'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* User's Queue History Section */}
              {userId && (
                <div className="relative bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-7">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock size={24} className="text-cyan-400" />
                        <h3 className="text-2xl font-bold">Your Queue History</h3>
                      </div>
                      <p className="text-sm text-slate-400">{userQueues.length} queue{userQueues.length !== 1 ? 's' : ''} total</p>
                    </div>
                  </div>
                  
                  {userQueues.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No queue history yet. Join a queue to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {userQueues.map((queue, index) => (
                        <div key={index} className="bg-gradient-to-r from-[#0a0e27] to-[#0f1535] border border-[#2a3060] rounded-lg p-4 hover:border-purple-500/30 transition-all">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-purple-500/20 rounded-lg p-2">
                                <MapPin size={20} className="text-purple-400" />
                              </div>
                              <div>
                                <p className="font-bold text-white">{queue.token}</p>
                                <p className="text-xs text-slate-400">{queue.serviceName || 'Service'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded text-xs font-semibold uppercase ${
                                queue.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                                queue.status === 'WAITING' ? 'bg-blue-500/20 text-blue-400' :
                                queue.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                                'bg-slate-500/20 text-slate-400'
                              }`}>
                                {queue.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 text-xs pt-3 border-t border-[#2a3060]">
                            <div>
                              <p className="text-slate-400">Position</p>
                              <p className="font-bold text-white mt-1">#{queue.position || '--'}</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Wait Time</p>
                              <p className="font-bold text-green-400 mt-1">{queue.estimatedWaitTime || '--'} min</p>
                            </div>
                            <div>
                              <p className="text-slate-400">Joined</p>
                              <p className="font-bold text-cyan-400 mt-1">{queue.joinedTime ? new Date(queue.joinedTime).toLocaleDateString() : '--'}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
