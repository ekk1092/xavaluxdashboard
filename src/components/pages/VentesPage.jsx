import { Plus, Trash2, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';
import { useState, useCallback } from 'react';
import AddSaleModal from '../modals/AddSaleModal.jsx';
import { useData } from '../../context/useData.js';

export default function VentesPage({ t }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { sales, deleteSale, searchQuery } = useData();

  const handleCloseModal = useCallback(() => setIsAddModalOpen(false), []);

  const filteredSales = sales.filter(sale => 
    sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
    sale.item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = sales.reduce((sum, sale) => {
    const val = parseFloat(sale.amount.replace(/[^0-9.]/g, '')) || 0;
    return sum + val;
  }, 0);

  const averageSaleValue = sales.length > 0 ? (totalRevenue / sales.length) : 0;
  const transactionsCount = sales.length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <AddSaleModal isOpen={isAddModalOpen} onClose={handleCloseModal} t={t} />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>{t('sales_title')}</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('sales_subtitle')}</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-colors" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
          <Plus className="w-5 h-5" />
          <span>{t('add_sale')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>{t('stat_total_revenue')}</h3>
            <div className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--icon-bg)', color: 'var(--status-good)' }}>
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-xl p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>{t('stat_avg_sale')}</h3>
            <div className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>${averageSaleValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--icon-bg)', color: 'var(--accent)' }}>
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-xl p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>{t('stat_transactions')}</h3>
            <div className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>{transactionsCount}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--icon-bg)', color: 'var(--status-pending)' }}>
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 rounded-xl p-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--app-text)' }}>{t('sales_title')} Trend</h3>
          <div className="h-48 flex items-end space-x-2 sm:space-x-4">
            {[60, 45, 90, 75, 110, 85, 130, 95, 150].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full rounded-t-sm transition-colors" style={{ height: `${(height / 150) * 100}%`, backgroundColor: 'var(--chart-bar)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--chart-bar-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--chart-bar)')}>
                  <div className="w-full h-1" style={{ backgroundColor: 'var(--chart-bar-top)' }}></div>
                </div>
                <span className="text-xs mt-2" style={{ color: 'var(--muted)' }}>W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-6 flex flex-col justify-between" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--app-text)' }}>Sales Channel</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Overview of sales payment methods used by customers.</p>
          </div>
          <div className="space-y-4">
            {['Bank Transfer', 'Credit Card', 'Cash'].map(method => {
              const count = sales.filter(s => s.paymentMethod === method).length;
              const percentage = sales.length > 0 ? (count / sales.length) * 100 : 0;
              return (
                <div key={method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--app-text)' }}>{method}</span>
                    <span style={{ color: 'var(--muted)' }}>{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--panel-border)' }}>
                    <div className="h-2 rounded-full" style={{ width: `${percentage}%`, backgroundColor: method === 'Bank Transfer' ? 'var(--accent)' : method === 'Credit Card' ? 'var(--status-good)' : 'var(--status-pending)' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider" style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--muted)' }}>
                <th className="px-6 py-4 font-medium">{t('order_id')} / {t('date')}</th>
                <th className="px-6 py-4 font-medium">{t('sale_customer')}</th>
                <th className="px-6 py-4 font-medium">{t('sale_item')}</th>
                <th className="px-6 py-4 font-medium">{t('sale_quantity')}</th>
                <th className="px-6 py-4 font-medium">{t('sale_amount')}</th>
                <th className="px-6 py-4 font-medium">{t('payment_method')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center" style={{ color: 'var(--muted)' }}>
                    No sales matching current search criteria.
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--panel-border)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--panel-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold" style={{ color: 'var(--app-text)' }}>{sale.id}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>{sale.date}</div>
                    </td>
                    <td className="px-6 py-4" style={{ color: 'var(--app-text)' }}>{sale.customer}</td>
                    <td className="px-6 py-4" style={{ color: 'var(--app-text)' }}>{sale.item}</td>
                    <td className="px-6 py-4 font-semibold" style={{ color: 'var(--app-text)' }}>{sale.quantity}</td>
                    <td className="px-6 py-4 font-bold" style={{ color: 'var(--status-good)' }}>{sale.amount}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--icon-bg)', color: 'var(--muted)' }}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteSale(sale.id)}
                        className="p-2 rounded-lg transition-colors inline-flex items-center justify-center"
                        style={{ color: 'var(--muted)' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                        title={t('delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
