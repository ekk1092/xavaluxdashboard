import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { useModalLifecycle } from '../../hooks/useModalLifecycle.js';
import { useData } from '../../context/useData.js';

export default function AddSaleModal({ isOpen, onClose, t }) {
  useModalLifecycle(isOpen, onClose);
  const { addSale, inventory } = useData();

  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [customer, setCustomer] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');

  const paymentMethods = ['Bank Transfer', 'Credit Card', 'Cash', 'Cheque'];

  const handleItemChange = (event) => {
    const itemValue = event.target.value;
    setSelectedItem(itemValue);
    
    // Auto-calculate estimate amount based on some heuristic or leave it editable
    const matched = inventory.find(i => i.name === itemValue);
    if (matched) {
      // If we had unit prices we'd multiply, but since we don't, we can pre-fill a sensible default or let the user decide.
    }
  };

  const handleAdd = () => {
    if (!selectedItem || !quantity || !amount || !customer) return;

    // Formatting amount to match currency design
    const formattedAmount = amount.startsWith('$') ? amount : `$${parseFloat(amount).toFixed(2)}`;

    addSale({
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      item: selectedItem,
      quantity: parseInt(quantity, 10),
      amount: formattedAmount,
      customer,
      paymentMethod,
    });

    // Reset Form
    setSelectedItem('');
    setQuantity('');
    setAmount('');
    setCustomer('');
    setPaymentMethod('Bank Transfer');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="sale-modal-title" className="w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onMouseDown={(event) => event.stopPropagation()} style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '1rem' }}>
        <div className="flex justify-between items-center p-6" style={{ borderBottom: '1px solid var(--panel-border)' }}>
          <h2 id="sale-modal-title" className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('modal_add_sale')}</h2>
          <button onClick={onClose} aria-label={t('close')} className="transition-colors" style={{ color: 'var(--muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <label htmlFor="sale-item" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('sale_item')}</label>
            <div className="relative">
              <select id="sale-item" value={selectedItem} onChange={handleItemChange} className="w-full appearance-none rounded-lg pl-4 pr-10 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}>
                <option value="">{t('select')}</option>
                {inventory.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name} ({item.sku})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sale-quantity" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('sale_quantity')}</label>
              <input
                type="number"
                id="sale-quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="100"
                min="1"
                className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
                style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
              />
            </div>
            <div>
              <label htmlFor="sale-amount" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('sale_amount')} ($)</label>
              <input
                type="number"
                id="sale-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1200.00"
                step="0.01"
                min="0"
                className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
                style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="sale-customer" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('sale_customer')}</label>
            <input
              type="text"
              id="sale-customer"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="e.g. BuildTech Industries"
              className="w-full rounded-lg px-4 py-2.5 focus:outline-none"
              style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}
            />
          </div>

          <div>
            <label htmlFor="sale-payment" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('payment_method')}</label>
            <div className="relative">
              <select id="sale-payment" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full appearance-none rounded-lg pl-4 pr-10 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
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
