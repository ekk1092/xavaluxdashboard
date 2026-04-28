export default function SecurityTab({ t, passwordForm, setPasswordForm, onUpdate, error }) {
  return (
    <div className="flex-1 rounded-xl p-8 animate-in fade-in duration-200 space-y-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
      <h2 className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('security_title')}</h2>

      <div>
        <label htmlFor="current-password" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('current_password')}</label>
        <input id="current-password" type="password" value={passwordForm.current} onChange={(event) => setPasswordForm((prev) => ({ ...prev, current: event.target.value }))} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
      </div>
      <div>
        <label htmlFor="new-password" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('new_password')}</label>
        <input id="new-password" type="password" value={passwordForm.next} onChange={(event) => setPasswordForm((prev) => ({ ...prev, next: event.target.value }))} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('confirm_password')}</label>
        <input id="confirm-password" type="password" value={passwordForm.confirm} onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm: event.target.value }))} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
      </div>

      {error && <p className="text-sm" style={{ color: 'var(--danger)' }}>{error}</p>}

      <div className="pt-4 flex justify-end" style={{ borderTop: '1px solid var(--panel-border)' }}>
        <button type="button" onClick={onUpdate} className="px-6 py-2.5 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
          {t('update_password')}
        </button>
      </div>
    </div>
  );
}
