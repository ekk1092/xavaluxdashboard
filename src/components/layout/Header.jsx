import { Search } from 'lucide-react';
import { useData } from '../../context/useData.js';

export default function Header({ t, profile }) {
  const { searchQuery, setSearchQuery } = useData();

  return (
    <header
      className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 backdrop-blur-sm sticky top-0 z-20"
      style={{ borderBottom: '1px solid var(--panel-border)', backgroundColor: 'var(--panel-bg)' }}
    >
      <div className="relative w-full sm:w-96">
        <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--muted)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('header_search')}
          aria-label={t('header_search')}
          className="w-full border-none rounded-full py-2.5 pl-12 pr-4 focus:outline-none"
          style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)' }}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right hidden md:block">
          <div className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{t('header_role')}</div>
        </div>
        <button className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
          {profile.firstName?.[0] || 'A'}
        </button>
      </div>
    </header>
  );
}
