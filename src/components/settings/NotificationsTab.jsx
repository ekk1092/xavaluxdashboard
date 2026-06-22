import Toggle from '../shared/Toggle.jsx';

export default function NotificationsTab({ t, notificationsDraft, setNotificationsDraft, onSave, onCancel }) {
  const notificationItems = [
    { key: 'lowStock', label: t('notification_low_stock') },
    { key: 'orderUpdates', label: t('notification_order_updates') },
    { key: 'weeklyReport', label: t('notification_weekly_report') },
    { key: 'emailEnabled', label: t('notification_email') },
  ];

  const getChecked = (key) => {
    switch (key) {
      case 'lowStock':
        return !!notificationsDraft.lowStock;
      case 'orderUpdates':
        return !!notificationsDraft.orderUpdates;
      case 'weeklyReport':
        return !!notificationsDraft.weeklyReport;
      case 'emailEnabled':
        return !!notificationsDraft.emailEnabled;
      default:
        return false;
    }
  };

  const handleToggle = (key) => {
    setNotificationsDraft((prev) => {
      switch (key) {
        case 'lowStock':
          return { ...prev, lowStock: !prev.lowStock };
        case 'orderUpdates':
          return { ...prev, orderUpdates: !prev.orderUpdates };
        case 'weeklyReport':
          return { ...prev, weeklyReport: !prev.weeklyReport };
        case 'emailEnabled':
          return { ...prev, emailEnabled: !prev.emailEnabled };
        default:
          return prev;
      }
    });
  };

  return (
    <div className="flex-1 rounded-xl p-8 animate-in fade-in duration-200 space-y-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
      <h2 className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('notifications_title')}</h2>

      {notificationItems.map((item) => (
        <div key={item.key} className="flex items-center justify-between rounded-lg px-4 py-3" style={{ border: '1px solid var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}>
          <p className="text-sm" style={{ color: 'var(--app-text)' }}>{item.label}</p>
          <Toggle checked={getChecked(item.key)} onChange={() => handleToggle(item.key)} />
        </div>
      ))}

      <div className="pt-4 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--panel-border)' }}>
        <button type="button" onClick={onCancel} className="px-6 py-2.5 rounded-lg font-medium" style={{ color: 'var(--muted)' }}>
          {t('cancel')}
        </button>
        <button type="button" onClick={onSave} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
          {t('save_changes')}
        </button>
      </div>
    </div>
  );
}
