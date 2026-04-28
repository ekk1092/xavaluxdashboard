import { X } from 'lucide-react';
import { useState } from 'react';
import { useModalLifecycle } from '../../hooks/useModalLifecycle.js';
import { useData } from '../../context/DataContext.jsx';

export default function CreateOrderModal({ isOpen, onClose, t }) {
  useModalLifecycle(isOpen, onClose);
  const { addOrder } = useData();

  const [customer, setCustomer] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('pending');

  const handleCreate = () => {
    if (!customer || !amount) return;

    addOrder({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      customer,
      amount: `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      status,
    });

    setCustomer('');
    setAmount('');
    setStatus('pending');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onMouseDown={(event) => event.stopPropagation()} style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '1rem' }}>
        <div className="flex justify-between items-center p-6" style={{ borderBottom: '1px solid var(--panel-border)' }}>
          <h2 id="modal-title" className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('modal_create_order')}</h2>
          <button onClick={onClose} aria-label={t('close')} className="transition-colors" style={{ color: 'var(--muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <label htmlFor="customer-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('customer')}</label>
            <input id="customer-input" value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} placeholder="e.g. BuildTech Industries" />
          </div>

          <div>
            <label htmlFor="amount-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('total_amount') || 'Total Amount'}</label>
            <input id="amount-input" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} placeholder="e.g. 1500.00" />
          </div>

          <div>
            <label htmlFor="status-select" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('status')}</label>
            <select id="status-select" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}>
              <option value="pending">{t('pending')}</option>
              <option value="processing">{t('processing')}</option>
              <option value="completed">{t('completed')}</option>
            </select>
          </div>
        </div>

        <div className="p-6 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--panel-border)', backgroundColor: 'var(--panel-bg)', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
          <button onClick={onClose} className="px-4 py-2 font-medium" style={{ color: 'var(--muted)' }}>
            {t('cancel')}
          </button>
          <button onClick={handleCreate} disabled={!customer || !amount} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
            {t('save_order')}
          </button>
        </div>
      </div>
    </div>
  );
}
