import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen'
import LoginPage from './components/LoginPage'
import SignupPage from './components/SignupPage'
import Dashboard from './components/Dashboard'
import JoinQueue from './components/JoinQueue'
import TrackQueue from './components/TrackQueue'
import CrowdLevel from './components/CrowdLevel'
import NotificationsPage from './components/NotificationsPage'
import AdminDashboard from './components/AdminDashboard'
import PriorityQueue from './components/PriorityQueue'
import Settings from './components/Settings'

export default function App() {
  const [page, setPage] = useState('splash')
  const [message, setMessage] = useState("")
  
  // New Customer Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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
      .then((res) => res.text())
      .then((data) => {
        console.log("Backend Response:", data); // 🔥 check console
        setMessage(data);
      })
      .catch((err) => {
        console.error("Error:", err);
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

  const handleLoginSuccess = () => {
    setPage('dashboard')
  }

  const handleSignupSuccess = () => {
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

  const handleNavigateToCrowdLevel = () => {
    setPage('crowdLevel')
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
    return <Dashboard onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToDashboard={handleNavigateToDashboard} onNavigateToCrowdLevel={handleNavigateToCrowdLevel} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} />
  }

  if (page === 'joinQueue') {
    return <JoinQueue onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToCrowdLevel={handleNavigateToCrowdLevel} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} />
  }

  if (page === 'trackQueue') {
    return <TrackQueue onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToCrowdLevel={handleNavigateToCrowdLevel} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} />
  }

  if (page === 'crowdLevel') {
    return <CrowdLevel onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToCrowdLevel={handleNavigateToCrowdLevel} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} />
  }

  if (page === 'notifications') {
    return <NotificationsPage onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToCrowdLevel={handleNavigateToCrowdLevel} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} />
  }

  if (page === 'admin') {
    return <AdminDashboard onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToCrowdLevel={handleNavigateToCrowdLevel} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} />
  }

  if (page === 'priorityQueue') {
    return <PriorityQueue onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToCrowdLevel={handleNavigateToCrowdLevel} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} />
  }

  if (page === 'settings') {
    return <Settings onNavigateToDashboard={handleNavigateToDashboard} onNavigateToJoinQueue={handleNavigateToJoinQueue} onNavigateToTrackQueue={handleNavigateToTrackQueue} onNavigateToCrowdLevel={handleNavigateToCrowdLevel} onNavigateToNotifications={handleNavigateToNotifications} onNavigateToAdminDashboard={handleNavigateToAdminDashboard} onNavigateToPriorityQueue={handleNavigateToPriorityQueue} onNavigateToSettings={handleNavigateToSettings} />
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

