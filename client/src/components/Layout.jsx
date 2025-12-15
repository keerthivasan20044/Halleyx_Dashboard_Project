import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wrench, ShoppingCart, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isBuilderPage = location.pathname === '/builder';
  const isOrdersPage = location.pathname === '/orders';
  const isDashboardPage = location.pathname === '/';
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/builder', label: 'Builder', icon: Wrench },
    { path: '/orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && !isBuilderPage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on Builder and Dashboard pages, Orders page: mobile only */}
      {(!isBuilderPage && !isDashboardPage && !isOrdersPage) || (isOrdersPage && sidebarOpen) ? (
      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isOrdersPage ? 'md:hidden lg:hidden xl:hidden' : 'lg:static lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 p-4">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      ) : null}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button - Hidden on Builder and Dashboard pages */}
        {!isBuilderPage && !isDashboardPage && !isOrdersPage && (
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        </div>
        )}
        
        {/* Mobile Menu Button for Orders page - Only visible on mobile */}
        {isOrdersPage && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
        </div>
        )}
        
        <div className="flex-1 md:overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
