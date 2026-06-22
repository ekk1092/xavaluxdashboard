import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { useModalLifecycle } from '../../hooks/useModalLifecycle.js';
import { useData } from '../../context/useData.js';

export default function AddStockModal({ isOpen, onClose, t }) {
  useModalLifecycle(isOpen, onClose);
  const { addStock } = useData();

  const [selectedSku, setSelectedSku] = useState('');
  const [itemName, setItemName] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [stock, setStock] = useState('');

  const catalogue = [
    { ref: 'AS001', nom: 'Rail', epaisseur: '0.9/1.0/1.4' },
    { ref: 'AS002', nom: 'Dormant', epaisseur: '0.9/1.0/1.4' },
    { ref: 'AS003', nom: 'Lateral', epaisseur: '0.9/1.0/1.4' },
    { ref: 'AS004', nom: 'Central', epaisseur: '0.9/1.0/1.4' },
    { ref: 'AS005', nom: 'Traverse', epaisseur: '0.9/1.0/1.4' },
    { ref: 'AS006', nom: 'Chicanne', epaisseur: '0.9' },
    { ref: 'XS001', nom: 'Lateral', epaisseur: '0.9' },
    { ref: 'XS002', nom: 'Traverse', epaisseur: '0.9' },
    { ref: 'XS003', nom: 'Rail', epaisseur: '0.9' },
    { ref: 'BS001', nom: 'Battant', epaisseur: '1.0' },
    { ref: 'BS002', nom: 'Cadre', epaisseur: '1.0' },
    { ref: 'BS003', nom: 'Parclose', epaisseur: '1.0' },
    { ref: 'FS001', nom: 'Main-courrant', epaisseur: '1.0' },
    { ref: 'CS001', nom: 'Cornien 37X37', epaisseur: '2.6' },
    { ref: 'CS002', nom: 'Cornien 20X20', epaisseur: '1.0' },
    { ref: 'CS003', nom: 'Cornien 30X30', epaisseur: '0.9/2.5' },
    { ref: 'KS001', nom: 'Moustiquaire', epaisseur: '0.9' },
    { ref: 'DS005', nom: 'Battant cuisine', epaisseur: '0.9' },
  ];

  const finishes = ['Naturel', 'Blanc', 'Marron', 'Noir', 'Champg', 'Gris Sable', 'Marron Sable'];

  const handleSkuChange = (event) => {
    const sku = event.target.value;
    setSelectedSku(sku);
    const found = catalogue.find((item) => item.ref === sku);
    if (found) {
      setItemName(found.nom);
      setDimensions(found.epaisseur);
    } else {
      setItemName('');
      setDimensions('');
    }
  };

  const handleAdd = () => {
    if (!selectedSku || !itemName || !selectedFinish || !stock) return;

    addStock({
      name: itemName,
      sku: selectedSku,
      alloy: '6063-T6', // Default
      finish: selectedFinish,
      dimensions: dimensions || 'Standard',
      stock: `${stock} ft`,
      status: Number(stock) > 20 ? 'good' : 'low',
    });

    // Reset form
    setSelectedSku('');
    setItemName('');
    setSelectedFinish('');
    setDimensions('');
    setStock('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title" className="w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onMouseDown={(event) => event.stopPropagation()} style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '1rem' }}>
        <div className="flex justify-between items-center p-6" style={{ borderBottom: '1px solid var(--panel-border)' }}>
          <h2 id="modal-title" className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('modal_add_stock')}</h2>
          <button onClick={onClose} aria-label={t('close')} className="transition-colors" style={{ color: 'var(--muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label htmlFor="sku-select" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('sku') || 'SKU'}</label>
              <div className="relative">
                <select id="sku-select" value={selectedSku} onChange={handleSkuChange} className="w-full appearance-none rounded-lg pl-4 pr-10 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}>
                  <option value="">{t('select_reference') || 'Select reference...'}</option>
                  {catalogue.map((item) => (
                    <option key={item.ref} value={item.ref}>
                      {item.ref} - {item.nom}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
              </div>
            </div>

            <div className="col-span-2">
              <label htmlFor="item-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('item') || 'Item'}</label>
              <input id="item-input" value={itemName} onChange={(event) => setItemName(event.target.value)} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
            </div>

            <div className="col-span-2">
              <label htmlFor="finish-select" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('finish')}</label>
              <div className="relative">
                <select id="finish-select" value={selectedFinish} onChange={(e) => setSelectedFinish(e.target.value)} className="w-full appearance-none rounded-lg pl-4 pr-10 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}>
                  <option value="">{t('select') || 'Select...'}</option>
                  {finishes.map((finish) => (
                    <option key={finish} value={finish}>
                      {finish}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: 'var(--muted)' }} />
              </div>
            </div>

            <div className="col-span-1">
              <label htmlFor="dimensions-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('dimensions')}</label>
              <input id="dimensions-input" value={dimensions} onChange={(event) => setDimensions(event.target.value)} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
            </div>

            <div className="col-span-1">
              <label htmlFor="stock-input" className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>{t('stock_level') || 'Stock Quantity'}</label>
              <input id="stock-input" type="number" value={stock} onChange={(event) => setStock(event.target.value)} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} placeholder="e.g. 50" />
            </div>
          </div>
        </div>
        <div className="p-6 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--panel-border)', backgroundColor: 'var(--panel-bg)', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
          <button onClick={onClose} className="px-4 py-2 font-medium" style={{ color: 'var(--muted)' }}>
            {t('cancel')}
          </button>
          <button onClick={handleAdd} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }} disabled={!selectedSku || !itemName || !selectedFinish || !stock}>
            {t('add')}
          </button>
        </div>
      </div>
    </div>
  );
}
