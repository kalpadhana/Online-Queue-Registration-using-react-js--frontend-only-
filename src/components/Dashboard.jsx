import {
  Bell,
  TrendingUp,
  UserPlus,
  MapPin,
  Users,
  Shield,
  Zap,
} from 'lucide-react'
import Sidebar from './Sidebar'

export default function Dashboard({ onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToDashboard, onNavigateToCrowdLevel, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings }) {

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="dashboard"
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
        <header className="bg-[#1a1f3a]/50 backdrop-blur-sm border-b border-[#2a3060] px-8 py-6">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Overview</h1>
              <p className="text-slate-400">Welcome back! Here's your queue management dashboard.</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Active Queues', value: '4', icon: '📊' },
                  { label: 'Avg Wait Time', value: '15 min', icon: '⏱️' },
                  { label: 'Total Services', value: '5', icon: '🏢' },
                  { label: 'Your Position', value: '5th', icon: '📍' },
                ].map((stat, i) => (
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
