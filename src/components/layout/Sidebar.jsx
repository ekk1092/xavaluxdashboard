import { Box, ClipboardList, Layers, LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, t }) {
  const navItems = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: LayoutDashboard },
    { id: 'inventory', label: t('nav_inventory'), icon: Box },
    { id: 'orders', label: t('nav_orders'), icon: ClipboardList },
    { id: 'settings', label: t('nav_settings'), icon: SettingsIcon },
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
          const isActive = activeTab === item.id;
          const btnStyle = isActive
            ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }
            : { color: 'var(--muted)' };

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex-shrink-0 lg:w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
              style={btnStyle}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto hidden lg:block">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--panel-border)', color: 'var(--muted)' }}>
          N
        </div>
      </div>
    </div>
  );
}
