import { useState } from 'react'
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

  // Fallback - should not reach here
  return <SplashScreen onGetStarted={handleGetStarted} />
}
