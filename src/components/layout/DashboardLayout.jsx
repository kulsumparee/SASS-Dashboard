import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSidebar } from '../../hooks/useSidebar'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MobileDrawer from './MobileDrawer'

export default function DashboardLayout() {
  const sidebar = useSidebar()

  return (
    <div className="min-h-screen bg-dark-900 flex">

      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar collapsed={sidebar.collapsed} onToggle={sidebar.toggleCollapsed} />
      </div>

      {/* Mobile Drawer */}
      <MobileDrawer open={sidebar.mobileOpen} onClose={sidebar.closeMobile} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          onMenuClick={sidebar.toggleMobile}
          sidebarCollapsed={sidebar.collapsed}
        />

        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
