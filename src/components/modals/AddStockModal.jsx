import { ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { useModalLifecycle } from '../../hooks/useModalLifecycle.js';

export default function AddStockModal({ isOpen, onClose, t }) {
  useModalLifecycle(isOpen, onClose);
  const [selectedSku, setSelectedSku] = useState('');
  const [itemName, setItemName] = useState('');
  const [dimensions, setDimensions] = useState('');

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
      <div className="w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onMouseDown={(event) => event.stopPropagation()} style={{ backgroundColor: 'var(--panel-bg)', border: '1px solid var(--panel-border)', borderRadius: '1rem' }}>
        <div className="flex justify-between items-center p-6" style={{ borderBottom: '1px solid var(--panel-border)' }}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--app-text)' }}>{t('modal_add_stock')}</h2>
          <button onClick={onClose} aria-label={t('close')} className="transition-colors" style={{ color: 'var(--muted)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">SKU</label>
              <div className="relative">
                <select value={selectedSku} onChange={handleSkuChange} className="w-full appearance-none rounded-lg pl-4 pr-10 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}>
                  <option value="">Select reference...</option>
                  {catalogue.map((item) => (
                    <option key={item.ref} value={item.ref}>
                      {item.ref} - {item.nom}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Item</label>
              <input value={itemName} onChange={(event) => setItemName(event.target.value)} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Finish / Color</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-lg pl-4 pr-10 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }}>
                  <option value="">Select...</option>
                  {finishes.map((finish) => (
                    <option key={finish} value={finish}>
                      {finish}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">{t('dimensions')}</label>
              <input value={dimensions} onChange={(event) => setDimensions(event.target.value)} className="w-full rounded-lg px-4 py-2.5 focus:outline-none" style={{ backgroundColor: 'var(--panel-bg)', color: 'var(--app-text)', border: '1px solid var(--panel-border)' }} />
            </div>
          </div>
        </div>
        <div className="p-6 flex justify-end space-x-4" style={{ borderTop: '1px solid var(--panel-border)', backgroundColor: 'var(--panel-bg)', borderBottomLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
          <button onClick={onClose} className="px-4 py-2 font-medium" style={{ color: 'var(--muted)' }}>
            {t('cancel')}
          </button>
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
            {t('add')}
          </button>
        </div>
      </div>
    </div>
  );
}
