export default function ProfileTab({ t, profileDraft, setProfileDraft, onSave, onCancel }) {
  return (
    <div className="flex-1 rounded-xl p-8 animate-in fade-in duration-200" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
      <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--app-text)' }}>{t('profile_information')}</h2>

      <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="first-name-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('first_name')}</label>
            <input
              id="first-name-input"
              type="text"
              value={profileDraft.firstName}
              onChange={(event) => setProfileDraft((prev) => ({ ...prev, firstName: event.target.value }))}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
              style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
            />
          </div>
          <div>
            <label htmlFor="last-name-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('last_name')}</label>
            <input
              id="last-name-input"
              type="text"
              value={profileDraft.lastName}
              onChange={(event) => setProfileDraft((prev) => ({ ...prev, lastName: event.target.value }))}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
              style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('email_address')}</label>
          <input
            id="email-input"
            type="email"
            value={profileDraft.email}
            onChange={(event) => setProfileDraft((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
            style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
          />
        </div>

        <div>
          <label htmlFor="role-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('role')}</label>
          <input
            id="role-input"
            type="text"
            disabled
            value={profileDraft.role}
            className="w-full rounded-lg px-4 py-2.5 cursor-not-allowed"
            style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--muted)', border: '1px solid var(--panel-border)', opacity: 0.7 }}
          />
        </div>

        <div className="pt-4 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--panel-border)' }}>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg font-medium"
            style={{ color: 'var(--muted)' }}
          >
            {t('cancel')}
          </button>
          <button type="button" onClick={onSave} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
            {t('save_changes')}
          </button>
        </div>
      </form>
    </div>
  );
}
