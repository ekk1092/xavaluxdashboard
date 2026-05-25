import { Plus } from 'lucide-react';
import { useState, useCallback } from 'react';
import CreateOrderModal from '../modals/CreateOrderModal.jsx';
import { useData } from '../../context/useData.js';

export default function OrdersPage({ t }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeOrderTab, setActiveOrderTab] = useState('all');
  const { orders, searchQuery } = useData();

  const handleCloseModal = useCallback(() => setIsCreateModalOpen(false), []);

  const mappedOrders = orders.map(o => ({
    ...o,
    statusLabel: t(o.status) || o.status
  }));

  const searchedOrders = mappedOrders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    o.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs = [
    { id: 'all', label: t('all_orders') },
    { id: 'pending', label: t('pending') },
    { id: 'processing', label: t('processing') },
    { id: 'completed', label: t('completed') },
  ];

  const filteredOrders = activeOrderTab === 'all' ? searchedOrders : searchedOrders.filter((o) => o.status === activeOrderTab);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return { color: 'var(--status-good)', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' };
      case 'processing':
        return { color: 'var(--status-processing)', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'cancelled':
        return { color: 'var(--status-cancelled)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' };
      case 'pending':
      default:
        return { color: 'var(--status-pending)', backgroundColor: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)' };
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <CreateOrderModal isOpen={isCreateModalOpen} onClose={handleCloseModal} t={t} />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>{t('orders_title')}</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('orders_subtitle')}</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-colors" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
          <Plus className="w-5 h-5" />
          <span>{t('create_order')}</span>
        </button>
      </div>

      <div className="flex space-x-6 mb-6" style={{ borderBottom: '1px solid var(--panel-border)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveOrderTab(tab.id)}
            className="pb-4 px-2 font-medium text-sm transition-colors"
            style={activeOrderTab === tab.id ? { borderBottom: '2px solid var(--accent)', color: 'var(--accent)' } : { color: 'var(--muted)' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider" style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--muted)' }}>
                <th className="px-6 py-4 font-medium">{t('order_id')}</th>
                <th className="px-6 py-4 font-medium">{t('date')}</th>
                <th className="px-6 py-4 font-medium">{t('customer')}</th>
                <th className="px-6 py-4 font-medium">{t('total_amount')}</th>
                <th className="px-6 py-4 font-medium">{t('status')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center" style={{ color: 'var(--muted)' }}>
                    {t('no_orders_found') || 'No orders found for this filter.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--panel-border)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--panel-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  >
                    <td className="px-6 py-4 font-medium" style={{ color: 'var(--app-text)' }}>{order.id}</td>
                    <td className="px-6 py-4" style={{ color: 'var(--app-text)' }}>{order.date}</td>
                    <td className="px-6 py-4" style={{ color: 'var(--app-text)' }}>{order.customer}</td>
                    <td className="px-6 py-4 font-medium" style={{ color: 'var(--app-text)' }}>{order.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={getStatusStyle(order.status)}>{order.statusLabel}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="font-medium text-sm" style={{ color: 'var(--accent)' }}>{t('view_details')}</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
