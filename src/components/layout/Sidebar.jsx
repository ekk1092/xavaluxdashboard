import { Box, ClipboardList, Layers, LayoutDashboard, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.js';

export default function Sidebar({ t }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', path: '/', label: t('nav_dashboard'), icon: LayoutDashboard },
    { id: 'inventory', path: '/inventory', label: t('nav_inventory'), icon: Box },
    { id: 'orders', path: '/orders', label: t('nav_orders'), icon: ClipboardList },
    { id: 'settings', path: '/settings', label: t('nav_settings'), icon: SettingsIcon },
  ];

  return (
    <div
      className="w-full lg:w-64 lg:h-screen flex flex-col"
      style={{ backgroundColor: 'var(--panel-bg)', borderRight: '1px solid var(--panel-border)', color: 'var(--muted)' }}
    >
      <div className="p-6 flex items-center space-x-3" style={{ color: 'var(--app-text)' }}>
        <Layers className="w-8 h-8" style={{ color: 'var(--accent)' }} />
        <span className="text-xl font-bold tracking-wider">XAVALUX</span>
      </div>

      <nav className="flex flex-row lg:flex-col flex-1 px-4 py-4 gap-2 overflow-x-auto lg:overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive: _isActive }) =>
                `flex-shrink-0 lg:w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors`
              }
              style={({ isActive }) => (isActive
                ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }
                : { color: 'var(--muted)' }
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 mt-auto hidden lg:flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: 'var(--panel-border)', color: 'var(--muted)' }}>
            {user?.firstName?.[0] || 'X'}
          </div>
          <span className="text-sm font-medium truncate" style={{ color: 'var(--app-text)' }}>
            {user ? `${user.firstName} ${user.lastName[0]}.` : ''}
          </span>
        </div>
        <button
          onClick={logout}
          className="p-2 rounded-lg transition-colors flex-shrink-0"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = 'var(--panel-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          title={t('logout')}
          aria-label={t('logout')}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
