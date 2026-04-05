import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Bell, Lock, Palette, Globe, HelpCircle, LogOut, ToggleRight, Save, Moon, Sun } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Settings({ userName, ...otherProps }) {
  const { onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings } = otherProps;
  const [accountSettings, setAccountSettings] = useState({
    name: userName || '',
    email: '',
    phone: '',
    branch: '',
    memberSince: '',
  })

  // Fetch account data from Backend when Settings loads
  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        // You can pass the userName or a User ID if you have one.
        // For example, if your backend expects an email or uses a session token:
        // We will send 'userName' as a query parameter for this example.
        const response = await fetch(`http://localhost:8080/api/users/profile?name=${encodeURIComponent(userName)}`);
        if (response.ok) {
          const data = await response.json();
          setAccountSettings(prev => ({
            ...prev,
            name: data.name || prev.name,
            email: data.email || '',
            phone: data.phone || '',
            branch: data.branch || '',
            memberSince: data.memberSince || ''
          }));
        }
      } catch (error) {
        console.error("Failed to fetch account settings", error);
      }
    };
    
    if (userName) {
      fetchAccountData();
    }
  }, [userName]);

  const [notifications, setNotifications] = useState({
    queueUpdates: true,
    waitTimeAlerts: true,
    promotions: false,
    systemNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  })

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'English',
    timeFormat: '12-hour',
    autoRefresh: true,
  })

  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    allowDataCollection: true,
    showOnlineStatus: true,
    shareAnalytics: false,
  })

  const [editingProfile, setEditingProfile] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleProfileChange = (field, value) => {
    setAccountSettings({ ...accountSettings, [field]: value })
  }

  const handleNotificationToggle = (field) => {
    setNotifications({ ...notifications, [field]: !notifications[field] })
  }

  const handlePrivacyToggle = (field) => {
    setPrivacy({ ...privacy, [field]: !privacy[field] })
  }

  const handleSaveProfile = async () => {
    try {
      // Send the updated account settings to the backend
      const response = await fetch('http://localhost:8080/api/users/profile/update', {
        method: 'PUT', // or POST depending on your backend
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountSettings)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      setSaved(true)
      setEditingProfile(false)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save changes. Please try again.");
    }
  }

  return (
    <div className="flex h-screen bg-[#0a0e27] text-white">
      <Sidebar 
        activePage="settings"
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
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <SettingsIcon size={28} className="text-blue-400" />
              Settings
            </h1>
            <p className="text-slate-400 text-sm mt-1">Manage your account, preferences, and notifications</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
          <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
            
            {/* Success Message */}
            {saved && (
              <div className="bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg p-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Your settings have been saved successfully!
              </div>
            )}

            {/* Account Settings */}
            <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Account Settings</h2>
                <button 
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg transition-all text-sm font-medium"
                >
                  {editingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Full Name</label>
                  {editingProfile ? (
                    <input 
                      type="text" 
                      value={accountSettings.name}
                      onChange={(e) => handleProfileChange('name', e.target.value)}
                      className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  ) : (
                    <p className="text-white font-semibold">{accountSettings.name}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Email</label>
                  {editingProfile ? (
                    <input 
                      type="email" 
                      value={accountSettings.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  ) : (
                    <p className="text-white font-semibold">{accountSettings.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Phone</label>
                  {editingProfile ? (
                    <input 
                      type="tel" 
                      value={accountSettings.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  ) : (
                    <p className="text-white font-semibold">{accountSettings.phone}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Primary Branch</label>
                  <p className="text-white font-semibold">{accountSettings.branch}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#2a3060]">
                <p className="text-xs text-slate-500">Member since {accountSettings.memberSince}</p>
              </div>

              {editingProfile && (
                <button 
                  onClick={handleSaveProfile}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Bell size={24} className="text-blue-400" />
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'queueUpdates', label: 'Queue Updates', description: 'Get notified when your queue changes' },
                  { key: 'waitTimeAlerts', label: 'Wait Time Alerts', description: 'Receive alerts for estimated wait time updates' },
                  { key: 'promotions', label: 'Promotions', description: 'Receive promotional offers and deals' },
                  { key: 'systemNotifications', label: 'System Notifications', description: 'Important system announcements' },
                  { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive notifications via SMS' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-[#0a0e27] rounded-xl border border-[#2a3060]">
                    <div>
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle(item.key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        notifications[item.key]
                          ? 'bg-green-600/20 border border-green-500/30 text-green-300'
                          : 'bg-slate-600/20 border border-slate-500/30 text-slate-300'
                      }`}
                    >
                      <ToggleRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Palette size={24} className="text-purple-400" />
                Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Theme</label>
                  <div className="flex gap-2">
                    {[{ name: 'Dark', value: 'dark', icon: Moon }, { name: 'Light', value: 'light', icon: Sun }].map((theme) => {
                      const Icon = theme.icon
                      return (
                        <button
                          key={theme.value}
                          className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                            preferences.theme === theme.value
                              ? 'bg-blue-600/20 border-blue-500/30 text-blue-300'
                              : 'bg-[#0a0e27] border-[#2a3060] text-slate-400 hover:text-white'
                          }`}
                          onClick={() => setPreferences({ ...preferences, theme: theme.value })}
                        >
                          <Icon size={16} />
                          {theme.name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Language</label>
                  <select 
                    className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Spanish">Español (Spanish)</option>
                    <option value="French">Français (French)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-400 mb-2 block font-semibold">Time Format</label>
                  <select 
                    className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    value={preferences.timeFormat}
                    onChange={(e) => setPreferences({ ...preferences, timeFormat: e.target.value })}
                  >
                    <option value="12-hour">12-hour (AM/PM)</option>
                    <option value="24-hour">24-hour</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#0a0e27] rounded-xl border border-[#2a3060]">
                  <div>
                    <p className="font-semibold text-white">Auto-Refresh</p>
                    <p className="text-xs text-slate-500 mt-1">Automatically refresh queue data</p>
                  </div>
                  <button
                    onClick={() => setPreferences({ ...preferences, autoRefresh: !preferences.autoRefresh })}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      preferences.autoRefresh
                        ? 'bg-green-600/20 border border-green-500/30 text-green-300'
                        : 'bg-slate-600/20 border border-slate-500/30 text-slate-300'
                    }`}
                  >
                    <ToggleRight size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Lock size={24} className="text-amber-400" />
                Privacy & Security
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'profilePublic', label: 'Public Profile', description: 'Allow other users to view your profile' },
                  { key: 'allowDataCollection', label: 'Data Collection', description: 'Allow us to collect usage data to improve service' },
                  { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Let others see when you are online' },
                  { key: 'shareAnalytics', label: 'Share Analytics', description: 'Share anonymous usage analytics' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-[#0a0e27] rounded-xl border border-[#2a3060]">
                    <div>
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{item.description}</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyToggle(item.key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        privacy[item.key]
                          ? 'bg-green-600/20 border border-green-500/30 text-green-300'
                          : 'bg-slate-600/20 border border-slate-500/30 text-slate-300'
                      }`}
                    >
                      <ToggleRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <HelpCircle size={24} className="text-green-400" />
                Help & Support
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 bg-[#0a0e27] border border-[#2a3060] rounded-xl hover:border-blue-500/30 transition-all text-left">
                  <p className="font-semibold text-white mb-1">📚 Documentation</p>
                  <p className="text-sm text-slate-400">View user guides and tutorials</p>
                </button>
                <button className="p-4 bg-[#0a0e27] border border-[#2a3060] rounded-xl hover:border-blue-500/30 transition-all text-left">
                  <p className="font-semibold text-white mb-1">💬 Contact Support</p>
                  <p className="text-sm text-slate-400">Reach out to our support team</p>
                </button>
                <button className="p-4 bg-[#0a0e27] border border-[#2a3060] rounded-xl hover:border-blue-500/30 transition-all text-left">
                  <p className="font-semibold text-white mb-1">🐛 Report Issue</p>
                  <p className="text-sm text-slate-400">Report bugs or issues you encounter</p>
                </button>
                <button className="p-4 bg-[#0a0e27] border border-[#2a3060] rounded-xl hover:border-blue-500/30 transition-all text-left">
                  <p className="font-semibold text-white mb-1">💡 Send Feedback</p>
                  <p className="text-sm text-slate-400">Share your suggestions and feedback</p>
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-600/10 border border-red-500/20 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-red-400 mb-6">Danger Zone</h2>
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/30 text-orange-300 rounded-lg transition-all font-medium">
                  🔄 Change Password
                </button>
                <button className="w-full py-3 px-4 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 rounded-lg transition-all font-medium flex items-center justify-center gap-2">
                  <LogOut size={18} />
                  Logout from All Devices
                </button>
                <button className="w-full py-3 px-4 bg-red-900/20 hover:bg-red-900/30 border border-red-700/30 text-red-400 rounded-lg transition-all font-medium">
                  ⚠️ Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
