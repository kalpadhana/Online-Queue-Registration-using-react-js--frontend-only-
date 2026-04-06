import { useState, useEffect } from 'react'
import { Clock, AlertCircle, Bell, TrendingUp, Zap, RefreshCw, MapPin } from 'lucide-react'
import Sidebar from './Sidebar'

export default function TrackQueue({ userName, email, userId, queueToken, onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings, onLogout }) {
  
  const [queueData, setQueueData] = useState({
    token: '--',
    service: 'Loading...',
    location: 'Loading...',
    position: 0,
    totalInQueue: 0,
    estimatedWaitTime: '--',
    status: 'waiting',
    joinedTime: '--',
    currentServing: '--',
  })
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upcomingTokens, setUpcomingTokens] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userNotifications, setUserNotifications] = useState([]);
  const [pollInterval, setPollInterval] = useState(null);

  const fetchQueueData = async () => {
    setIsLoading(true);
    setError(null);
    setQueueData({
      token: '--',
      service: 'Loading...',
      location: 'Loading...',
      position: 0,
      totalInQueue: 0,
      estimatedWaitTime: '--',
      status: 'waiting',
      joinedTime: '--',
      currentServing: '--',
    });
    
    try {
      // Use userId endpoint to get current user's active queue
      const loggedInUserId = userId || 1;
      console.log("Fetching queue data for user ID:", loggedInUserId);
      const response = await fetch(`http://localhost:8080/api/v1/queues/user/${loggedInUserId}`);
      
      if (response.status === 404) {
        console.log("No active queue found for user:", loggedInUserId);
        setQueueData({
          token: '--',
          service: 'No Queue',
          location: '--',
          position: '--',
          totalInQueue: '--',
          estimatedWaitTime: '--',
          status: 'no_queue',
          joinedTime: '--',
          currentServing: '--',
        });
        setUpcomingTokens([]);
        setError('You haven\'t joined any queue yet. Go to "Join Queue" to get started.');
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to track queue. Status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log("User Queues API Response:", apiResponse);
      
      const queuesList = apiResponse.data || [];
      console.log("Queues List for user " + loggedInUserId + ":", queuesList);
      
      // Filter to find an active/waiting queue for this user
      const activeQueue = Array.isArray(queuesList) ? queuesList.find(q => q.status === 'WAITING' || q.status === 'waiting') : null;
      
      if (!Array.isArray(queuesList) || queuesList.length === 0 || !activeQueue) {
        console.log("No active queue found for user " + loggedInUserId + ". User hasn't joined a queue yet.");
        setQueueData({
          token: '--',
          service: 'No Queue',
          location: '--',
          position: '--',
          totalInQueue: '--',
          estimatedWaitTime: '--',
          status: 'no_queue',
          joinedTime: '--',
          currentServing: '--',
        });
        setUpcomingTokens([]);
        setError('You haven\'t joined any queue yet. Go to "Join Queue" to get started.');
        setIsLoading(false);
        return;
      }

      // Get the active queue and fetch its full details using token
      const currentQueue = activeQueue;
      if (currentQueue.token) {
        console.log("Found active queue token for user " + loggedInUserId + ": " + currentQueue.token);
        const detailsResponse = await fetch(`http://localhost:8080/api/v1/queues/details/${currentQueue.token}`);
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          const queueDetails = detailsData.data;
          setQueueData({
            token: queueDetails.token || '--',
            service: queueDetails.serviceName || 'N/A',
            location: queueDetails.branchName || 'N/A',
            position: queueDetails.position || 0,
            totalInQueue: queueDetails.position ? (queueDetails.position + 5) : 10,
            estimatedWaitTime: queueDetails.estimatedWaitTime ? `${queueDetails.estimatedWaitTime} minutes` : '--',
            status: queueDetails.status || 'waiting',
            joinedTime: queueDetails.joinedTime ? new Date(queueDetails.joinedTime).toLocaleTimeString() : '--',
            currentServing: queueDetails.position > 0 ? `Q-${Math.floor(Math.random() * 1000)}` : '--',
          });
          setError(null);

          // Fetch upcoming tokens from database
          const upcomingResponse = await fetch(
            `http://localhost:8080/api/v1/queues/upcoming/branch/${queueDetails.branchId}/service/${queueDetails.serviceId}?limit=5`
          );
          
          if (upcomingResponse.ok) {
            const upcomingData = await upcomingResponse.json();
            const tokens = upcomingData.data || [];
            console.log("Upcoming tokens from database:", tokens);
            setUpcomingTokens(tokens);
          } else {
            setUpcomingTokens(['--', '--', '--', '--', '--']);
          }
        } else {
          // If details fetch fails, use basic queue data from list
          setQueueData({
            token: currentQueue.token || '--',
            service: 'Service',
            location: 'Branch',
            position: currentQueue.position || 0,
            totalInQueue: currentQueue.position ? (currentQueue.position + 5) : 10,
            estimatedWaitTime: currentQueue.estimatedWaitTime ? `${currentQueue.estimatedWaitTime} minutes` : '--',
            status: currentQueue.status || 'waiting',
            joinedTime: currentQueue.joinedTime ? new Date(currentQueue.joinedTime).toLocaleTimeString() : '--',
            currentServing: currentQueue.position > 0 ? `Q-${Math.floor(Math.random() * 1000)}` : '--',
          });
          setUpcomingTokens(['--', '--', '--', '--', '--']);
        }
      }

    } catch (err) {
      console.error("Error fetching tracking data:", err);
      setError(err.message);
      setQueueData({
        token: '--',
        service: 'Error',
        location: '--',
        position: '--',
        totalInQueue: '--',
        estimatedWaitTime: '--',
        status: 'error',
        joinedTime: '--',
        currentServing: '--',
      });
      setUpcomingTokens([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const loggedInUserId = userId || 1;
      const response = await fetch(`http://localhost:8080/api/v1/notification/user/${loggedInUserId}`);
      if (response.ok) {
        const data = await response.json();
        setUserNotifications(Array.isArray(data) ? data : data.data || []);
        
        // Check for QUEUE CALLED notification (sent as SUCCESS type)
        const notificationData = Array.isArray(data) ? data : data.data || [];
        const calledNotification = notificationData.find(n => (n.type === 'SUCCESS' && n.title === 'Time Ready') && !n.isRead);
        if (calledNotification) {
          setSuccessMessage('Your time is ready! Please come to the counter now.');
          // Refresh queue data to show updated status
          setTimeout(() => fetchQueueData(), 500);
        }
        
        // Check for QUEUE DELETED notification (sent as ALERT type)
        const deletedNotification = notificationData.find(n => (n.type === 'ALERT' && n.title === 'Queue Removed') && !n.isRead);
        if (deletedNotification) {
          setError('Your queue has been removed from the system.');
          setQueueData({
            token: '--',
            service: 'Queue Removed',
            location: '--',
            position: '--',
            totalInQueue: '--',
            estimatedWaitTime: '--',
            status: 'removed',
            joinedTime: '--',
            currentServing: '--',
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }

  // Fetch data on component mount or when userId/queueToken changes
  useEffect(() => {
    fetchQueueData();
    
    // Set up polling for notifications and queue updates
    const interval = setInterval(() => {
      fetchQueueData();
      fetchNotifications();
    }, 3000); // Poll every 3 seconds
    
    setPollInterval(interval);
    
    // Fetch initial notifications
    fetchNotifications();
    
    // Cleanup interval on unmount
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [userId, queueToken]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
      case 'WAITING':
        return 'text-blue-400'
      case 'called':
      case 'CALLED':
        return 'text-green-400'
      case 'removed':
      case 'CANCELLED':
        return 'text-red-400'
      case 'completed':
      case 'COMPLETED':
        return 'text-green-400'
      default:
        return 'text-slate-400'
    }
  }

  const getStatusBg = (status) => {
    switch (status) {
      case 'waiting':
      case 'WAITING':
        return 'bg-blue-600/20 border-blue-500/30'
      case 'called':
      case 'CALLED':
        return 'bg-green-600/20 border-green-500/30'
      case 'completed':
      case 'COMPLETED':
        return 'bg-green-600/20 border-green-500/30'
      case 'removed':
      case 'CANCELLED':
        return 'bg-red-600/20 border-red-500/30'
      default:
        return 'bg-slate-600/20 border-slate-500/30'
    }
  }

  // Safely calculate progress ensuring we don't divide by zero
  const maxQueueSize = Math.max(queueData.totalInQueue || 1, queueData.position || 1);
  const progress = Math.max(0, Math.min(100, ((maxQueueSize - (queueData.position || 0)) / maxQueueSize) * 100));

  const handleEnableNotifications = () => {
    setNotificationsEnabled(true);
    setSuccessMessage('✓ Notifications enabled successfully!');
    
    // Auto-dismiss success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="trackQueue"
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
            <div className="flex items-center gap-4">
              <div>
              <h1 className="text-3xl font-bold text-white">Track Queue</h1>
              <p className="text-slate-400 text-sm">Monitor your position in real-time</p>
            </div>
          </div>
          <button 
            onClick={fetchQueueData}
            title="Refresh queue status"
            disabled={isLoading}
            className={`p-3 rounded-xl bg-[#2a3060] hover:bg-[#3a4080] border border-[#3a4080] transition-all text-slate-300 hover:text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Success Message Toast */}
          {successMessage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-emerald-600/20 to-green-500/20 border border-emerald-500/50 rounded-xl text-emerald-300 flex items-center gap-3 animate-pulse">
              <div className="w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <span className="text-emerald-300 font-bold">✓</span>
              </div>
              <span className="font-semibold">{successMessage}</span>
            </div>
          )}

          {/* Queue Removed Message */}
          {queueData.status === 'removed' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/50 rounded-xl text-red-300 flex items-center gap-3">
              <AlertCircle size={20} />
              <span className="font-semibold">{error || 'Your queue has been removed from the system.'}</span>
            </div>
          )}

          {/* No Queue Message */}
          {queueData.status === 'no_queue' && (
            <div className="flex flex-col items-center justify-center min-h-96 text-center">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-12 max-w-md">
                <AlertCircle size={48} className="mx-auto mb-4 text-amber-400" />
                <h2 className="text-2xl font-bold text-white mb-3">No Active Queue</h2>
                <p className="text-slate-400 mb-6">You haven't joined any queue yet. Head over to "Join Queue" to get started and track your position in real-time.</p>
                <button
                  onClick={onNavigateToJoinQueue}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all text-white"
                >
                  Join a Queue Now
                </button>
              </div>
            </div>
          )}

          {/* Queue Details (Only show if user has an active queue) */}
          {queueData.status !== 'no_queue' && queueData.status !== 'removed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Tracking */}
            <div className="lg:col-span-2 space-y-6">
              {/* CALLED Alert Banner */}
              {(queueData.status === 'called' || queueData.status === 'CALLED') && (
                <div className="bg-gradient-to-r from-green-600/30 to-emerald-600/30 border-2 border-green-500/50 rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="text-4xl">🔔</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-300 mb-1">Your Time is Ready!</h3>
                      <p className="text-green-200">Please proceed to the counter now for your service.</p>
                    </div>
                  </div>
                </div>
              )}

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
                  {userNotifications && userNotifications.length > 0 ? (
                    userNotifications.map((notif) => {
                      const isCalledNotif = notif.type === 'SUCCESS' && notif.title === 'Time Ready';
                      const isDeletedNotif = notif.type === 'ALERT' && notif.title === 'Queue Removed';
                      return (
                        <div
                          key={notif.notificationId || notif.id}
                          className={`p-3 rounded-lg border ${
                            isCalledNotif
                              ? 'bg-green-600/10 border-green-500/20'
                              : isDeletedNotif
                              ? 'bg-red-600/10 border-red-500/20'
                              : notif.type === 'SUCCESS'
                              ? 'bg-emerald-600/10 border-emerald-500/20'
                              : notif.type === 'WARNING'
                              ? 'bg-amber-600/10 border-amber-500/20'
                              : notif.type === 'ALERT'
                              ? 'bg-red-600/10 border-red-500/20'
                              : 'bg-blue-600/10 border-blue-500/20'
                          }`}
                        >
                          <p className="text-xs font-semibold text-slate-300">{notif.message}</p>
                          <p className="text-xs text-slate-500 mt-1">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : 'Just now'}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-slate-400">No notifications yet</p>
                    </div>
                  )}
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
                <button onClick={handleEnableNotifications} disabled={notificationsEnabled} className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {notificationsEnabled ? '✓ Notifications Enabled' : 'Enable Notifications'}
                </button>
                <button className="w-full py-3 px-4 bg-[#1a1f3a] border border-[#2a3060] rounded-xl font-bold text-slate-300 hover:bg-[#2a3060] transition-all">
                  Exit Queue
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
        </div>
      </main>
    </div>
  )
}
