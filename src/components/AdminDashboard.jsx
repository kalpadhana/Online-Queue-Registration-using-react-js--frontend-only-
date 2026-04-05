import { useState, useEffect } from 'react'
import { BarChart3, Users, TrendingUp, AlertTriangle, Settings, Download, RefreshCw, Eye, EyeOff } from 'lucide-react'
import Sidebar from './Sidebar'

export default function AdminDashboard({ userName, ...otherProps }) {
  const { onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings, onLogout } = otherProps;
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeQueues: 0,
    totalServices: 0,
    avgWaitTime: '0 min',
    todayTransactions: 0,
    peakHourCrowth: '+0%',
  })

  const [queueStats, setQueueStats] = useState([])
  const [userManagement, setUserManagement] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch all admin data
  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [usersRes, servicesRes, branchesRes, queuesRes, staffRes] = await Promise.all([
        fetch('http://localhost:8080/api/v1/user'),
        fetch('http://localhost:8080/api/v1/service'),
        fetch('http://localhost:8080/api/v1/branches'),
        fetch('http://localhost:8080/api/v1/queues'),
        fetch('http://localhost:8080/api/v1/admin-staff')
      ])

      const users = usersRes.ok ? (await usersRes.json()).data || [] : []
      const services = servicesRes.ok ? (await servicesRes.json()).data || [] : []
      const branches = branchesRes.ok ? (await branchesRes.json()).data || [] : []
      const queues = queuesRes.ok ? (await queuesRes.json()).data || [] : []
      const staff = staffRes.ok ? (await staffRes.json()).data || [] : []

      // Calculate stats
      const totalUsers = users.length
      const activeQueues = queues.filter(q => q.status === 'WAITING')?.length || 0
      const totalServices = services.length
      
      // Calculate average wait time
      let totalWaitTime = 0
      let waitingQueuesCount = 0
      queues.forEach(q => {
        if (q.status === 'WAITING') {
          const waitTime = parseInt(q.estimatedWaitTime) || 0
          totalWaitTime += waitTime
          waitingQueuesCount++
        }
      })
      const avgWaitTime = waitingQueuesCount > 0 
        ? Math.round(totalWaitTime / waitingQueuesCount) + ' min'
        : '0 min'

      // Calculate today's transactions (completed queues)
      const todayTransactions = queues.filter(q => q.status === 'COMPLETED')?.length || 0

      setStats({
        totalUsers,
        activeQueues,
        totalServices,
        avgWaitTime,
        todayTransactions,
        peakHourCrowth: '+' + Math.floor(Math.random() * 30) + '%',
      })

      // Process queue stats by service and branch
      const queueByService = {}
      queues.forEach(queue => {
        const key = `${queue.service?.id}-${queue.branch?.id}`
        if (!queueByService[key]) {
          queueByService[key] = {
            id: queue.service?.id || Math.random(),
            service: queue.service?.name || 'Unknown',
            branch: queue.branch?.name || 'Unknown',
            active: 0,
            waiting: 0,
            served: 0,
            avgTime: '0 min'
          }
        }
        if (queue.status === 'WAITING') {
          queueByService[key].active++
          queueByService[key].waiting++
        } else if (queue.status === 'COMPLETED') {
          queueByService[key].served++
        }
      })

      setQueueStats(Object.values(queueByService))

      // Process staff management
      const staffList = staff.map(s => ({
        id: s.id,
        name: s.name || s.fullName || 'Staff Member',
        role: s.role || 'Operator',
        branch: s.branch?.name || 'Not Assigned',
        status: Math.random() > 0.3 ? 'Active' : 'Offline'
      }))

      setUserManagement(staffList.slice(0, 4))

    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchAdminData()
  }

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="admin"
        userName={userName}
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
        {/* Header */}
        <header className="bg-[#1a1f3a]/50 backdrop-blur-sm border-b border-[#2a3060] px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">System management and queue operations</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleRefresh} disabled={loading} className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50">
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all flex items-center gap-2">
                <Download size={18} />
                Export Report
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw size={48} className="text-blue-400 mx-auto mb-4 animate-spin" />
                <p className="text-slate-300">Loading admin dashboard...</p>
              </div>
            </div>
          ) : (
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            
            {/* Key Stats */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 size={24} className="text-blue-400" />
                System Overview
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-blue-600/10 to-blue-600/10' },
                  { label: 'Active Queues', value: stats.activeQueues, icon: '📊', color: 'from-green-600/10 to-green-600/10' },
                  { label: 'Total Services', value: stats.totalServices, icon: '🏢', color: 'from-purple-600/10 to-purple-600/10' },
                  { label: 'Avg Wait Time', value: stats.avgWaitTime, icon: '⏱️', color: 'from-amber-600/10 to-amber-600/10' },
                  { label: 'Today\'s Trans.', value: stats.todayTransactions, icon: '💳', color: 'from-pink-600/10 to-pink-600/10' },
                  { label: 'Peak Hour', value: stats.peakHourCrowth, icon: '📈', color: 'from-red-600/10 to-red-600/10' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-br ${stat.color} border border-[#2a3060] rounded-xl p-4`}>
                    <p className="text-2xl mb-2">{stat.icon}</p>
                    <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Queue Services Performance */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <TrendingUp size={24} className="text-green-400" />
                  Service Performance
                </h2>
                <button onClick={handleRefresh} disabled={loading} className="p-2 hover:bg-[#2a3060] rounded-lg transition-all disabled:opacity-50">
                  <RefreshCw size={18} className={`text-slate-400 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="overflow-x-auto">
                {queueStats.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a3060]">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Service</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Branch</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Active</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Waiting</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Served Today</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-400">Avg Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queueStats.map((queue) => (
                      <tr key={queue.id} className="border-b border-[#2a3060] hover:bg-[#1a1f3a]/50 transition-all">
                        <td className="py-3 px-4 text-white font-medium">{queue.service}</td>
                        <td className="py-3 px-4 text-slate-300">{queue.branch}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-lg text-sm">
                            {queue.active}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-amber-600/20 border border-amber-500/30 text-amber-300 rounded-lg text-sm">
                            {queue.waiting}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-semibold">{queue.served}</td>
                        <td className="py-3 px-4 text-slate-300">{queue.avgTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p>No queue data available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Staff Management */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users size={24} className="text-purple-400" />
                  Staff Management
                </h2>
                <button className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 rounded-lg transition-all text-sm font-medium">
                  + Add Staff
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userManagement.length > 0 ? (
                  <>
                {userManagement.map((user) => (
                  <div key={user.id} className="bg-[#1a1f3a] border border-[#2a3060] rounded-xl p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {user.name.split(' ').map((n, i) => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{user.name}</h3>
                          <p className="text-xs text-slate-500">{user.role}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${
                        user.status === 'Active'
                          ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                          : 'bg-slate-600/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">📍 {user.branch}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 px-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all text-sm font-medium">
                        Edit
                      </button>
                      <button className="py-2 px-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg transition-all text-sm font-medium">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                  </>
                ) : (
                  <div className="col-span-full text-center py-8 text-slate-400">
                    <p>No staff members available</p>
                  </div>
                )}
              </div>
            </div>

            {/* System Alerts */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle size={24} className="text-amber-400" />
                System Alerts
              </h2>
              <div className="space-y-3">
                <div className="bg-red-600/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-red-300">High Queue Congestion</p>
                    <p className="text-sm text-slate-400">City Center branch is experiencing 85% capacity</p>
                  </div>
                </div>
                <div className="bg-amber-600/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-amber-300">Staff Shortage</p>
                    <p className="text-sm text-slate-400">Need additional staff at Airport Plaza branch</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          )}
        </div>
      </main>
    </div>
  )
}
