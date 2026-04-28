export const SETTINGS_STORAGE_KEY = 'xavalux.settings.v1';

export const DEFAULT_SETTINGS = {
  profile: {
    firstName: 'Alex',
    lastName: 'Mercer',
    email: 'alex.mercer@xavalux.com',
    role: 'Warehouse Supervisor',
  },
  notifications: {
    lowStock: true,
    orderUpdates: true,
    weeklyReport: false,
    emailEnabled: true,
  },
  security: {
    lastPasswordUpdate: null,
  },
  system: {
    language: 'en',
    timezone: 'Africa/Abidjan',
    theme: 'light',
  },
};

export const deepMergeSettings = (baseSettings, overrideSettings) => ({
  ...baseSettings,
  ...overrideSettings,
  profile: {
    ...baseSettings.profile,
    ...(overrideSettings?.profile || {}),
  },
  notifications: {
    ...baseSettings.notifications,
    ...(overrideSettings?.notifications || {}),
  },
  security: {
    ...baseSettings.security,
    ...(overrideSettings?.security || {}),
  },
  system: {
    ...baseSettings.system,
    ...(overrideSettings?.system || {}),
  },
});

export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return deepMergeSettings(DEFAULT_SETTINGS, parsed);
  } catch {
    return DEFAULT_SETTINGS;
  }
};
