import { X } from 'lucide-react';
import { useModalLifecycle } from '../../hooks/useModalLifecycle.js';

export default function OrderDetailsModal({ isOpen, onClose, order, t, getStatusStyle }) {
  useModalLifecycle(isOpen, onClose);

  if (!isOpen || !order) return null;

  const mockItems = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onMouseDown={(event) => event.stopPropagation()} style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '1rem' }}>
        <div className="flex justify-between items-center p-6" style={{ borderBottom: '1px solid var(--panel-border)' }}>
          <h2 id="modal-title" className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>
            {t('order_details') || 'Order Details'} - {order.id}
          </h2>
          <button onClick={onClose} aria-label={t('close')} className="transition-colors" style={{ color: 'var(--muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{t('customer')}</p>
              <p className="text-base font-semibold mt-1" style={{ color: 'var(--app-text)' }}>{order.customer}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{t('status')}</p>
              <div className="mt-1">
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={getStatusStyle(order.status)}>
                  {order.statusLabel}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{t('date')}</p>
              <p className="text-sm mt-1" style={{ color: 'var(--app-text)' }}>{order.date}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted)' }}>{t('total_amount') || 'Total Amount'}</p>
              <p className="text-base font-bold mt-1" style={{ color: 'var(--accent)' }}>{order.amount}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem' }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--app-text)' }}>{t('items') || 'Items'}</h3>
            <div className="space-y-3">
              {mockItems.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  No items available for this order.
                </p>
              ) : (
                mockItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-lg" style={{ border: '1px solid var(--panel-border)', backgroundColor: 'var(--panel-hover)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>{item.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{t('quantity') || 'Quantity'}: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--app-text)' }}>{item.price}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-6 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--panel-border)', backgroundColor: 'var(--panel-bg)', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
            {t('close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
