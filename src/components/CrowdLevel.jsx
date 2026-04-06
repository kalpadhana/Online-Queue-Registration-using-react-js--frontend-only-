import { useState } from 'react'
import { TrendingUp, MapPin, Users, AlertCircle, TrendingDown, Clock } from 'lucide-react'
import Sidebar from './Sidebar'

export default function CrowdLevel({ userName, onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToCrowdLevel, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings, onLogout }) {
  const [crowdData] = useState([
    { id: 1, branch: 'Downtown Branch', level: 'Low', percentage: 32, icon: '📍', services: 5, avgWait: '15 min', trend: 'down' },
    { id: 2, branch: 'Airport Plaza', level: 'Medium', percentage: 62, icon: '✈️', services: 8, avgWait: '25 min', trend: 'up' },
    { id: 3, branch: 'City Center', level: 'High', percentage: 85, icon: '🏙️', services: 6, avgWait: '45 min', trend: 'up' },
    { id: 4, branch: 'Mall Location', level: 'Medium', percentage: 58, icon: '🛍️', services: 7, avgWait: '22 min', trend: 'stable' },
    { id: 5, branch: 'North Branch', level: 'Low', percentage: 28, icon: '🏢', services: 4, avgWait: '12 min', trend: 'down' },
  ])

  const peakTimes = [
    { time: '9:00 AM - 11:00 AM', label: 'Morning Peak', level: 'High', percentage: 90 },
    { time: '12:00 PM - 1:00 PM', label: 'Lunch Rush', level: 'High', percentage: 88 },
    { time: '3:00 PM - 4:00 PM', label: 'Afternoon', level: 'Medium', percentage: 65 },
    { time: '6:00 PM - 7:00 PM', label: 'Evening Peak', level: 'Medium', percentage: 70 },
  ]

  const getLevelColor = (level) => {
    switch (level) {
      case 'Low':
        return 'from-green-600/10 to-emerald-600/10 border-green-500/20'
      case 'Medium':
        return 'from-amber-600/10 to-orange-600/10 border-amber-500/20'
      case 'High':
        return 'from-red-600/10 to-rose-600/10 border-red-500/20'
      default:
        return 'from-slate-600/10 to-slate-600/10 border-slate-500/20'
    }
  }

  const getLevelTextColor = (level) => {
    switch (level) {
      case 'Low':
        return 'text-green-400'
      case 'Medium':
        return 'text-amber-400'
      case 'High':
        return 'text-red-400'
      default:
        return 'text-slate-400'
    }
  }

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={16} className="text-red-400" />
    if (trend === 'down') return <TrendingDown size={16} className="text-green-400" />
    return <Clock size={16} className="text-slate-400" />
  }

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="crowdLevel"
        userName={userName}
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToJoinQueue={onNavigateToJoinQueue}
        onNavigateToTrackQueue={onNavigateToTrackQueue}
        onNavigateToCrowdLevel={onNavigateToCrowdLevel}
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
              <h1 className="text-3xl font-bold text-white">Crowd Level</h1>
              <p className="text-slate-400 text-sm">Real-time capacity status across all branches</p>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-sm">
                <p className="text-green-400 font-semibold">Low Activity</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
            
            {/* Branches Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <MapPin size={24} className="text-blue-400" />
                Branch Status
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {crowdData.map((branch) => (
                  <div
                    key={branch.id}
                    className={`bg-gradient-to-br ${getLevelColor(branch.level)} rounded-2xl p-6 border`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-3xl mb-2">{branch.icon}</p>
                        <h3 className="text-lg font-bold text-white">{branch.branch}</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(branch.trend)}
                        <span className={`text-sm font-semibold ${getLevelTextColor(branch.level)}`}>
                          {branch.level}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Capacity</p>
                        <p className="text-sm font-bold text-slate-200">{branch.percentage}%</p>
                      </div>
                      <div className="w-full h-2 bg-[#0a0e27] rounded-full overflow-hidden border border-[#2a3060]">
                        <div
                          className={`h-full ${
                            branch.level === 'Low'
                              ? 'bg-green-500'
                              : branch.level === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-red-500'
                          } rounded-full`}
                          style={{ width: `${branch.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#2a3060]">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Services</p>
                        <p className="text-lg font-bold text-white">{branch.services}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Avg Wait</p>
                        <p className="text-lg font-bold text-slate-300">{branch.avgWait}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Times */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Clock size={24} className="text-amber-400" />
                Peak Hours
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {peakTimes.map((peak, idx) => (
                  <div key={idx} className="bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">{peak.time}</p>
                        <h3 className="text-lg font-bold text-white">{peak.label}</h3>
                      </div>
                      <span className={`text-sm font-semibold px-3 py-1 rounded-lg ${
                        peak.level === 'High' 
                          ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {peak.level}
                      </span>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-slate-400">Estimated Crowd</p>
                        <p className="text-sm font-bold text-slate-200">{peak.percentage}%</p>
                      </div>
                      <div className="w-full h-3 bg-[#0a0e27] rounded-full overflow-hidden border border-[#2a3060]">
                        <div
                          className={`h-full ${peak.level === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}
                          style={{ width: `${peak.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <AlertCircle size={24} className="text-blue-400" />
                Smart Recommendations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-[#1a1f3a] rounded-xl border border-blue-500/20">
                  <p className="text-sm text-blue-300 mb-2">✓ Best Time to Visit</p>
                  <p className="font-bold text-white">North Branch - 10:30 AM</p>
                  <p className="text-xs text-slate-400 mt-2">Currently lowest crowd level</p>
                </div>
                <div className="p-4 bg-[#1a1f3a] rounded-xl border border-purple-500/20">
                  <p className="text-sm text-purple-300 mb-2">⚡ Alternative Location</p>
                  <p className="font-bold text-white">Downtown Branch - Anytime</p>
                  <p className="text-xs text-slate-400 mt-2">Consistent low crowd</p>
                </div>
                <div className="p-4 bg-[#1a1f3a] rounded-xl border border-green-500/20">
                  <p className="text-sm text-green-300 mb-2">✓ Shortest Wait</p>
                  <p className="font-bold text-white">North Branch - 15 min avg</p>
                  <p className="text-xs text-slate-400 mt-2">Fastest service available</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
