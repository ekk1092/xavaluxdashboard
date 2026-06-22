import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { useModalLifecycle } from '../../hooks/useModalLifecycle.js';
import { useData } from '../../context/useData.js';

export default function AddExpenseModal({ isOpen, onClose, t }) {
  useModalLifecycle(isOpen, onClose);
  const { addExpense } = useData();

  const [category, setCategory] = useState('Raw Materials');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('paid');

  const categories = ['Raw Materials', 'Logistics', 'Energy', 'Wages', 'Transport', 'Maintenance', 'Office Supply', 'Others'];

  const handleAdd = () => {
    if (!category || !description || !amount) return;

    // Formatting amount to match currency design
    const formattedAmount = amount.startsWith('$') ? amount : `$${parseFloat(amount).toFixed(2)}`;

    addExpense({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category,
      description,
      amount: formattedAmount,
      status,
    });

    // Reset Form
    setCategory('Raw Materials');
    setDescription('');
    setAmount('');
    setStatus('paid');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="expense-modal-title" className="w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onMouseDown={(event) => event.stopPropagation()} style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '1rem' }}>
        <div className="flex justify-between items-center p-6" style={{ borderBottom: '1px solid var(--panel-border)' }}>
          <h2 id="expense-modal-title" className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('modal_add_expense')}</h2>
          <button onClick={onClose} aria-label={t('close')} className="transition-colors" style={{ color: 'var(--muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <label htmlFor="expense-category" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('expense_category')}</label>
            <div className="relative">
              <select id="expense-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full appearance-none rounded-lg pl-4 pr-10 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
            </div>
          </div>

          <div>
            <label htmlFor="expense-amount" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('expense_amount')} ($)</label>
            <input
              type="number"
              id="expense-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="450.00"
              step="0.01"
              min="0"
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
              style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
            />
          </div>

          <div>
            <label htmlFor="expense-desc" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('expense_description')}</label>
            <textarea
              id="expense-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Purchase of raw materials / logistics invoice"
              rows={3}
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none resize-none"
              style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
            />
          </div>

          <div>
            <label htmlFor="expense-status" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('expense_status')}</label>
            <div className="relative">
              <select id="expense-status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full appearance-none rounded-lg pl-4 pr-10 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}>
                <option value="paid">{t('paid')}</option>
                <option value="unpaid">{t('unpaid')}</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6" style={{ borderTop: '1px solid var(--panel-border)' }}>
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'transparent', border: '1px solid var(--panel-border)', color: 'var(--muted)' }}>
            {t('cancel')}
          </button>
          <button onClick={handleAdd} className="px-5 py-2.5 rounded-lg font-medium transition-colors" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
            {t('add')}
          </button>
        </div>
      </div>
    </div>
  );
}
