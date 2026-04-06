import { useState } from 'react'
import { Zap, Star, Clock, Users, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import Sidebar from './Sidebar'

export default function PriorityQueue({ userName, ...otherProps }) {
  const { onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings, onLogout } = otherProps;
  const [priorityUsers] = useState([
    { id: 1, token: 'VIP-001', name: 'Rajesh Kumar', service: 'Banking', branch: 'Downtown', priority: 'Gold', position: 1, status: 'Being Served', waitTime: '2 min' },
    { id: 2, token: 'VIP-002', name: 'Priya Sharma', service: 'Customer Service', branch: 'Downtown', priority: 'Platinum', position: 2, status: 'Waiting', waitTime: '8 min' },
    { id: 3, token: 'VIP-003', name: 'Amit Patel', service: 'Document Verification', branch: 'City Center', priority: 'Gold', position: 3, status: 'Waiting', waitTime: '15 min' },
    { id: 4, token: 'VIP-004', name: 'Neha Singh', service: 'Bill Payment', branch: 'Airport Plaza', priority: 'Silver', position: 4, status: 'Waiting', waitTime: '22 min' },
    { id: 5, token: 'VIP-005', name: 'Vikram Desai', service: 'Mobile Recharge', branch: 'Downtown', priority: 'Gold', position: 5, status: 'Waiting', waitTime: '28 min' },
  ])

  const [priorityTiers] = useState([
    { tier: 'Platinum', benefits: 'Skip 10 ahead + Free service + Priority support', badge: '💎', color: 'from-blue-600/10 to-purple-600/10 border-purple-500/20', icon: '💜', activeUsers: 12 },
    { tier: 'Gold', benefits: 'Skip 5 ahead + Express service + Email support', badge: '⭐', color: 'from-amber-600/10 to-yellow-600/10 border-amber-500/20', icon: '💛', activeUsers: 48 },
    { tier: 'Silver', benefits: 'Skip 2 ahead + Standard service + Chat support', badge: '✨', color: 'from-slate-600/10 to-gray-600/10 border-slate-500/20', icon: '🩶', activeUsers: 156 },
  ])

  const [stats] = useState({
    totalPriorityUsers: 216,
    activeInQueues: 23,
    avgWaitPriority: '12 min',
    avgWaitRegular: '20 min',
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Platinum':
        return 'bg-purple-600/20 border-purple-500/30 text-purple-300'
      case 'Gold':
        return 'bg-amber-600/20 border-amber-500/30 text-amber-300'
      case 'Silver':
        return 'bg-slate-600/20 border-slate-500/30 text-slate-300'
      default:
        return 'bg-slate-600/20 border-slate-500/30 text-slate-300'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Being Served':
        return 'text-green-400'
      case 'Waiting':
        return 'text-blue-400'
      default:
        return 'text-slate-400'
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="priorityQueue"
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
              <h1 className="text-3xl font-bold text-white">Priority Queue</h1>
              <p className="text-slate-400 text-sm">Premium service access and VIP management</p>
            </div>
            <button className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 rounded-lg transition-all flex items-center gap-2">
              <Star size={18} />
              Upgrade User
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Priority Users', value: stats.totalPriorityUsers, icon: '👑', color: 'from-purple-600/10 to-purple-600/10' },
                { label: 'Active in Queues', value: stats.activeInQueues, icon: '📍', color: 'from-blue-600/10 to-blue-600/10' },
                { label: 'Avg Wait (Priority)', value: stats.avgWaitPriority, icon: '⏱️', color: 'from-green-600/10 to-green-600/10' },
                { label: 'Avg Wait (Regular)', value: stats.avgWaitRegular, icon: '⏳', color: 'from-amber-600/10 to-amber-600/10' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-br ${stat.color} border border-[#2a3060] rounded-xl p-4`}>
                  <p className="text-2xl mb-2">{stat.icon}</p>
                  <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Priority Tiers */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Star size={24} className="text-purple-400" />
                Priority Tiers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {priorityTiers.map((tier) => (
                  <div key={tier.tier} className={`bg-gradient-to-br ${tier.color} border rounded-2xl p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <p className="text-3xl">{tier.badge}</p>
                        <h3 className="text-xl font-bold text-white">{tier.tier}</h3>
                      </div>
                      <span className="text-2xl">{tier.icon}</span>
                    </div>
                    <div className="space-y-4 border-t border-[#2a3060] pt-4">
                      <div>
                        <p className="text-sm text-slate-400 mb-2">Benefits:</p>
                        <p className="text-sm font-medium text-slate-200">{tier.benefits}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Active Members</p>
                        <p className="text-2xl font-bold text-white">{tier.activeUsers}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Priority Queue */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Zap size={24} className="text-amber-400" />
                  Active Priority Queue
                </h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg text-sm font-medium">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Live Services
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#2a3060]">
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Token</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Service</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Branch</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Priority</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Position</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-semibold">Wait Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priorityUsers.map((user, idx) => (
                      <tr key={user.id} className={`border-b border-[#2a3060] hover:bg-[#1a1f3a]/50 transition-all ${idx === 0 ? 'bg-green-600/10' : ''}`}>
                        <td className="py-3 px-4 font-bold text-purple-400">{user.token}</td>
                        <td className="py-3 px-4 text-white font-medium">{user.name}</td>
                        <td className="py-3 px-4 text-slate-300">{user.service}</td>
                        <td className="py-3 px-4 text-slate-300">{user.branch}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 border rounded-lg text-xs font-semibold ${getPriorityColor(user.priority)}`}>
                            {user.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-bold">#{user.position}</td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center gap-1 font-semibold ${getStatusColor(user.status)}`}>
                            {user.status === 'Being Served' ? <CheckCircle size={16} /> : <Clock size={16} />}
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{user.waitTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Benefits Overview */}
            <div className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp size={24} className="text-purple-400" />
                Priority Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-[#1a1f3a] rounded-xl border border-purple-500/20">
                  <p className="text-lg font-bold text-purple-300 mb-2">⚡ Faster Service</p>
                  <p className="text-sm text-slate-300">Skip multiple positions in queue, dramatically reducing wait time</p>
                </div>
                <div className="p-4 bg-[#1a1f3a] rounded-xl border border-purple-500/20">
                  <p className="text-lg font-bold text-purple-300 mb-2">🎯 Dedicated Support</p>
                  <p className="text-sm text-slate-300">Get priority handling from expert staff members</p>
                </div>
                <div className="p-4 bg-[#1a1f3a] rounded-xl border border-purple-500/20">
                  <p className="text-lg font-bold text-purple-300 mb-2">🏆 Exclusive Perks</p>
                  <p className="text-sm text-slate-300">Access VIP lounge and special amenities</p>
                </div>
                <div className="p-4 bg-[#1a1f3a] rounded-xl border border-purple-500/20">
                  <p className="text-lg font-bold text-purple-300 mb-2">📞 24/7 Assistance</p>
                  <p className="text-sm text-slate-300">Round-the-clock support channel for priority members</p>
                </div>
                <div className="p-4 bg-[#1a1f3a] rounded-xl border border-purple-500/20">
                  <p className="text-lg font-bold text-purple-300 mb-2">💰 Discounts</p>
                  <p className="text-sm text-slate-300">Enjoy special rates on services and transactions</p>
                </div>
                <div className="p-4 bg-[#1a1f3a] rounded-xl border border-purple-500/20">
                  <p className="text-lg font-bold text-purple-300 mb-2">🎁 Rewards</p>
                  <p className="text-sm text-slate-300">Earn points on every service and redeem rewards</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
