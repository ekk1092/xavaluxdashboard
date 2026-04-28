import { Plus } from 'lucide-react';
import { useState } from 'react';
import CreateOrderModal from '../modals/CreateOrderModal.jsx';

export default function OrdersPage({ t }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const orders = [
    { id: 'ORD-2023-089', date: 'Oct 24, 2023', customer: 'BuildTech Industries', amount: '$4,250.00', status: t('completed') },
    { id: 'ORD-2023-090', date: 'Oct 25, 2023', customer: 'Apex Construction', amount: '$1,820.00', status: t('processing') },
    { id: 'ORD-2023-091', date: 'Oct 25, 2023', customer: 'Global Supply Co.', amount: '$9,400.00', status: t('pending') },
    { id: 'ORD-2023-092', date: 'Oct 26, 2023', customer: 'Metro Developers', amount: '$650.00', status: t('cancelled') },
  ];

  

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <CreateOrderModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} t={t} />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>{t('orders_title')}</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('orders_subtitle')}</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
          <Plus className="w-5 h-5" />
          <span>{t('create_order')}</span>
        </button>
      </div>

      <div className="flex space-x-6 mb-6" style={{ borderBottom: '1px solid var(--panel-border)' }}>
        {[t('all_orders'), t('pending'), t('processing'), t('completed')].map((tab, index) => (
          <button key={tab} className="pb-4 px-2 font-medium text-sm" style={index === 0 ? { borderBottom: '2px solid var(--accent)', color: 'var(--accent)' } : { color: 'var(--muted)' }}>
            {tab}
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
            <tbody className="divide-y" style={{ borderColor: 'var(--panel-border)' }}>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors group"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--panel-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                >
                  <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4 text-gray-300">{order.date}</td>
                  <td className="px-6 py-4 text-gray-300">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ border: '1px solid var(--panel-border)', color: 'var(--muted)' }}>{order.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="font-medium text-sm" style={{ color: 'var(--muted)' }}>{t('view_details')}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
