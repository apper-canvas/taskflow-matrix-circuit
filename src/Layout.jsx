import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routes, routeArray } from './config/routes';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-app">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 z-40">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-8">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" className="text-white" size={18} />
              </div>
              <h1 className="text-xl font-display font-bold text-surface-900">TaskFlow</h1>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {routeArray.map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                    }`
                  }
                >
                  <ApperIcon name={route.icon} size={18} />
                  {route.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-all"
            >
              <ApperIcon name="Settings" size={20} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden flex-shrink-0 bg-white border-b border-surface-200">
        <nav className="flex items-center px-6 py-3 gap-4">
          {routeArray.map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                }`
              }
            >
              <ApperIcon name={route.icon} size={16} />
              {route.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;