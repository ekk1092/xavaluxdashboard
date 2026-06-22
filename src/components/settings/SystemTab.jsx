const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
];

const TIMEZONES = [
  { value: 'Africa/Abidjan', label: 'GMT (Abidjan)' },
  { value: 'Europe/Paris', label: 'UTC+1 (Paris)' },
  { value: 'America/New_York', label: 'UTC-5 (New York)' },
];

export default function SystemTab({ t, systemDraft, setSystemDraft, settings, onSettingsChange }) {
  const themeOptions = [
    { key: 'dark', label: t('dark') },
    { key: 'light', label: t('light') },
    { key: 'system', label: t('system') },
  ];

  const handleThemeChange = (themeKey) => {
    const newSystem = { ...systemDraft, theme: themeKey };
    setSystemDraft(newSystem);
    onSettingsChange({ ...settings, system: newSystem });
  };

  const handleLanguageChange = (lang) => {
    const newSystem = { ...systemDraft, language: lang };
    setSystemDraft(newSystem);
    onSettingsChange({ ...settings, system: newSystem });
  };

  const handleTimezoneChange = (tz) => {
    const newSystem = { ...systemDraft, timezone: tz };
    setSystemDraft(newSystem);
    onSettingsChange({ ...settings, system: newSystem });
  };

  return (
    <div className="flex-1 rounded-xl p-8 animate-in fade-in duration-200 space-y-8" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
      <h2 className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('system_preferences_title')}</h2>

      <div>
        <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--app-text)' }}>{t('appearance')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeOptions.map((themeOption) => (
            <button
              key={themeOption.key}
              type="button"
              onClick={() => handleThemeChange(themeOption.key)}
              className="p-4 rounded-lg text-sm font-medium transition-all"
              style={
                systemDraft.theme === themeOption.key
                  ? { border: '1px solid var(--accent)', color: 'var(--accent-text)', backgroundColor: 'var(--accent)' }
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
          <label htmlFor="language-select" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('interface_language')}</label>
          <select
            id="language-select"
            value={systemDraft.language}
            onChange={(event) => handleLanguageChange(event.target.value)}
            className="w-full appearance-none rounded-lg px-4 py-2.5 focus:outline-none"
            style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="timezone-select" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('timezone')}</label>
          <select
            id="timezone-select"
            value={systemDraft.timezone}
            onChange={(event) => handleTimezoneChange(event.target.value)}
            className="w-full appearance-none rounded-lg px-4 py-2.5 focus:outline-none"
            style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
