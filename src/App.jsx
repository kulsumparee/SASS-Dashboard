import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ScrollToTop from './hooks/useScrollToTop'
import usePageTitle from './hooks/usePageTitle'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Layouts
import AuthLayout from './components/layout/AuthLayout'
import DashboardLayout from './components/layout/DashboardLayout'

// Auth pages
import LoginPage from './features/auth/LoginPage'
import SignupPage from './features/auth/SignupPage'
import ForgotPasswordPage from './features/auth/ForgotPasswordPage'
import NotFoundPage from './features/auth/NotFoundPage'

// Dashboard pages
import DashboardPage from './features/dashboard/DashboardPage'
import AnalyticsPage from './features/analytics/AnalyticsPage'
import UsersPage from './features/users/UsersPage'
import ProjectsPage from './features/projects/ProjectsPage'
import TeamPage from './features/team/TeamPage'
import NotificationsPage from './features/notifications/NotificationsPage'
import SettingsPage from './features/settings/SettingsPage'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  // Sets document.title on every route change
  usePageTitle()

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public auth routes */}
        <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
          <Route path="/login"            element={<LoginPage />} />
          <Route path="/signup"           element={<SignupPage />} />
          <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
        </Route>

        
        {/* Protected dashboard routes */}
        <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route path="/dashboard"      element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
          <Route path="/analytics"      element={<ErrorBoundary><AnalyticsPage /></ErrorBoundary>} />
          <Route path="/users"          element={<ErrorBoundary><UsersPage /></ErrorBoundary>} />
          <Route path="/projects"       element={<ErrorBoundary><ProjectsPage /></ErrorBoundary>} />
          <Route path="/team"           element={<ErrorBoundary><TeamPage /></ErrorBoundary>} />
          <Route path="/notifications"  element={<ErrorBoundary><NotificationsPage /></ErrorBoundary>} />
          <Route path="/settings"       element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
        </Route>

        {/* 404 */}
        <Route path="/404" element={<NotFoundPage />} />

        {/* Catch-all: redirect logged-in users to dashboard, others to login */}
        <Route path="*" element={<CatchAll />} />
      </Routes>
    </>
  )
}

function CatchAll() {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()
  // Root path → redirect gracefully; unknown paths → 404
  if (pathname === '/') {
    return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
  }
  return <Navigate to="/404" replace />
}

export default function App() {
  return <AppRoutes />
}
