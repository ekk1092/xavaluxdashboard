import { useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import DashboardPage from './components/pages/DashboardPage.jsx';
import InventoryPage from './components/pages/InventoryPage.jsx';
import LoginPage from './components/pages/LoginPage.jsx';
import OrdersPage from './components/pages/OrdersPage.jsx';
import SettingsPage from './components/settings/SettingsPage.jsx';
import { useAuth } from './context/useAuth.js';
import { createTranslator } from './i18n/translations.js';
import { loadSettings, SETTINGS_STORAGE_KEY } from './settings/persistence.js';

export default function App() {
  const { isAuthenticated } = useAuth();
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

  if (!isAuthenticated) {
    return <LoginPage t={t} />;
  }

  return (
    <div
      className="flex min-h-screen flex-col lg:flex-row font-sans selection:bg-blue-500/30"
      style={{ backgroundColor: 'var(--app-bg)', color: 'var(--app-text)' }}
    >
      <Sidebar t={t} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header t={t} profile={settings.profile} />

        <main className="flex-1 overflow-y-auto pt-6">
          <Routes>
            <Route path="/" element={<DashboardPage t={t} />} />
            <Route path="/inventory" element={<InventoryPage t={t} />} />
            <Route path="/orders" element={<OrdersPage t={t} />} />
            <Route path="/settings" element={<SettingsPage t={t} settings={settings} onSettingsChange={setSettings} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
