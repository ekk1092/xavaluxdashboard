import { Plus } from 'lucide-react';
import { useState } from 'react';
import AddStockModal from '../modals/AddStockModal.jsx';

export default function InventoryPage({ t }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const inventoryData = [
    { id: 1, name: 'Angle Profile 30x30', sku: 'SKU033', alloy: '6063-T6', finish: 'Mill Finish', dimensions: '6m', stock: '112 ft', status: 'good' },
    { id: 2, name: 'Aluminium Extrusion 40x40', sku: 'SKU001', alloy: '6063-T6', finish: 'Clear Anodized', dimensions: '6m', stock: '1,250 ft', status: 'good' },
    { id: 3, name: 'U-Channel Standard', sku: 'SKU089', alloy: '6061-T4', finish: 'Powder Coated', dimensions: '3m', stock: '12 ft', status: 'low' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <AddStockModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} t={t} />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>{t('inventory_title')}</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('inventory_subtitle')}</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
          <Plus className="w-5 h-5" />
          <span>{t('add_new_stock')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>{t('total_items_stock')}</h3>
          <div className="text-4xl font-bold" style={{ color: 'var(--app-text)' }}>4,280</div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderLeft: '4px solid #ef4444' }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>{t('low_stock_alerts')}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold" style={{ color: 'var(--app-text)' }}>4</span>
            <span style={{ color: 'var(--muted)' }}>items</span>
          </div>
        </div>

        <div className="bg-[#1a1d27] rounded-xl p-6 border border-[#2d313f]">
          <h3 className="text-gray-400 text-sm font-medium mb-3">{t('unique_skus')}</h3>
          <div className="text-4xl font-bold text-white">9</div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button className="px-4 py-2 rounded-lg" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', color: 'var(--muted)' }}>{t('clear_filters')}</button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b text-xs uppercase tracking-wider" style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--muted)' }}>
                <th className="px-6 py-4 font-medium">{t('item_sku')}</th>
                <th className="px-6 py-4 font-medium">{t('alloy')}</th>
                <th className="px-6 py-4 font-medium">{t('finish')}</th>
                <th className="px-6 py-4 font-medium">{t('dimensions')}</th>
                <th className="px-6 py-4 font-medium">{t('stock_level')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--panel-border)' }}>
              {inventoryData.map((item) => (
                <tr key={item.id} className="hover:bg-[#1f232e] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{item.alloy}</td>
                  <td className="px-6 py-4 text-gray-300">{item.finish}</td>
                  <td className="px-6 py-4 text-gray-300">{item.dimensions}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${item.status === 'good' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-gray-300">{item.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-4">
                      <button className="font-medium" style={{ color: 'var(--accent)' }}>{t('edit')}</button>
                      <button className="font-medium" style={{ color: '#ef4444' }}>{t('delete')}</button>
                    </div>
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
