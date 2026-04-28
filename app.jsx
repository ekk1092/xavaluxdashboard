import { useEffect, useMemo, useState } from 'react';
import Header from './src/components/layout/Header.jsx';
import Sidebar from './src/components/layout/Sidebar.jsx';
import DashboardPage from './src/components/pages/DashboardPage.jsx';
import InventoryPage from './src/components/pages/InventoryPage.jsx';
import OrdersPage from './src/components/pages/OrdersPage.jsx';
import SettingsPage from './src/components/settings/SettingsPage.jsx';
import { createTranslator } from './src/i18n/translations.js';
import { loadSettings, SETTINGS_STORAGE_KEY } from './src/settings/persistence.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [settings, setSettings] = useState(() => loadSettings());

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const preferredDark =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveTheme = settings.system.theme === 'system' ? (preferredDark ? 'dark' : 'light') : settings.system.theme;
    root.setAttribute('data-theme', effectiveTheme);
    if (effectiveTheme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [settings.system.theme]);

  useEffect(() => {
    document.documentElement.lang = settings.system.language;
  }, [settings.system.language]);

  const t = useMemo(() => createTranslator(settings.system.language), [settings.system.language]);

  return (
    <div
      className="flex min-h-screen flex-col lg:flex-row font-sans selection:bg-blue-500/30"
      style={{ backgroundColor: 'var(--app-bg)', color: 'var(--app-text)' }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header t={t} profile={settings.profile} />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardPage t={t} />}
          {activeTab === 'inventory' && <InventoryPage t={t} />}
          {activeTab === 'orders' && <OrdersPage t={t} />}
          {activeTab === 'settings' && <SettingsPage t={t} settings={settings} onSettingsChange={setSettings} />}
        </main>
      </div>
    </div>
  );
}
