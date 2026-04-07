import { useState } from 'react'
import {
  Search,
  LayoutDashboard,
  UserPlus,
  MapPin,
  Bell,
  Users,
  Shield,
  Zap,
  Settings,
  LogOut,
  Menu,
  X,
  ArrowRight,
  AlertCircle,
} from 'lucide-react'

export default function Sidebar({ 
  userName,
  activePage, 
  onNavigateToDashboard, 
  onNavigateToJoinQueue, 
  onNavigateToTrackQueue,

  onNavigateToNotifications,
  onNavigateToAdminDashboard,
  onNavigateToPriorityQueue,
  onNavigateToSettings,
  onLogout
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, page: 'dashboard' },
    { name: 'Join Queue', icon: UserPlus, page: 'joinQueue' },
    { name: 'Track Queue', icon: MapPin, page: 'trackQueue' },
    { name: 'Notifications', icon: Bell, page: 'notifications' },

    { name: 'Admin Dashboard', icon: Shield, page: 'admin' },
    { name: 'Priority Queue', icon: Zap, page: 'priorityQueue' },
    { name: 'Settings', icon: Settings, page: 'settings' },
  ]

  const handleMenuClick = (page) => {
    if (page === 'dashboard') {
      onNavigateToDashboard()
    } else if (page === 'joinQueue') {
      onNavigateToJoinQueue()
    } else if (page === 'trackQueue') {
      onNavigateToTrackQueue()

    } else if (page === 'notifications') {
      onNavigateToNotifications()
    } else if (page === 'admin') {
      onNavigateToAdminDashboard()
    } else if (page === 'priorityQueue') {
      onNavigateToPriorityQueue()
    } else if (page === 'settings') {
      onNavigateToSettings()
    }
  }

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true)
  }

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 ease-out bg-[#1a1f3a] border-r border-[#2a3060] flex flex-col h-screen fixed left-0 top-0 z-50 overflow-hidden`}
      >
        <div className="p-6 border-b border-[#2a3060]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                QueueSmart
              </h1>
              <p className="text-xs text-slate-500 mt-2">Smart Management</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-[#2a3060] rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-[#2a3060]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#0a0e27] border border-[#2a3060] text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.page
            return (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300 shadow-lg shadow-blue-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-[#2a3060]/50 border border-transparent'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium flex-1">{item.name}</span>
                {isActive && <ArrowRight size={16} />}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#2a3060] bg-[#0a0e27]/50">
          <div className="flex items-center gap-3 p-3 bg-[#1a1f3a] rounded-lg border border-[#2a3060]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {userName ? userName.substring(0, 2).toUpperCase() : 'GU'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{userName || 'Guest'}</p>
              <p className="text-xs text-slate-500">User</p>
            </div>
          </div>
          <button onClick={handleLogoutClick} className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600/10 hover:bg-red-600/20 text-red-400 transition-all border border-red-500/20 hover:border-red-500/40 font-medium text-sm">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Menu Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute top-6 left-6 z-40 p-2 bg-[#1a1f3a] border border-[#2a3060] rounded-lg hover:bg-[#2a3060] transition-colors"
        >
          <Menu size={20} className="text-slate-300" />
        </button>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-lg shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <AlertCircle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Confirm Logout</h3>
                  <p className="text-sm text-slate-400">Are you sure?</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-6">You will be logged out from your account. Are you sure you want to continue?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-white transition-all border border-slate-600/30 hover:border-slate-600/50 font-medium text-sm"
                >
                  Cancel (Stay)
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-red-600/30 hover:bg-red-600/50 text-red-400 hover:text-red-300 transition-all border border-red-500/30 hover:border-red-500/50 font-medium text-sm"
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
