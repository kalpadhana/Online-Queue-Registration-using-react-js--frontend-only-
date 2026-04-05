import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import Dashboard from './components/Dashboard'
import JoinQueue from './components/JoinQueue'
import TrackQueue from './components/TrackQueue'

import NotificationsPage from './components/NotificationsPage'
import AdminDashboard from './components/AdminDashboard'
import PriorityQueue from './components/PriorityQueue'
import Settings from './components/Settings'

export default function App() {
  const [page, setPage] = useState('splash')
  const [message, setMessage] = useState("")
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState(null)
  const [queueToken, setQueueToken] = useState(null)
  
  // New Customer Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Load persisted data on app mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const storedEmail = localStorage.getItem('email')
    const storedUserName = localStorage.getItem('userName')
    const storedQueueToken = localStorage.getItem('queueToken')
    
    if (storedUserId) {
      setUserId(parseInt(storedUserId))
    }
    if (storedEmail) {
      setEmail(storedEmail)
    }
    if (storedUserName) {
      setUserName(storedUserName)
    }
    if (storedQueueToken) {
      setQueueToken(storedQueueToken)
    }
  }, [])

  const handleAddCustomerSubmit = async () => {
    console.log("Sending data:", { name, email });

    try {
      const response = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      console.log("Response from backend:", data);
      alert("Customer added successfully!");
      setPage('dashboard'); // Return to dashboard after adding
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/test")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then((data) => {
        console.log("Backend Response:", data); // 🔥 check console
        setMessage(data);
      })
      .catch((err) => {
        console.error("Backend connection failed:", err.message);
        setMessage("Could not connect to backend");
      });
  }, []);

  const handleGetStarted = () => {
    setPage('login')
  }

  const handleLoginClick = () => {
    setPage('login')
  }

  const handleSignupClick = () => {
    setPage('signup')
  }

  const handleLoginSuccess = (userData) => {
    console.log("User logged in successfully:", userData);
    
    // Clear previous user's data
    setQueueToken(null)
    localStorage.removeItem('queueToken')
    
    if (userData && (userData.name || userData.fullName)) {
      const name = userData.name || userData.fullName
      setUserName(name)
      localStorage.setItem('userName', name)
    }
    if (userData && userData.userId) {
      setUserId(userData.userId)
      localStorage.setItem('userId', userData.userId.toString())
    }
    if (userData && userData.email) {
      setEmail(userData.email)
      localStorage.setItem('email', userData.email)
    }
    setPage('dashboard')
  }

  const handleSignupSuccess = (userData) => {
    console.log("User signed up successfully:", userData);
    
    // Clear previous user's data
    setQueueToken(null)
    localStorage.removeItem('queueToken')
    
    if (userData && userData.name) {
      setUserName(userData.name)
      localStorage.setItem('userName', userData.name)
    }
    if (userData && userData.userId) {
      setUserId(userData.userId)
      localStorage.setItem('userId', userData.userId.toString())
    }
    if (userData && userData.email) {
      setEmail(userData.email)
      localStorage.setItem('email', userData.email)
    }
    setPage('dashboard')
  }

  const handleNavigateToDashboard = () => {
    setPage('dashboard')
  }

  const handleNavigateToJoinQueue = () => {
    setPage('joinQueue')
  }

  const handleNavigateToTrackQueue = () => {
    setPage('trackQueue')
  }



  const handleNavigateToNotifications = () => {
    setPage('notifications')
  }

  const handleNavigateToAdminDashboard = () => {
    setPage('admin')
  }

  const handleNavigateToPriorityQueue = () => {
    setPage('priorityQueue')
  }

  const handleNavigateToSettings = () => {
    setPage('settings')
  }

  const handleLogout = () => {
    // Clear all user data from state and localStorage
    setUserId(null)
    setUserName('')
    setEmail('')
    setQueueToken(null)
    
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('email')
    localStorage.removeItem('queueToken')
    
    setPage('login')
  }

  const handleQueueJoined = (token) => {
    console.log("Queue joined with token:", token)
    setQueueToken(token)
    localStorage.setItem('queueToken', token)
    // Optionally navigate to track queue automatically
    // setPage('trackQueue')
  }

  if (page === 'splash') {
    return <SplashScreen onGetStarted={handleGetStarted} />
  }

  if (page === 'login') {
    return (
      <LoginPage
        onNavigateSignup={handleSignupClick}
        onLoginSuccess={handleLoginSuccess}
      />
    )
  }

  if (page === 'signup') {
    return (
      <SignupPage
        onNavigateLogin={handleLoginClick}
        onSignupSuccess={handleSignupSuccess}
      />
    )
  }

  if (page === 'dashboard') {
    return <Dashboard 
      userId={userId}
      email={email}
      userName={userName} 
      onNavigateToJoinQueue={handleNavigateToJoinQueue} 
      onNavigateToTrackQueue={handleNavigateToTrackQueue} 
      onNavigateToDashboard={handleNavigateToDashboard} 
      onNavigateToNotifications={handleNavigateToNotifications} 
      onNavigateToAdminDashboard={handleNavigateToAdminDashboard} 
      onNavigateToPriorityQueue={handleNavigateToPriorityQueue} 
      onNavigateToSettings={handleNavigateToSettings}
      onLogout={handleLogout}
    />
  }

  if (page === 'joinQueue') {
    return <JoinQueue userName={userName} email={email} userId={userId} onQueueJoined={handleQueueJoined} onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} onLogout={handleLogout} />
  }

  if (page === 'trackQueue') {
    return <TrackQueue userName={userName} email={email} userId={userId} queueToken={queueToken} onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} onLogout={handleLogout} />
  }



  if (page === 'notifications') {
    return <NotificationsPage userName={userName} onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} onLogout={handleLogout} />
  }

  if (page === 'admin') {
    return <AdminDashboard userName={userName} onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} onLogout={handleLogout} />
  }

  if (page === 'priorityQueue') {
    return <PriorityQueue userName={userName} onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} onLogout={handleLogout} />
  }

  if (page === 'settings') {
    return <Settings userName={userName} onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} onLogout={handleLogout} />
  }

  if (page === 'addCustomer') {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Add Customer</h1>

        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", margin: "5px 0" }}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "8px", margin: "5px 0" }}
        />

        <br /><br />

        <button 
          onClick={handleAddCustomerSubmit}
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          Submit
        </button>
        <br /><br />
        <button onClick={() => setPage('dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  // Fallback - should not reach here
  return <SplashScreen onGetStarted={handleGetStarted} />
}

