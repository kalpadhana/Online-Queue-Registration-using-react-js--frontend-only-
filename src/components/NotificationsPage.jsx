import { useState } from 'react'
import { Bell, Trash2, Filter, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react'
import Sidebar from './Sidebar'

export default function NotificationsPage({ onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToCrowdLevel, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings }) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'success', title: 'Your Turn Coming Soon', message: 'You are next in queue at Downtown Branch. Be ready!', time: '5 minutes ago', read: false },
    { id: 2, type: 'warning', title: 'Queue Delay Updated', message: 'Expected 5-minute delay at City Center due to high traffic.', time: '15 minutes ago', read: false },
    { id: 3, type: 'info', title: 'Counter 2 Available', message: 'A new service counter is now open at Airport Plaza.', time: '25 minutes ago', read: true },
    { id: 4, type: 'info', title: 'Service Status Update', message: 'Mobile Recharge service is now available with 3-minute average wait.', time: '1 hour ago', read: true },
    { id: 5, type: 'warning', title: 'High Crowd Level', message: 'City Center branch is experiencing high crowd. Consider visiting Downtown Branch.', time: '2 hours ago', read: true },
    { id: 6, type: 'success', title: 'Token Processed', message: 'Your token Q-1234 has been successfully processed.', time: '3 hours ago', read: true },
    { id: 7, type: 'info', title: 'Maintenance Alert', message: 'Scheduled maintenance at North Branch from 10 PM - 6 AM tonight.', time: '5 hours ago', read: true },
    { id: 8, type: 'warning', title: 'Wait Time Increased', message: 'Estimated wait time at Mall Location increased to 30 minutes.', time: '6 hours ago', read: true },
  ])

  const [filter, setFilter] = useState('all')

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-400" />
      case 'warning':
        return <AlertCircle size={20} className="text-amber-400" />
      case 'info':
        return <Info size={20} className="text-blue-400" />
      default:
        return <Bell size={20} className="text-slate-400" />
    }
  }

  const getNotificationBg = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-600/10 border-green-500/20'
      case 'warning':
        return 'bg-amber-600/10 border-amber-500/20'
      case 'info':
        return 'bg-blue-600/10 border-blue-500/20'
      default:
        return 'bg-slate-600/10 border-slate-500/20'
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notif.read
    return notif.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="notifications"
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
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 rounded-full text-sm font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm">Stay updated with queue and service information</p>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all text-sm font-medium">
                  Mark all as read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg transition-all text-sm font-medium">
                  Clear all
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
          <div className="max-w-4xl mx-auto px-6 py-8">
            
            {/* Filter Tabs */}
            <div className="flex gap-3 mb-8 pb-4 border-b border-[#2a3060]">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                    : 'bg-[#1a1f3a] border border-[#2a3060] text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  filter === 'unread'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                    : 'bg-[#1a1f3a] border border-[#2a3060] text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => setFilter('success')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'success'
                    ? 'bg-green-600/20 border border-green-500/30 text-green-300'
                    : 'bg-[#1a1f3a] border border-[#2a3060] text-slate-400 hover:text-white'
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setFilter('warning')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'warning'
                    ? 'bg-amber-600/20 border border-amber-500/30 text-amber-300'
                    : 'bg-[#1a1f3a] border border-[#2a3060] text-slate-400 hover:text-white'
                }`}
              >
                Alerts
              </button>
              <button
                onClick={() => setFilter('info')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === 'info'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                    : 'bg-[#1a1f3a] border border-[#2a3060] text-slate-400 hover:text-white'
                }`}
              >
                Info
              </button>
            </div>

            {/* Notifications List */}
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`${getNotificationBg(notif.type)} border rounded-2xl p-5 transition-all cursor-pointer hover:border-opacity-100 ${
                      !notif.read ? 'ring-2 ring-offset-2 ring-offset-[#0a0e27] ring-blue-500/30' : ''
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 pt-1">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className="font-bold text-white mb-1">{notif.title}</h3>
                            <p className="text-sm text-slate-300">{notif.message}</p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-2"></div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock size={12} />
                            {notif.time}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notif.id)
                            }}
                            className="p-1.5 hover:bg-red-600/20 rounded-lg transition-all text-slate-400 hover:text-red-400"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Bell size={48} className="mx-auto text-slate-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-400 mb-2">No notifications</h3>
                <p className="text-slate-500">
                  {filter === 'all' 
                    ? 'You\'re all caught up!' 
                    : `No ${filter} notifications to show`}
                </p>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
}
