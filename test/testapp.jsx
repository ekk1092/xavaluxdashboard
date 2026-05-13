import React, { useState } from 'react';
import {
  LayoutDashboard,
  Box,
  ClipboardList,
  Settings as SettingsIcon,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  Activity,
  TrendingUp,
  Package,
  Truck,
  Bell,
  User,
  Shield,
  Layers,
  X,
  Sparkles,
  Loader2
} from 'lucide-react';

const getGeminiApiKey = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY;
  }

  if (typeof process !== 'undefined' && process.env?.REACT_APP_GEMINI_API_KEY) {
    return process.env.REACT_APP_GEMINI_API_KEY;
  }

  return '';
};

const copyTextToClipboard = async (text) => {
  if (!text) return;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const fallbackField = document.createElement('textarea');
  fallbackField.value = text;
  fallbackField.setAttribute('readonly', 'true');
  fallbackField.style.position = 'absolute';
  fallbackField.style.left = '-9999px';
  document.body.appendChild(fallbackField);
  fallbackField.select();
  document.execCommand('copy');
  document.body.removeChild(fallbackField);
};

const useModalLifecycle = (isOpen, onClose) => {
  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);
};

// --- API Helper ---
const callGemini = async (prompt) => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('AI configuration is missing. Set VITE_GEMINI_API_KEY or REACT_APP_GEMINI_API_KEY.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const requestController = new AbortController();
  const timeoutId = setTimeout(() => requestController.abort(), 20000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: requestController.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const apiMessage = data?.error?.message;
      throw new Error(apiMessage || `Gemini request failed (${res.status})`);
    }

    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || '')
      .join('')
      .trim();

    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    return text;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('The AI request timed out. Please try again.');
    }

    throw new Error(error?.message || 'The AI service is unavailable right now.');
  } finally {
    clearTimeout(timeoutId);
  }
};

// --- Layout & Shared Components ---

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Box },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="w-full lg:w-64 lg:h-screen bg-[#0f111a] flex flex-col border-r border-[#1f222e] text-gray-300">
      <div className="p-6 flex items-center space-x-3 text-white">
        <Layers className="w-8 h-8 text-cyan-400" />
        <span className="text-xl font-bold tracking-wider">XAVALUX</span>
      </div>

      <nav className="flex flex-row lg:flex-col flex-1 px-4 py-4 gap-2 overflow-x-auto lg:overflow-visible">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 lg:w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-blue-600 text-white'
                : 'hover:bg-[#1f222e] text-gray-400 hover:text-gray-200'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 mt-auto hidden lg:block">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
          N
        </div>
      </div>
    </div>
  );
};

const Header = () => (
  <header className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 border-b border-[#1f222e]/60 bg-[#13151f]/80 backdrop-blur-sm sticky top-0 z-20">
    <div className="relative w-full sm:w-96">
      <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        placeholder="Search by SKU, Name, Finish..."
        aria-label="Search inventory"
        className="w-full bg-[#1f222e] text-gray-300 border-none rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>

    <div className="flex items-center space-x-4">
      <div className="text-right hidden md:block">
        <div className="text-sm font-medium text-gray-300">Warehouse Supervisor</div>
      </div>
      <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition-colors">
        A
      </button>
    </div>
  </header>
);

// --- Modals ---

const AddStockModal = ({ isOpen, onClose }) => {
  useModalLifecycle(isOpen, onClose);
  const [selectedSku, setSelectedSku] = useState("");
  const [itemName, setItemName] = useState("");
  const [dimensions, setDimensions] = useState("");

  const catalogue = [
    { ref: "AS001", nom: "Rail", epaisseur: "0.9/1.0/1.4" },
    { ref: "AS002", nom: "Dormant", epaisseur: "0.9/1.0/1.4" },
    { ref: "AS003", nom: "Lateral", epaisseur: "0.9/1.0/1.4" },
    { ref: "AS004", nom: "Central", epaisseur: "0.9/1.0/1.4" },
    { ref: "AS005", nom: "Traverse", epaisseur: "0.9/1.0/1.4" },
    { ref: "AS006", nom: "Chicanne", epaisseur: "0.9" },
    { ref: "XS001", nom: "Lateral", epaisseur: "0.9" },
    { ref: "XS002", nom: "Traverse", epaisseur: "0.9" },
    { ref: "XS003", nom: "Rail", epaisseur: "0.9" },
    { ref: "BS001", nom: "Battant", epaisseur: "1.0" },
    { ref: "BS002", nom: "Cadre", epaisseur: "1.0" },
    { ref: "BS003", nom: "Parclose", epaisseur: "1.0" },
    { ref: "FS001", nom: "Main-courrant", epaisseur: "1.0" },
    { ref: "CS001", nom: "Cornien 37X37", epaisseur: "2.6" },
    { ref: "CS002", nom: "Cornien 20X20", epaisseur: "1.0" },
    { ref: "CS003", nom: "Cornien 30X30", epaisseur: "0.9/2.5" },
    { ref: "KS001", nom: "Moustiquaire", epaisseur: "0.9" },
    { ref: "DS005", nom: "Battant cuisine", epaisseur: "0.9" }
  ];

  const finishes = ["Naturel", "Blanc", "Marron", "Noir", "Champg", "Gris Sable", "Marron Sable"];

  const handleSkuChange = (e) => {
    const sku = e.target.value;
    setSelectedSku(sku);
    const found = catalogue.find(item => item.ref === sku);
    if (found) {
      setItemName(found.nom);
      setDimensions(found.epaisseur);
    } else {
      setItemName("");
      setDimensions("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
      <div className="bg-[#1a1d27] border border-[#2d313f] rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-[#2d313f]">
          <h2 className="text-xl font-bold text-white">Ajouter un nouveau stock</h2>
          <button onClick={onClose} aria-label="Close add stock modal" className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">SKU / Référence (Depuis le catalogue)</label>
              <div className="relative">
                <select
                  value={selectedSku}
                  onChange={handleSkuChange}
                  className="w-full appearance-none bg-[#11131a] border border-[#2d313f] text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Sélectionner une référence...</option>
                  {catalogue.map((item, i) => (
                    <option key={i} value={item.ref}>{item.ref} - {item.nom}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Nom de l'article</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Saisi automatiquement..."
                className="w-full bg-[#11131a] border border-[#2d313f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Finition / Couleur</label>
              <div className="relative">
                <select className="w-full appearance-none bg-[#11131a] border border-[#2d313f] text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="">Sélectionner...</option>
                  {finishes.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Épaisseur / Dimensions</label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="ex: 1.0"
                className="w-full bg-[#11131a] border border-[#2d313f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Alliage</label>
              <div className="relative">
                <select className="w-full appearance-none bg-[#11131a] border border-[#2d313f] text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option>6063-T6</option>
                  <option>6061-T4</option>
                  <option>Custom</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Stock Initial</label>
              <input type="text" placeholder="ex: 100 ft" className="w-full bg-[#11131a] border border-[#2d313f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Statut</label>
              <div className="relative">
                <select className="w-full appearance-none bg-[#11131a] border border-[#2d313f] text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="good">Bon</option>
                  <option value="low">Stock faible</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#2d313f] flex justify-end space-x-4 bg-[#1a1d27] rounded-b-xl shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors">
            Annuler
          </button>
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateOrderModal = ({ isOpen, onClose }) => {
  useModalLifecycle(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
      <div className="bg-[#1a1d27] border border-[#2d313f] rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-[#2d313f]">
          <h2 className="text-xl font-bold text-white">Create New Order</h2>
          <button onClick={onClose} aria-label="Close create order modal" className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Customer Name</label>
            <input
              type="text"
              placeholder="e.g. BuildTech Industries"
              className="w-full bg-[#11131a] border border-[#2d313f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Select Item</label>
              <div className="relative">
                <select className="w-full appearance-none bg-[#11131a] border border-[#2d313f] text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option>Angle Profile 30x30</option>
                  <option>Aluminium Extrusion 40x40</option>
                  <option>U-Channel Standard</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Quantity (ft)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full bg-[#11131a] border border-[#2d313f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Initial Status</label>
            <div className="relative">
              <select className="w-full appearance-none bg-[#11131a] border border-[#2d313f] text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                <option>Pending</option>
                <option>Processing</option>
                <option>Completed</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#2d313f] flex justify-end space-x-4 bg-[#1a1d27] rounded-b-xl shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            Save Order
          </button>
        </div>
      </div>
    </div>
  );
};

const EmailDraftModal = ({ isOpen, onClose, order }) => {
  const [draft, setDraft] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftError, setDraftError] = useState("");

  useModalLifecycle(isOpen, onClose);

  React.useEffect(() => {
    if (isOpen && order) {
      generateDraft();
    } else {
      setDraft("");
      setDraftError("");
      setIsDrafting(false);
    }
  }, [isOpen, order]);

  const generateDraft = async () => {
    setIsDrafting(true);
    setDraftError("");

    try {
      const prompt = `Rédige un e-mail professionnel et chaleureux en français destiné au client "${order.customer}". L'e-mail concerne leur commande n°${order.id} d'un montant de ${order.amount}. Le statut actuel de la commande est : "${order.status}". L'expéditeur est "Xavier de Xavalux". L'e-mail doit comporter un objet approprié, être prêt à être envoyé, et ne contenir que l'e-mail (pas d'intro ou de conclusion de l'IA).`;
      const result = await callGemini(prompt);
      setDraft(result);
    } catch (error) {
      setDraftError(error.message || 'Unable to generate the draft.');
      setDraft('');
    } finally {
      setIsDrafting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onMouseDown={onClose}>
      <div className="bg-[#1a1d27] border border-[#2d313f] rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-[#2d313f]">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Brouillon d'e-mail IA</h2>
          </div>
          <button onClick={onClose} aria-label="Close email draft modal" className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isDrafting ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <p className="text-gray-400">L'IA rédige votre e-mail pour {order?.customer}...</p>
            </div>
          ) : draftError ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {draftError}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-2">Voici une proposition de message générée par Gemini :</p>
              <textarea
                className="w-full h-64 bg-[#11131a] border border-[#2d313f] text-gray-200 rounded-lg p-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-sans"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#2d313f] flex justify-end space-x-4 bg-[#1a1d27] rounded-b-xl shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors">
            Fermer
          </button>
          <button
            onClick={async () => {
              await copyTextToClipboard(draft);
              onClose();
            }}
            disabled={isDrafting || !draft}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Copier le texte</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Page Components ---

const Dashboard = () => {
  const [aiSummary, setAiSummary] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");

  const generateSummary = async () => {
    setIsLoadingAi(true);
    setAiError("");

    try {
      const prompt = "En tant qu'assistant IA expert en gestion d'entrepôt, analyse ces métriques et rédige un court paragraphe (2 phrases maximum) de recommandations en français : Valeur totale 245K$, 1240 produits en stock, 12 références en rupture critique, 8 expéditions en transit. Sois professionnel et concis.";
      const result = await callGemini(prompt);
      setAiSummary(result);
    } catch (error) {
      setAiSummary(null);
      setAiError(error.message || 'Unable to generate the summary.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, Xavier</h1>
          <p className="text-gray-400 text-sm">Here's what's happening with your inventory today.</p>
        </div>
        <button
          onClick={generateSummary}
          disabled={isLoadingAi}
          className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-colors disabled:opacity-50"
        >
          {isLoadingAi ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          <span>✨ IA: Analyser l'inventaire</span>
        </button>
      </div>

      {aiSummary && (
        <div className="mb-8 p-5 bg-gradient-to-r from-purple-900/40 to-[#1a1d27] border border-purple-500/30 rounded-xl flex gap-4 animate-in fade-in slide-in-from-top-4">
          <div className="mt-1">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-medium mb-1">Aperçu Intelligent</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{aiSummary}</p>
          </div>
        </div>
      )}

      {aiError && (
        <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {aiError}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Value', value: '$245K', icon: TrendingUp, color: 'text-green-500' },
          { label: 'Total Products', value: '1,240', icon: Package, color: 'text-blue-500' },
          { label: 'Low Stock', value: '12', icon: Activity, color: 'text-red-500' },
          { label: 'In Transit', value: '8', icon: Truck, color: 'text-yellow-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1a1d27] rounded-xl p-6 border border-[#2d313f] flex items-center justify-between hover:border-gray-600 transition-colors">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-[#252a36] ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#1a1d27] rounded-xl border border-[#2d313f] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Stock Movement</h3>
            <select className="bg-[#252a36] text-gray-300 text-sm py-1 px-3 rounded border border-[#2d313f] focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end space-x-2 sm:space-x-4">
            {/* Fake Bar Chart */}
            {[40, 70, 45, 90, 65, 85, 110].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group">
                <div
                  className="w-full bg-blue-600/20 group-hover:bg-blue-500 transition-colors rounded-t-sm"
                  style={{ height: `${height}%` }}
                >
                  <div className="w-full h-1 bg-blue-500"></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-[#1a1d27] rounded-xl border border-[#2d313f] p-6">
          <h3 className="text-lg font-bold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { text: 'Restocked Aluminium 40x40', time: '2 mins ago', type: 'add' },
              { text: 'Order #892 dispatched', time: '1 hour ago', type: 'ship' },
              { text: 'Low stock alert: U-Channel', time: '3 hours ago', type: 'alert' },
              { text: 'New shipment received', time: '5 hours ago', type: 'add' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className={`mt-1 w-2 h-2 rounded-full ${activity.type === 'add' ? 'bg-green-500' :
                  activity.type === 'ship' ? 'bg-blue-500' : 'bg-red-500'
                  }`}></div>
                <div>
                  <p className="text-gray-300 text-sm">{activity.text}</p>
                  <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 border border-[#2d313f] text-gray-400 rounded-lg hover:text-white hover:bg-[#252a36] transition-colors text-sm font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const inventoryData = [
    { id: 1, name: 'Angle Profile 30x30', sku: 'SKU033', alloy: '6063-T6', finish: 'Mill Finish', dimensions: '6m', stock: '112 ft', status: 'good' },
    { id: 2, name: 'Angle Profile 30x30', sku: 'SKU031', alloy: '6063-T6', finish: 'Mill Finish', dimensions: '6m', stock: '112 ft', status: 'good' },
    { id: 3, name: 'Aluminium Extrusion 40x40', sku: 'SKU001', alloy: '6063-T6', finish: 'Clear Anodized', dimensions: '6m', stock: '1,250 ft', status: 'good' },
    { id: 4, name: 'U-Channel Standard', sku: 'SKU089', alloy: '6061-T4', finish: 'Powder Coated', dimensions: '3m', stock: '12 ft', status: 'low' },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <AddStockModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Stock Inventory Dashboard</h1>
          <p className="text-gray-400 text-sm">Overview / Inventory</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Stock</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1d27] rounded-xl p-6 border border-[#2d313f]">
          <h3 className="text-gray-400 text-sm font-medium mb-3">Total Items in Stock</h3>
          <div className="text-4xl font-bold text-white">4,280</div>
        </div>

        <div className="bg-[#1a1d27] rounded-xl p-6 border border-[#2d313f] border-l-4 border-l-red-500">
          <h3 className="text-gray-400 text-sm font-medium mb-3">Low Stock Alerts</h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-white">4</span>
            <span className="text-gray-400">items</span>
          </div>
        </div>

        <div className="bg-[#1a1d27] rounded-xl p-6 border border-[#2d313f]">
          <h3 className="text-gray-400 text-sm font-medium mb-3">Unique SKUs</h3>
          <div className="text-4xl font-bold text-white">9</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div className="relative">
          <select className="appearance-none bg-[#1a1d27] border border-[#2d313f] text-gray-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-blue-500">
            <option>6063-T6</option>
            <option>6061-T4</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        <div className="relative">
          <select className="appearance-none bg-[#1a1d27] border border-[#2d313f] text-gray-300 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-blue-500">
            <option>Good</option>
            <option>Low Stock</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>
        <button className="bg-[#1a1d27] border border-[#2d313f] text-gray-300 px-4 py-2 rounded-lg hover:bg-[#252a36] transition-colors">
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1a1d27] border border-[#2d313f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2d313f] text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Item / SKU</th>
                <th className="px-6 py-4 font-medium">Alloy</th>
                <th className="px-6 py-4 font-medium">Finish</th>
                <th className="px-6 py-4 font-medium">Dimensions</th>
                <th className="px-6 py-4 font-medium">Stock Level</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d313f]">
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
                      <button className="text-blue-500 hover:text-blue-400 font-medium">Edit</button>
                      <button className="text-red-500 hover:text-red-400 font-medium">Delete</button>
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
};

const Orders = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [aiDraftOrder, setAiDraftOrder] = useState(null);

  const orders = [
    { id: 'ORD-2023-089', date: 'Oct 24, 2023', customer: 'BuildTech Industries', amount: '$4,250.00', status: 'Completed' },
    { id: 'ORD-2023-090', date: 'Oct 25, 2023', customer: 'Apex Construction', amount: '$1,820.00', status: 'Processing' },
    { id: 'ORD-2023-091', date: 'Oct 25, 2023', customer: 'Global Supply Co.', amount: '$9,400.00', status: 'Pending' },
    { id: 'ORD-2023-092', date: 'Oct 26, 2023', customer: 'Metro Developers', amount: '$650.00', status: 'Cancelled' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-500 border border-green-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 animate-in fade-in duration-300">
      <CreateOrderModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <EmailDraftModal isOpen={!!aiDraftOrder} onClose={() => setAiDraftOrder(null)} order={aiDraftOrder} />

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
          <p className="text-gray-400 text-sm">Track and manage outgoing shipments.</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Order</span>
        </button>
      </div>

      <div className="flex space-x-6 border-b border-[#2d313f] mb-6">
        {['All Orders', 'Pending', 'Processing', 'Completed'].map((tab, i) => (
          <button
            key={i}
            className={`pb-4 px-2 font-medium text-sm border-b-2 ${i === 0 ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-[#1a1d27] border border-[#2d313f] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2d313f] text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Total Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d313f]">
              {orders.map((order, i) => (
                <tr key={i} className="hover:bg-[#1f232e] transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                  <td className="px-6 py-4 text-gray-300">{order.date}</td>
                  <td className="px-6 py-4 text-gray-300">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-300 font-medium">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center space-x-4">
                      <button
                        onClick={() => setAiDraftOrder(order)}
                        className="text-purple-400 hover:text-purple-300 font-medium text-sm flex items-center space-x-1 transition-colors"
                        title="Générer un e-mail avec l'IA"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-white font-medium text-sm">View Details</button>
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
};

const Settings = () => {
  const [activeSettingsTab, setActiveSettingsTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System Preferences', icon: SettingsIcon },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 max-w-5xl animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your account preferences and system configuration.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSettingsTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeSettingsTab === item.id ? 'bg-[#1a1d27] text-white border border-[#2d313f]' : 'text-gray-400 hover:bg-[#1a1d27]/50 hover:text-gray-200'
                }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        {activeSettingsTab === 'profile' && (
          <div className="flex-1 bg-[#1a1d27] border border-[#2d313f] rounded-xl p-8 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>

            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                A
              </div>
              <div>
                <button className="bg-[#252a36] hover:bg-[#2d313f] text-white px-4 py-2 rounded-lg font-medium transition-colors border border-[#3b4050] mb-2">
                  Change Avatar
                </button>
                <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
              </div>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="Xavier"
                    className="w-full bg-[#11131a] border border-[#2d313f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Aholou"
                    className="w-full bg-[#11131a] border border-[#2d313f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="Xavier.Aholou@xavalux.com"
                  className="w-full bg-[#11131a] border border-[#2d313f] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                <input
                  type="text"
                  defaultValue="Warehouse Supervisor"
                  disabled
                  className="w-full bg-[#11131a]/50 border border-[#2d313f]/50 text-gray-500 rounded-lg px-4 py-2.5 cursor-not-allowed"
                />
              </div>

              <div className="pt-4 border-t border-[#2d313f] flex justify-end space-x-4">
                <button type="button" className="px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSettingsTab === 'system' && (
          <div className="flex-1 bg-[#1a1d27] border border-[#2d313f] rounded-xl p-8 animate-in fade-in duration-200">
            <h2 className="text-xl font-bold text-white mb-6">Préférences Système</h2>

            <div className="space-y-8">
              {/* Theme Selection */}
              <div>
                <h3 className="text-sm font-medium text-white mb-4">Apparence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button className="border-2 border-blue-500 bg-[#11131a] p-4 rounded-lg flex flex-col items-center gap-3">
                    <div className="w-full h-16 bg-[#1a1d27] rounded-md border border-[#2d313f] flex flex-col overflow-hidden">
                      <div className="h-4 bg-[#1f222e] w-full border-b border-[#2d313f]"></div>
                      <div className="flex-1 flex px-2 py-2 gap-2">
                        <div className="w-4 h-full bg-[#1f222e] rounded-sm"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-1.5 w-1/2 bg-blue-500 rounded-full"></div>
                          <div className="h-1 w-full bg-[#2d313f] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-white text-sm font-medium">Sombre</span>
                  </button>
                  <button className="border border-[#2d313f] bg-[#11131a] p-4 rounded-lg flex flex-col items-center gap-3 hover:border-gray-500 transition-colors">
                    <div className="w-full h-16 bg-white rounded-md border border-gray-200 flex flex-col overflow-hidden">
                      <div className="h-4 bg-gray-100 w-full border-b border-gray-200"></div>
                      <div className="flex-1 flex px-2 py-2 gap-2">
                        <div className="w-4 h-full bg-gray-100 rounded-sm"></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-1.5 w-1/2 bg-blue-500 rounded-full"></div>
                          <div className="h-1 w-full bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm font-medium">Clair</span>
                  </button>
                  <button className="border border-[#2d313f] bg-[#11131a] p-4 rounded-lg flex flex-col items-center gap-3 hover:border-gray-500 transition-colors">
                    <div className="w-full h-16 bg-gradient-to-br from-[#1a1d27] to-white rounded-md border border-[#2d313f]"></div>
                    <span className="text-gray-400 text-sm font-medium">Système</span>
                  </button>
                </div>
              </div>

              {/* Localization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Langue de l'interface</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-[#11131a] border border-[#2d313f] text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>Français</option>
                      <option>English</option>
                      <option>Español</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Fuseau Horaire</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-[#11131a] border border-[#2d313f] text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option>GMT (Abidjan)</option>
                      <option>UTC+1 (Paris)</option>
                      <option>UTC-5 (New York)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#2d313f] flex justify-end space-x-4">
                <button type="button" className="px-6 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white transition-colors">
                  Annuler
                </button>
                <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                  Appliquer les préférences
                </button>
              </div>
            </div>
          </div>
        )}

        {(activeSettingsTab === 'notifications' || activeSettingsTab === 'security') && (
          <div className="flex-1 bg-[#1a1d27] border border-[#2d313f] rounded-xl p-8 flex flex-col items-center justify-center animate-in fade-in duration-200">
            <SettingsIcon className="w-12 h-12 text-gray-500 mb-4 opacity-50" />
            <h2 className="text-xl font-medium text-white mb-2">Section en construction</h2>
            <p className="text-gray-400 text-center text-sm max-w-sm">
              Les paramètres pour la section {tabs.find(t => t.id === activeSettingsTab)?.label} seront bientôt disponibles dans une prochaine mise à jour.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#13151f] font-sans selection:bg-blue-500/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'orders' && <Orders />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
}