import { useState } from 'react'
import { Clock, AlertCircle, Bell, TrendingUp, Zap, RefreshCw, MapPin } from 'lucide-react'
import Sidebar from './Sidebar'

export default function TrackQueue({ onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToCrowdLevel, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings }) {
  const [queueData] = useState({
    token: 'Q-1234',
    service: 'Customer Service',
    location: 'Downtown Branch',
    position: 7,
    totalInQueue: 14,
    estimatedWaitTime: 'About 12 minutes',
    status: 'waiting',
    joinedTime: '2:45 PM',
    currentServing: 'Q-1230',
  })

  const notifications = [
    { id: 1, message: 'Your turn is coming up! Be ready.', time: '5 min ago', type: 'warning' },
    { id: 2, message: 'Counter 2 is now available', time: '2 min ago', type: 'info' },
    { id: 3, message: 'Queue delay: +5 minutes', time: '10 min ago', type: 'alert' },
  ]

  const upcomingTokens = ['Q-1231', 'Q-1232', 'Q-1233', 'Q-1234', 'Q-1235']

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return 'text-blue-400'
      case 'called':
        return 'text-green-400'
      case 'locked':
        return 'text-red-400'
      default:
        return 'text-slate-400'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-600/20 border-blue-500/30'
      case 'called':
        return 'bg-green-600/20 border-green-500/30'
      case 'locked':
        return 'bg-red-600/20 border-red-500/30'
      default:
        return 'bg-slate-600/20 border-slate-500/30'
    }
  }

  const progress = ((queueData.totalInQueue - queueData.position) / queueData.totalInQueue) * 100

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="trackQueue"
        onNavigateToDashboard={onNavigateToDashboard}
        onNavigateToJoinQueue={onNavigateToJoinQueue}
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
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
              <h1 className="text-3xl font-bold text-white">Track Queue</h1>
              <p className="text-slate-400 text-sm">Monitor your position in real-time</p>
            </div>
          </div>
          <button className="p-3 rounded-xl bg-[#2a3060] hover:bg-[#3a4080] border border-[#3a4080] transition-all text-slate-300 hover:text-white">
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Tracking */}
            <div className="lg:col-span-2 space-y-6">
              {/* Token Card */}
              <div className="bg-gradient-to-br from-[#1a2f4a] to-[#1a1f3a] border border-blue-500/20 rounded-2xl p-8">
                <p className="text-slate-400 text-sm mb-2">Your Token</p>
                <p className="text-7xl font-black text-blue-400 mb-4 font-mono">{queueData.token}</p>
                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Service</p>
                    <p className="text-white font-semibold">{queueData.service}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="text-white font-semibold flex items-center gap-1">
                      <MapPin size={16} className="text-blue-400" />
                      {queueData.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Position Status */}
              <div className={`border-2 rounded-2xl p-8 ${getStatusBg(queueData.status)}`}>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Your Position</p>
                    <p className={`text-5xl font-black ${getStatusColor(queueData.status)}`}>
                      #{queueData.position}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Estimated Wait</p>
                    <div className="flex items-center gap-2">
                      <Clock size={20} className="text-amber-400" />
                      <p className="text-2xl font-bold text-white">{queueData.estimatedWaitTime}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Progress</p>
                    <div className="relative pt-2">
                      <div className="w-full h-2 bg-[#0a0e27] rounded-full overflow-hidden border border-[#2a3060]">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{Math.round(progress)}% done</p>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-slate-400">
                  Currently serving: <span className="font-bold text-white">{queueData.currentServing}</span>
                </p>
              </div>

              {/* Upcoming Tokens */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap size={24} className="text-amber-400" />
                  Upcoming Tokens
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {upcomingTokens.map((token, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border text-center transition-all ${
                        token === queueData.token
                          ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/20'
                          : 'bg-[#1a1f3a] border-[#2a3060] hover:border-slate-500/50'
                      }`}
                    >
                      <p className="text-xs text-slate-500 mb-1">Queue</p>
                      <p className={`font-bold font-mono ${token === queueData.token ? 'text-blue-400 text-lg' : 'text-white'}`}>
                        {token}
                      </p>
                      {token === queueData.token && (
                        <p className="text-xs text-blue-400 mt-1">← You</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Timeline</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-600/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-green-400" />
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="font-semibold text-white">Joined Queue</p>
                      <p className="text-sm text-slate-400">{queueData.joinedTime} - Downtown Branch</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                      <TrendingUp size={20} className="text-blue-400" />
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="font-semibold text-white">Currently Waiting</p>
                      <p className="text-sm text-slate-400">7 positions ahead • Estimated 12 min wait</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Statistics */}
              <div className="bg-[#1a1f3a]/70 backdrop-blur-xl border border-[#2a3060] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6">Queue Stats</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Total in Queue</p>
                    <p className="text-3xl font-bold text-white">{queueData.totalInQueue}</p>
                  </div>
                  <div className="p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Ahead of You</p>
                    <p className="text-3xl font-bold text-blue-400">{queueData.position - 1}</p>
                  </div>
                  <div className="p-4 bg-[#0a0e27] rounded-lg border border-[#2a3060]">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Avg Service Time</p>
                    <p className="text-2xl font-bold text-emerald-400">2-3 min</p>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-[#1a1f3a]/70 backdrop-blur-xl border border-[#2a3060] rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Bell size={20} className="text-blue-400" />
                  Notifications
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border ${
                        notif.type === 'warning'
                          ? 'bg-amber-600/10 border-amber-500/20'
                          : notif.type === 'info'
                          ? 'bg-blue-600/10 border-blue-500/20'
                          : 'bg-red-600/10 border-red-500/20'
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-300">{notif.message}</p>
                      <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Pro Tips</h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Keep your phone with you for notifications</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Don't close this window during your wait</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-400">✓</span>
                    <span>Be ready when your token is called</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all">
                  Enable Notifications
                </button>
                <button className="w-full py-3 px-4 bg-[#1a1f3a] border border-[#2a3060] rounded-xl font-bold text-slate-300 hover:bg-[#2a3060] transition-all">
                  Exit Queue
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
