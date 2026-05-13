import { Bell, Monitor, Shield, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProfileTab from './ProfileTab.jsx';
import NotificationsTab from './NotificationsTab.jsx';
import SecurityTab from './SecurityTab.jsx';
import SystemTab from './SystemTab.jsx';

export default function SettingsPage({ t, settings, onSettingsChange }) {
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
  
  const [profileDraft, setProfileDraft] = useState(settings.profile);
  const [notificationsDraft, setNotificationsDraft] = useState(settings.notifications);
  const [systemDraft, setSystemDraft] = useState(settings.system);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  
  const [message, setMessageState] = useState('');
  const setMessage = (msg) => {
    setMessageState(msg);
    if (msg) {
      setTimeout(() => {
        setMessageState('');
      }, 3000);
    }
  };
  
  const [securityError, setSecurityError] = useState('');

  // Sync draft states when settings prop changes (e.g. from SystemTab immediate saves)
  useEffect(() => {
    setProfileDraft(settings.profile);
    setNotificationsDraft(settings.notifications);
    setSystemDraft(settings.system);
  }, [settings]);

  const saveProfile = () => {
    onSettingsChange({ ...settings, profile: profileDraft });
    setMessage(t('profile_saved'));
  };

  const saveNotifications = () => {
    onSettingsChange({ ...settings, notifications: notificationsDraft });
    setMessage(t('notifications_saved'));
  };

  const updatePassword = () => {
    if (!passwordForm.current || !passwordForm.next || !passwordForm.confirm) {
      setSecurityError(t('security_error_empty'));
      return;
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setSecurityError(t('security_error_mismatch'));
      return;
    }
    setSecurityError('');
    onSettingsChange({
      ...settings,
      security: { ...settings.security, lastPasswordUpdate: new Date().toISOString() },
    });
    setMessage(t('security_saved'));
    setPasswordForm({ current: '', next: '', confirm: '' });
  };

  const tabs = [
    { id: 'profile', label: t('tab_profile'), icon: User },
    { id: 'notifications', label: t('tab_notifications'), icon: Bell },
    { id: 'security', label: t('tab_security'), icon: Shield },
    { id: 'system', label: t('tab_system'), icon: Monitor },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>{t('settings_title')}</h1>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('settings_subtitle')}</p>
      </div>

      {message && (
        <div className="mb-6 p-4 rounded-lg animate-in slide-in-from-top-4 duration-300" style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)', color: 'var(--success-text)' }}>
          {message}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSettingsTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSettingsTab(tab.id);
                  setMessage('');
                  setSecurityError('');
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors"
                style={isActive ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' } : { color: 'var(--muted)' }}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-w-0">
          {activeSettingsTab === 'profile' && (
            <ProfileTab 
              t={t} 
              profileDraft={profileDraft} 
              setProfileDraft={setProfileDraft} 
              onSave={saveProfile} 
              onCancel={() => setProfileDraft(settings.profile)} 
            />
          )}

          {activeSettingsTab === 'notifications' && (
            <NotificationsTab 
              t={t} 
              notificationsDraft={notificationsDraft} 
              setNotificationsDraft={setNotificationsDraft} 
              onSave={saveNotifications} 
              onCancel={() => setNotificationsDraft(settings.notifications)} 
            />
          )}

          {activeSettingsTab === 'security' && (
            <SecurityTab 
              t={t} 
              passwordForm={passwordForm} 
              setPasswordForm={setPasswordForm} 
              onUpdate={updatePassword} 
              error={securityError} 
            />
          )}

          {activeSettingsTab === 'system' && (
            <SystemTab 
              t={t} 
              systemDraft={systemDraft} 
              setSystemDraft={setSystemDraft} 
              settings={settings} 
              onSettingsChange={onSettingsChange} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
