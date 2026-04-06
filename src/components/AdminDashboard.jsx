import { useState, useEffect } from 'react'
import { Users, Zap, Settings, BarChart3, Plus, Search, Filter, Edit2, Trash2, Check, X, Eye, EyeOff, Clock, TrendingUp, RefreshCw, Download } from 'lucide-react'
import Sidebar from './Sidebar'

const API_BASE_URL = 'http://localhost:8080/api/v1'

// Dashboard Overview Component
function DashboardOverview({ stats, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw size={48} className="text-blue-400 mx-auto mb-4 animate-spin" />
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BarChart3 size={24} className="text-blue-400" />
          System Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Total Queues', value: stats.totalQueues, icon: '📊', color: 'from-blue-600/10 to-blue-600/10 border-blue-500/20' },
            { label: 'Waiting', value: stats.waiting, icon: '⏳', color: 'from-yellow-600/10 to-yellow-600/10 border-yellow-500/20' },
            { label: 'Served', value: stats.served, icon: '✅', color: 'from-green-600/10 to-green-600/10 border-green-500/20' },
            { label: 'Cancelled', value: stats.cancelled, icon: '❌', color: 'from-red-600/10 to-red-600/10 border-red-500/20' },
            { label: 'Active Counters', value: stats.activeCounters, icon: '🏪', color: 'from-purple-600/10 to-purple-600/10 border-purple-500/20' },
            { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-cyan-600/10 to-cyan-600/10 border-cyan-500/20' },
          ].map((stat, i) => (
            <div key={i} className={`bg-gradient-to-br ${stat.color} border rounded-xl p-4 hover:shadow-lg transition-all`}>
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-xs text-slate-500 mb-1 font-semibold uppercase">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">System Status</h3>
            <TrendingUp className="text-green-400" size={24} />
          </div>
          <p className="text-4xl font-bold text-green-400 mb-2">Active</p>
          <p className="text-sm text-slate-300">System running normally</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Queue Health</h3>
            <TrendingUp className="text-blue-400" size={24} />
          </div>
          <p className="text-4xl font-bold text-blue-400 mb-2">{stats.avgWait}min</p>
          <p className="text-sm text-slate-300">Average wait time</p>
        </div>
      </div>
    </div>
  )
}

// Queue Management Component
function QueueManagement() {
  const [queues, setQueues] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ 
    userId: '', email: '', status: 'WAITING', serviceId: '', branchId: '' 
  })

  // Fetch queues from database
  useEffect(() => {
    fetchQueues()
  }, [])

  const fetchQueues = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/queues`)
      const data = await response.json()
      let queuesData = data.data || data || []
      
      // If API returns enriched data with service and branch objects, use it as-is
      // Otherwise, the table will handle missing nested objects gracefully
      if (Array.isArray(queuesData)) {
        setQueues(queuesData)
      } else {
        setQueues([])
      }
    } catch (err) {
      setError('Failed to fetch queues')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = queues.filter(q => {
    const matchesSearch = q.token.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (q.user?.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'All' || q.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleStatusChange = async (queueId, newStatus) => {
    try {
      const queue = queues.find(q => q.queueId === queueId)
      
      // Use new endpoint for CALLED status (sends email automatically)
      if (newStatus === 'CALLED') {
        const response = await fetch(`${API_BASE_URL}/queues/call/${queueId}`, {
          method: 'PUT'
        })
        if (response.ok) {
          setQueues(queues.map(q => q.queueId === queueId ? { ...q, status: 'CALLED' } : q))
          console.log('✅ Queue called successfully - Email notification sent')
        } else {
          console.error('Failed to call queue:', await response.text())
        }
      } else {
        // Use old endpoint for other statuses
        const response = await fetch(`${API_BASE_URL}/queues/${queueId}/status?status=${newStatus}`, {
          method: 'PATCH'
        })
        if (response.ok) {
          setQueues(queues.map(q => q.queueId === queueId ? { ...q, status: newStatus } : q))
        } else {
          console.error('Failed to update queue status:', await response.text())
        }
      }
    } catch (err) {
      setError('Failed to update queue status')
      console.error(err)
    }
  }

  const handleDelete = async (queueId) => {
    try {
      const queue = queues.find(q => q.queueId === queueId)
      const response = await fetch(`${API_BASE_URL}/queues/${queueId}/cancel`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setQueues(queues.filter(q => q.queueId !== queueId))
        
        // Send notification to user when queue is deleted
        if (queue) {
          const userId = queue.userId || queue.user?.userId || queue.user?.id
          if (userId) {
            try {
              const notificationResponse = await fetch(`${API_BASE_URL}/notification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId: userId,
                  title: 'Queue Removed',
                  message: 'Your queue has been removed from the system.',
                  type: 'ALERT',
                  queueId: queueId
                })
              })
              if (!notificationResponse.ok) {
                console.error('Notification creation failed:', await notificationResponse.text())
              }
            } catch (notifErr) {
              console.error('Failed to send notification:', notifErr)
            }
          } else {
            console.warn('User ID not found in queue object:', queue)
          }
        }
      }
    } catch (err) {
      setError('Failed to delete queue')
      console.error(err)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'WAITING': return 'bg-yellow-600/20 border-yellow-500/30 text-yellow-300'
      case 'CALLED': return 'bg-blue-600/20 border-blue-500/30 text-blue-300'
      case 'COMPLETED': return 'bg-green-600/20 border-green-500/30 text-green-300'
      case 'CANCELLED': return 'bg-red-600/20 border-red-500/30 text-red-300'
      default: return 'bg-slate-600/20 border-slate-500/30 text-slate-300'
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="animate-spin" size={48} /></div>
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg p-4">{error}</div>}
      
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-3 flex-1">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by token or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1a1f3a] border border-[#2a3060] rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#1a1f3a] border border-[#2a3060] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
          >
            <option>All</option>
            <option>WAITING</option>
            <option>CALLED</option>
            <option>COMPLETED</option>
            <option>CANCELLED</option>
          </select>
        </div>
        <button
          onClick={fetchQueues}
          className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg flex items-center gap-2 transition-all"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Queue Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a3060]">
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Token</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Position</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Service</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Branch</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">User Email</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Est. Wait Time</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
              <th className="text-center py-3 px-4 text-slate-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((queue) => (
              <tr key={queue.queueId} className="border-b border-[#2a3060] hover:bg-[#1a1f3a]/50 transition-all">
                <td className="py-3 px-4 text-purple-400 font-bold">{queue.token}</td>
                <td className="py-3 px-4 text-white">#{queue.position}</td>
                <td className="py-3 px-4 text-slate-300">
                  {queue.service?.name ? queue.service.name : (queue.serviceId ? `Service #${queue.serviceId}` : 'N/A')}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {queue.branch?.name ? queue.branch.name : (queue.branchId ? `Branch #${queue.branchId}` : 'N/A')}
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {queue.user?.email ? queue.user.email : (queue.userId ? `User #${queue.userId}` : 'N/A')}
                </td>
                <td className="py-3 px-4 text-yellow-300">{queue.estimatedWaitTime || '--'} min</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 border rounded-lg text-xs font-semibold ${getStatusColor(queue.status)}`}>
                    {queue.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => handleDelete(queue.queueId)} className="text-red-400 hover:text-red-300 transition-all" title="Delete Queue">
                      <Trash2 size={16} />
                    </button>
                    {queue.status === 'WAITING' && (
                      <button
                        onClick={() => handleStatusChange(queue.queueId, 'CALLED')}
                        className="px-2 py-1 bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded text-xs hover:bg-blue-600/30 transition-all"
                        title="Call user to counter"
                      >
                        Call
                      </button>
                    )}
                    {queue.status === 'CALLED' && (
                      <button
                        onClick={() => handleStatusChange(queue.queueId, 'COMPLETED')}
                        className="px-2 py-1 bg-green-600/20 border border-green-500/30 text-green-300 rounded text-xs hover:bg-green-600/30 transition-all"
                        title="Mark as completed"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Customer Management Component
function CustomerManagement() {
  const [customers, setCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/user`)
      const data = await response.json()
      if (Array.isArray(data)) {
        setCustomers(data)
      } else if (data.data) {
        setCustomers(data.data)
      }
    } catch (err) {
      setError('Failed to fetch customers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const toggleStatus = async (id) => {
    try {
      const customer = customers.find(c => c.userId === id)
      const updatedCustomer = { ...customer, isActive: !customer.isActive }
      
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer)
      })
      
      if (response.ok) {
        setCustomers(customers.map(c =>
          c.userId === id ? updatedCustomer : c
        ))
      }
    } catch (err) {
      setError('Failed to update customer status')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="animate-spin" size={48} /></div>
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg p-4">{error}</div>}
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search customers by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1a1f3a] border border-[#2a3060] rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Customers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a3060]">
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Name</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Email</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Phone</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
              <th className="text-center py-3 px-4 text-slate-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.userId} className="border-b border-[#2a3060] hover:bg-[#1a1f3a]/50 transition-all">
                <td className="py-3 px-4 text-white font-medium">{customer.fullName}</td>
                <td className="py-3 px-4 text-slate-300">{customer.email || 'N/A'}</td>
                <td className="py-3 px-4 text-slate-300">{customer.phone || 'N/A'}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 border rounded-lg text-xs font-semibold ${
                    customer.isActive !== false
                      ? 'bg-green-600/20 border-green-500/30 text-green-300' 
                      : 'bg-red-600/20 border-red-500/30 text-red-300'
                  }`}>
                    {customer.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleStatus(customer.userId)}
                    className={`px-3 py-1 border rounded text-xs font-semibold transition-all ${
                      customer.isActive !== false
                        ? 'bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30'
                        : 'bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30'
                    }`}
                  >
                    {customer.isActive !== false ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Counter Management Component
function CounterManagement() {
  const [counters, setCounters] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', status: 'OPEN' })

  useEffect(() => {
    fetchCounters()
  }, [])

  const fetchCounters = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/counter`)
      const data = await response.json()
      setCounters(Array.isArray(data) ? data : (data.data || []))
    } catch (err) {
      setError('Failed to fetch counters')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCounter = async () => {
    if (!formData.name) return

    try {
      const response = await fetch(`${API_BASE_URL}/counter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchCounters()
        setFormData({ name: '', status: 'OPEN' })
        setShowForm(false)
      }
    } catch (err) {
      setError('Failed to add counter')
      console.error(err)
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'OPEN' ? 'CLOSED' : 'OPEN'
      const response = await fetch(`${API_BASE_URL}/counter/${id}/status?status=${newStatus}`, {
        method: 'PATCH'
      })

      if (response.ok) {
        setCounters(counters.map(c =>
          c.id === id ? { ...c, status: newStatus } : c
        ))
      }
    } catch (err) {
      setError('Failed to update counter status')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="animate-spin" size={48} /></div>
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg p-4">{error}</div>}
      
      {/* Add Counter */}
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg flex items-center gap-2 transition-all"
      >
        <Plus size={18} />
        Add Counter
      </button>

      {showForm && (
        <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Add New Counter</h3>
          <input
            type="text"
            placeholder="Counter Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
          />
          <div className="flex gap-3">
            <button
              onClick={handleAddCounter}
              className="flex-1 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 rounded-lg transition-all"
            >
              Add Counter
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 bg-slate-600/20 hover:bg-slate-600/30 border border-slate-500/30 text-slate-300 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {counters.map((counter) => (
          <div key={counter.id} className={`bg-gradient-to-br border rounded-xl p-6 ${
            counter.status === 'OPEN'
              ? 'from-green-600/10 to-emerald-600/10 border-green-500/20'
              : 'from-slate-600/10 to-slate-600/10 border-slate-500/20'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{counter.name}</h3>
              </div>
              <span className={`px-3 py-1 border rounded-lg text-xs font-semibold ${
                counter.status === 'OPEN'
                  ? 'bg-green-600/20 border-green-500/30 text-green-300'
                  : 'bg-slate-600/20 border-slate-500/30 text-slate-300'
              }`}>
                {counter.status}
              </span>
            </div>
            <button
              onClick={() => toggleStatus(counter.id, counter.status)}
              className={`w-full px-3 py-2 border rounded transition-all text-xs font-semibold ${
                counter.status === 'OPEN'
                  ? 'bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30'
                  : 'bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30'
              }`}
            >
              {counter.status === 'OPEN' ? 'Close' : 'Open'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Admin Management Component
function AdminManagement() {
  const [admins, setAdmins] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'STAFF' })

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/admin-staff`)
      const data = await response.json()
      setAdmins(data.data || data || [])
    } catch (err) {
      setError('Failed to fetch admins')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async () => {
    if (!formData.fullName || !formData.email) return

    try {
      const response = await fetch(`${API_BASE_URL}/admin-staff/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          status: 'ACTIVE'
        })
      })

      if (response.ok) {
        await fetchAdmins()
        setFormData({ fullName: '', email: '', role: 'STAFF' })
        setShowForm(false)
      }
    } catch (err) {
      setError('Failed to add admin')
      console.error(err)
    }
  }

  const toggleEnabled = async (id) => {
    try {
      const admin = admins.find(a => a.id === id)
      const updatedAdmin = { ...admin, status: admin.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
      
      const response = await fetch(`${API_BASE_URL}/admin-staff/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAdmin)
      })

      if (response.ok) {
        setAdmins(admins.map(a => a.id === id ? updatedAdmin : a))
      }
    } catch (err) {
      setError('Failed to update admin status')
      console.error(err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><RefreshCw className="animate-spin" size={48} /></div>
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg p-4">{error}</div>}
      
      {/* Add Admin */}
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg flex items-center gap-2 transition-all"
      >
        <Plus size={18} />
        Add Admin
      </button>

      {showForm && (
        <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Add New Admin</h3>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50"
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
          >
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
          </select>
          <div className="flex gap-3">
            <button
              onClick={handleAddAdmin}
              className="flex-1 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 rounded-lg transition-all"
            >
              Add Admin
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 bg-slate-600/20 hover:bg-slate-600/30 border border-slate-500/30 text-slate-300 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Admins Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a3060]">
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Name</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Email</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Role</th>
              <th className="text-left py-3 px-4 text-slate-400 font-semibold">Status</th>
              <th className="text-center py-3 px-4 text-slate-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b border-[#2a3060] hover:bg-[#1a1f3a]/50 transition-all">
                <td className="py-3 px-4 text-white font-medium">{admin.fullName || admin.name}</td>
                <td className="py-3 px-4 text-slate-300">{admin.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 border rounded-lg text-xs font-semibold ${
                    admin.role === 'ADMIN'
                      ? 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                      : 'bg-blue-600/20 border-blue-500/30 text-blue-300'
                  }`}>
                    {admin.role}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 border rounded-lg text-xs font-semibold ${
                    admin.status === 'ACTIVE'
                      ? 'bg-green-600/20 border-green-500/30 text-green-300'
                      : 'bg-red-600/20 border-red-500/30 text-red-300'
                  }`}>
                    {admin.status || 'ACTIVE'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleEnabled(admin.id)}
                    className={`px-3 py-1 border rounded text-xs font-semibold transition-all ${
                      admin.status === 'ACTIVE'
                        ? 'bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30'
                        : 'bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30'
                    }`}
                  >
                    {admin.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Settings Component
function SettingsPage() {
  const [workingHours, setWorkingHours] = useState({ start: '09:00', end: '18:00' })
  const [queueLimit, setQueueLimit] = useState(150)
  const [systemName, setSystemName] = useState('Smart Queue Management System')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Working Hours */}
      <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock size={20} className="text-blue-400" />
          Working Hours
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Start Time</label>
            <input
              type="time"
              value={workingHours.start}
              onChange={(e) => setWorkingHours({...workingHours, start: e.target.value})}
              className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-2">End Time</label>
            <input
              type="time"
              value={workingHours.end}
              onChange={(e) => setWorkingHours({...workingHours, end: e.target.value})}
              className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>
        </div>
      </div>

      {/* Queue Limit */}
      <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Users size={20} className="text-green-400" />
          Queue Settings
        </h3>
        <label className="block text-sm text-slate-400 mb-2">Max Queue Limit</label>
        <input
          type="number"
          value={queueLimit}
          onChange={(e) => setQueueLimit(parseInt(e.target.value))}
          className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* System Name */}
      <div className="bg-[#1a1f3a] border border-[#2a3060] rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Zap size={20} className="text-yellow-400" />
          System Settings
        </h3>
        <label className="block text-sm text-slate-400 mb-2">System Name</label>
        <input
          type="text"
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          className="w-full bg-[#0a0e27] border border-[#2a3060] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Save Button */}
      {saved && (
        <div className="bg-green-600/20 border border-green-500/30 text-green-300 rounded-lg p-4 flex items-center gap-2">
          <Check size={18} />
          Settings saved successfully!
        </div>
      )}
      <button
        onClick={handleSave}
        className="w-full px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg font-semibold transition-all"
      >
        Save Settings
      </button>
    </div>
  )
}

// Main Admin Dashboard Component
export default function AdminDashboard({ userName, ...otherProps }) {
  const { onNavigateToDashboard, onNavigateToJoinQueue, onNavigateToTrackQueue, onNavigateToNotifications, onNavigateToAdminDashboard, onNavigateToPriorityQueue, onNavigateToSettings, onLogout } = otherProps
  const [activePage, setActivePage] = useState('dashboard')
  const [stats, setStats] = useState({
    totalQueues: 0,
    waiting: 0,
    served: 0,
    cancelled: 0,
    activeCounters: 0,
    totalUsers: 0,
    avgWait: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [queuesRes, usersRes, countersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/queues`),
        fetch(`${API_BASE_URL}/user`),
        fetch(`${API_BASE_URL}/counter`)
      ])

      const queuesData = await queuesRes.json()
      const usersData = await usersRes.json()
      const countersData = await countersRes.json()

      const queues = queuesData.data || queuesData || []
      const users = Array.isArray(usersData) ? usersData : (usersData.data || [])
      const counters = Array.isArray(countersData) ? countersData : (countersData.data || [])

      // Calculate stats
      const totalQueues = queues.length
      const waiting = queues.filter(q => q.status === 'WAITING').length
      const served = queues.filter(q => q.status === 'COMPLETED').length
      const cancelled = queues.filter(q => q.status === 'CANCELLED').length
      const activeCounters = counters.filter(c => c.status === 'OPEN').length
      const totalUsers = users.length

      // Calculate average wait time
      let totalWaitTime = 0
      const waitingQueues = queues.filter(q => q.status === 'WAITING')
      if (waitingQueues.length > 0) {
        waitingQueues.forEach(q => {
          const waitTime = parseInt(q.estimatedWaitTime) || 0
          totalWaitTime += waitTime
        })
      }
      const avgWait = waitingQueues.length > 0 ? Math.round(totalWaitTime / waitingQueues.length) : 0

      setStats({
        totalQueues,
        waiting,
        served,
        cancelled,
        activeCounters,
        totalUsers,
        avgWait
      })
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'queues', label: 'Queues', icon: Zap },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'counters', label: 'Counters', icon: TrendingUp },
    { id: 'admins', label: 'Admins', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

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
              <p className="text-slate-400 text-sm">Complete queue management system</p>
            </div>
            <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 rounded-lg flex items-center gap-2 transition-all">
              <Download size={18} />
              Export Report
            </button>
          </div>
        </header>

        {/* Tabs Navigation */}
        <div className="bg-[#1a1f3a]/30 border-b border-[#2a3060] px-6">
          <div className="max-w-7xl mx-auto flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePage(tab.id)}
                  className={`px-4 py-3 font-medium text-sm flex items-center gap-2 border-b-2 transition-all ${
                    activePage === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0e27] to-[#0f1535]">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {activePage === 'dashboard' && <DashboardOverview stats={stats} loading={loading} />}
            {activePage === 'queues' && <QueueManagement />}
            {activePage === 'customers' && <CustomerManagement />}
            {activePage === 'counters' && <CounterManagement />}
            {activePage === 'admins' && <AdminManagement />}
            {activePage === 'settings' && <SettingsPage />}
          </div>
        </div>
      </main>
    </div>
  )
}
