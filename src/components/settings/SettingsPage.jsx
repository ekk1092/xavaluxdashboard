import { Bell, Settings as SettingsIcon, Shield, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
    style={{ backgroundColor: checked ? 'var(--accent)' : 'var(--panel-border)' }}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

export default function SettingsPage({ t, settings, onSettingsChange }) {
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  const [profileDraft, setProfileDraft] = useState(settings.profile);
  const [notificationsDraft, setNotificationsDraft] = useState(settings.notifications);
  const [systemDraft, setSystemDraft] = useState(settings.system);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [securityError, setSecurityError] = useState('');

  useEffect(() => {
    setProfileDraft(settings.profile);
    setNotificationsDraft(settings.notifications);
    setSystemDraft(settings.system);
  }, [settings]);

  const tabs = [
    { id: 'profile', label: t('tab_profile'), icon: User },
    { id: 'notifications', label: t('tab_notifications'), icon: Bell },
    { id: 'security', label: t('tab_security'), icon: Shield },
    { id: 'system', label: t('tab_system'), icon: SettingsIcon },
  ];

  const hasUnsaved =
    (activeSettingsTab === 'profile' && JSON.stringify(profileDraft) !== JSON.stringify(settings.profile)) ||
    (activeSettingsTab === 'notifications' && JSON.stringify(notificationsDraft) !== JSON.stringify(settings.notifications)) ||
    (activeSettingsTab === 'system' && JSON.stringify(systemDraft) !== JSON.stringify(settings.system));

  const saveProfile = () => {
    onSettingsChange({ ...settings, profile: profileDraft });
    setMessage(t('profile_saved'));
  };

  const saveNotifications = () => {
    onSettingsChange({ ...settings, notifications: notificationsDraft });
    setMessage(t('notifications_saved'));
  };

  const saveSystem = () => {
    onSettingsChange({ ...settings, system: systemDraft });
    setMessage(t('system_saved'));
  };

  const updatePassword = () => {
    setSecurityError('');

    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setSecurityError(t('password_required'));
      return;
    }

    if (passwordForm.next.length < 8) {
      setSecurityError(t('password_short'));
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setSecurityError(t('password_mismatch'));
      return;
    }

    onSettingsChange({
      ...settings,
      security: {
        ...settings.security,
        lastPasswordUpdate: new Date().toISOString(),
      },
    });

    setPasswordForm({ current: '', next: '', confirm: '' });
    setMessage(t('password_updated'));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 max-w-5xl animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>{t('settings_title')}</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('settings_subtitle')}</p>
      </div>

      {message && <div className="mb-4 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200">{message}</div>}
      {hasUnsaved && <div className="mb-4 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">{t('unsaved_warning')}</div>}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMessage('');
                setSecurityError('');
                setActiveSettingsTab(item.id);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors`}
              style={
                activeSettingsTab === item.id
                  ? { backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }
                  : { color: 'var(--muted)' }
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {activeSettingsTab === 'profile' && (
          <div className="flex-1 rounded-xl p-8 animate-in fade-in duration-200" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
            <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--app-text)' }}>{t('profile_information')}</h2>

            <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('first_name')}</label>
                  <input
                    type="text"
                    value={profileDraft.firstName}
                    onChange={(event) => setProfileDraft((prev) => ({ ...prev, firstName: event.target.value }))}
                    className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
                    style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{t('last_name')}</label>
                  <input
                    type="text"
                    value={profileDraft.lastName}
                    onChange={(event) => setProfileDraft((prev) => ({ ...prev, lastName: event.target.value }))}
                    className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
                    style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('email_address')}</label>
                <input
                  type="email"
                  value={profileDraft.email}
                  onChange={(event) => setProfileDraft((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
                  style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{t('role')}</label>
                <input
                  type="text"
                  disabled
                  value={profileDraft.role}
                  className="w-full rounded-lg px-4 py-2.5 cursor-not-allowed"
                  style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--muted)', border: '1px solid var(--panel-border)', opacity: 0.7 }}
                />
              </div>

              <div className="pt-4 border-t border-[#2d313f] flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDraft(settings.profile);
                    setMessage(t('profile_discarded'));
                  }}
                  className="px-6 py-2.5 rounded-lg font-medium"
                  style={{ color: 'var(--muted)' }}
                >
                  {t('cancel')}
                </button>
                <button type="button" onClick={saveProfile} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
                  {t('save_changes')}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSettingsTab === 'notifications' && (
          <div className="flex-1 rounded-xl p-8 animate-in fade-in duration-200 space-y-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
            <h2 className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('notifications_title')}</h2>

            {[
              { key: 'lowStock', label: t('notification_low_stock') },
              { key: 'orderUpdates', label: t('notification_order_updates') },
              { key: 'weeklyReport', label: t('notification_weekly_report') },
              { key: 'emailEnabled', label: t('notification_email') },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-lg px-4 py-3" style={{ border: '1px solid var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
                <p className="text-sm" style={{ color: 'var(--app-text)' }}>{item.label}</p>
                <Toggle checked={notificationsDraft[item.key]} onChange={() => setNotificationsDraft((prev) => ({ ...prev, [item.key]: !prev[item.key] }))} />
              </div>
            ))}

            <div className="pt-4 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--panel-border)' }}>
              <button type="button" onClick={() => setNotificationsDraft(settings.notifications)} className="px-6 py-2.5 rounded-lg font-medium" style={{ color: 'var(--muted)' }}>
                {t('cancel')}
              </button>
              <button type="button" onClick={saveNotifications} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
                {t('save_changes')}
              </button>
            </div>
          </div>
        )}

        {activeSettingsTab === 'security' && (
          <div className="flex-1 bg-[#1a1d27] border border-[#2d313f] rounded-xl p-8 animate-in fade-in duration-200 space-y-6">
            <h2 className="text-xl font-bold text-white">{t('security_title')}</h2>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('current_password')}</label>
              <input type="password" value={passwordForm.current} onChange={(event) => setPasswordForm((prev) => ({ ...prev, current: event.target.value }))} className="w-full rounded-lg px-4 py-2.5" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('new_password')}</label>
              <input type="password" value={passwordForm.next} onChange={(event) => setPasswordForm((prev) => ({ ...prev, next: event.target.value }))} className="w-full rounded-lg px-4 py-2.5" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('confirm_password')}</label>
              <input type="password" value={passwordForm.confirm} onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm: event.target.value }))} className="w-full rounded-lg px-4 py-2.5" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
            </div>

            {securityError && <p className="text-sm text-red-300">{securityError}</p>}

            <div className="pt-4 border-t border-[#2d313f] flex justify-end">
              <button type="button" onClick={updatePassword} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                {t('update_password')}
              </button>
            </div>
          </div>
        )}

        {activeSettingsTab === 'system' && (
          <div className="flex-1 rounded-xl p-8 animate-in fade-in duration-200 space-y-8" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
            <h2 className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('system_preferences_title')}</h2>

            <div>
              <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--app-text)' }}>{t('appearance')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: 'dark', label: t('dark') },
                  { key: 'light', label: t('light') },
                  { key: 'system', label: t('system') },
                ].map((themeOption) => (
                  <button
                    key={themeOption.key}
                    type="button"
                    onClick={() => {
                      const newSystem = { ...systemDraft, theme: themeOption.key };
                      setSystemDraft(newSystem);
                      onSettingsChange({ ...settings, system: newSystem });
                    }}
                    className="p-4 rounded-lg text-sm font-medium"
                    style={
                      systemDraft.theme === themeOption.key
                        ? { border: '1px solid var(--accent)', color: 'var(--accent-text)', backgroundColor: 'var(--panel-bg)' }
                        : { border: '1px solid var(--panel-border)', color: 'var(--muted)', backgroundColor: 'var(--panel-bg)' }
                    }
                  >
                    {themeOption.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('interface_language')}</label>
                <select
                  value={systemDraft.language}
                  onChange={(event) => setSystemDraft((prev) => ({ ...prev, language: event.target.value }))}
                  className="w-full appearance-none rounded-lg px-4 py-2.5"
                  style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
                >
                  <option value="en">English</option>
                  <option value="fr">Francais</option>
                  <option value="es">Espanol</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('timezone')}</label>
                <select
                  value={systemDraft.timezone}
                  onChange={(event) => setSystemDraft((prev) => ({ ...prev, timezone: event.target.value }))}
                  className="w-full appearance-none rounded-lg px-4 py-2.5"
                  style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
                >
                  <option value="Africa/Abidjan">GMT (Abidjan)</option>
                  <option value="Europe/Paris">UTC+1 (Paris)</option>
                  <option value="America/New_York">UTC-5 (New York)</option>
                </select>
              </div>
            </div>

            <div className="pt-6 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--panel-border)' }}>
              <button type="button" onClick={() => setSystemDraft(settings.system)} className="px-6 py-2.5 rounded-lg font-medium" style={{ color: 'var(--muted)' }}>
                {t('cancel')}
              </button>
              <button type="button" onClick={saveSystem} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
                {t('apply_preferences')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
