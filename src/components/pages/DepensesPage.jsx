import { Plus, Trash2, CreditCard, DollarSign, AlertCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import AddExpenseModal from '../modals/AddExpenseModal.jsx';
import { useData } from '../../context/useData.js';

export default function DepensesPage({ t }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { expenses, deleteExpense, searchQuery } = useData();

  const handleCloseModal = useCallback(() => setIsAddModalOpen(false), []);

  const filteredExpenses = expenses.filter(exp => 
    exp.category.toLowerCase().includes(searchQuery.toLowerCase()) || 
    exp.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalExpenses = expenses.reduce((sum, exp) => {
    const val = parseFloat(exp.amount.replace(/[^0-9.]/g, '')) || 0;
    return sum + val;
  }, 0);

  const pendingBillsCount = expenses.filter(exp => exp.status === 'unpaid').length;

  // Find top spending category
  const categoryTotals = expenses.reduce((acc, exp) => {
    const val = parseFloat(exp.amount.replace(/[^0-9.]/g, '')) || 0;
    acc[exp.category] = (acc[exp.category] || 0) + val;
    return acc;
  }, {});

  let topCategory = 'None';
  let maxCategoryVal = 0;
  Object.entries(categoryTotals).forEach(([cat, val]) => {
    if (val > maxCategoryVal) {
      maxCategoryVal = val;
      topCategory = cat;
    }
  });

  const getStatusStyle = (status) => {
    if (status === 'paid') {
      return { color: 'var(--status-good)', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)' };
    }
    return { color: 'var(--status-low)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' };
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <AddExpenseModal isOpen={isAddModalOpen} onClose={handleCloseModal} t={t} />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--app-text)' }}>{t('expenses_title')}</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{t('expenses_subtitle')}</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-colors" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
          <Plus className="w-5 h-5" />
          <span>{t('add_expense')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-xl p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>{t('stat_total_expenses')}</h3>
            <div className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--icon-bg)', color: 'var(--status-low)' }}>
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-xl p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>{t('stat_pending_bills')}</h3>
            <div className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>{pendingBillsCount}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--icon-bg)', color: 'var(--status-pending)' }}>
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-xl p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <div>
            <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>{t('stat_top_category')}</h3>
            <div className="text-3xl font-bold" style={{ color: 'var(--app-text)' }}>{topCategory}</div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--icon-bg)', color: 'var(--accent)' }}>
            <CreditCard className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 rounded-xl p-6" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <h3 className="text-lg font-bold mb-6" style={{ color: 'var(--app-text)' }}>Monthly Expenditure</h3>
          <div className="h-48 flex items-end space-x-2 sm:space-x-4">
            {[45, 80, 55, 95, 120, 65, 85, 110, 70].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div className="w-full rounded-t-sm transition-colors" style={{ height: `${(height / 120) * 100}%`, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--status-low)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)')}>
                  <div className="w-full h-1" style={{ backgroundColor: 'var(--status-low)' }}></div>
                </div>
                <span className="text-xs mt-2" style={{ color: 'var(--muted)' }}>W{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-6 flex flex-col justify-between" style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)' }}>
          <div>
            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--app-text)' }}>Expense Breakdown</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Overview of top business expenditure allocations.</p>
          </div>
          <div className="space-y-4">
            {Object.entries(categoryTotals).map(([cat, total]) => {
              const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span style={{ color: 'var(--app-text)' }}>{cat}</span>
                    <span style={{ color: 'var(--muted)' }}>${total.toLocaleString()} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--panel-border)' }}>
                    <div className="h-2 rounded-full" style={{ width: `${percentage}%`, backgroundColor: 'var(--danger)' }}></div>
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
                <th className="px-6 py-4 font-medium">{t('expense_category')}</th>
                <th className="px-6 py-4 font-medium">{t('expense_description')}</th>
                <th className="px-6 py-4 font-medium">{t('expense_amount')}</th>
                <th className="px-6 py-4 font-medium">{t('expense_status')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center" style={{ color: 'var(--muted)' }}>
                    No expenses matching current search criteria.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="transition-colors"
                    style={{ borderBottom: '1px solid var(--panel-border)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--panel-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold" style={{ color: 'var(--app-text)' }}>{exp.id}</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>{exp.date}</div>
                    </td>
                    <td className="px-6 py-4" style={{ color: 'var(--app-text)' }}>{exp.category}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--app-text)' }}>{exp.description}</td>
                    <td className="px-6 py-4 font-bold" style={{ color: 'var(--app-text)' }}>{exp.amount}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase border" style={getStatusStyle(exp.status)}>
                        {t(exp.status) || exp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteExpense(exp.id)}
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
