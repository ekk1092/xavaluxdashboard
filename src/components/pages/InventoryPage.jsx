import { Plus } from 'lucide-react';
import { useState, useCallback } from 'react';
import AddStockModal from '../modals/AddStockModal.jsx';
import { useData } from '../../context/DataContext.jsx';

export default function InventoryPage({ t }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { inventory, deleteStock, searchQuery } = useData();

  const handleCloseModal = useCallback(() => setIsAddModalOpen(false), []);

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStock = inventory.reduce((sum, item) => {
    const value = parseInt(item.stock.replace(/[^0-9]/g, '')) || 0;
    return sum + value;
  }, 0);

  const lowStockCount = inventory.filter(item => item.status === 'low').length;
  const uniqueSkusCount = new Set(inventory.map(item => item.sku)).size;

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <AddStockModal isOpen={isAddModalOpen} onClose={handleCloseModal} t={t} />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>{t('inventory_title')}</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('inventory_subtitle')}</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-colors" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
          <Plus className="w-5 h-5" />
          <span>{t('add_new_stock')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>{t('total_items_stock')}</h3>
          <div className="text-4xl font-bold" style={{ color: 'var(--app-text)' }}>{totalStock.toLocaleString()}</div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderLeft: '4px solid var(--danger)' }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>{t('low_stock_alerts')}</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold" style={{ color: 'var(--app-text)' }}>{lowStockCount}</span>
            <span style={{ color: 'var(--muted)' }}>{t('items') || 'items'}</span>
          </div>
        </div>

        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--muted)' }}>{t('unique_skus')}</h3>
          <div className="text-4xl font-bold" style={{ color: 'var(--app-text)' }}>{uniqueSkusCount}</div>
        </div>
      </div>

      <div className="flex space-x-4 mb-6">
        <button className="px-4 py-2 rounded-lg transition-colors" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', color: 'var(--muted)' }}>{t('clear_filters')}</button>
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
            <tbody>
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center" style={{ color: 'var(--muted)' }}>
                    {t('no_items_found') || 'No items found in inventory.'}
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--panel-border)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--panel-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium" style={{ color: 'var(--app-text)' }}>{item.name}</div>
                      <div className="text-sm" style={{ color: 'var(--muted)' }}>{item.sku}</div>
                    </td>
                    <td className="px-6 py-4" style={{ color: 'var(--app-text)' }}>{item.alloy}</td>
                    <td className="px-6 py-4" style={{ color: 'var(--app-text)' }}>{item.finish}</td>
                    <td className="px-6 py-4" style={{ color: 'var(--app-text)' }}>{item.dimensions}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.status === 'good' ? 'var(--status-good)' : 'var(--status-low)' }}></span>
                        <span style={{ color: 'var(--app-text)' }}>{item.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-4">
                        <button className="font-medium" style={{ color: 'var(--accent)' }}>{t('edit')}</button>
                        <button onClick={() => deleteStock(item.id)} className="font-medium" style={{ color: 'var(--danger)' }}>{t('delete')}</button>
                      </div>
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
