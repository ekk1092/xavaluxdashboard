import { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext(null);

const DEFAULT_INVENTORY = [
  { id: 1, name: 'Angle Profile 30x30', sku: 'SKU033', alloy: '6063-T6', finish: 'Mill Finish', dimensions: '6m', stock: '112 ft', status: 'good' },
  { id: 2, name: 'Aluminium Extrusion 40x40', sku: 'SKU001', alloy: '6063-T6', finish: 'Clear Anodized', dimensions: '6m', stock: '1,250 ft', status: 'good' },
  { id: 3, name: 'U-Channel Standard', sku: 'SKU089', alloy: '6061-T4', finish: 'Powder Coated', dimensions: '3m', stock: '12 ft', status: 'low' },
];

const DEFAULT_ORDERS = [
  { id: 'ORD-2023-089', date: 'Oct 24, 2023', customer: 'BuildTech Industries', amount: '$4,250.00', status: 'completed' },
  { id: 'ORD-2023-090', date: 'Oct 25, 2023', customer: 'Apex Construction', amount: '$1,820.00', status: 'processing' },
  { id: 'ORD-2023-091', date: 'Oct 25, 2023', customer: 'Global Supply Co.', amount: '$9,400.00', status: 'pending' },
  { id: 'ORD-2023-092', date: 'Oct 26, 2023', customer: 'Metro Developers', amount: '$650.00', status: 'cancelled' },
];

export function DataProvider({ children }) {
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('xavalux_inventory');
    return saved ? JSON.parse(saved) : DEFAULT_INVENTORY;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('xavalux_orders');
    return saved ? JSON.parse(saved) : DEFAULT_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('xavalux_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('xavalux_orders', JSON.stringify(orders));
  }, [orders]);

  const addStock = (item) => {
    setInventory((prev) => [...prev, { ...item, id: Date.now() }]);
  };

  const updateStock = (id, updatedItem) => {
    setInventory((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)));
  };

  const deleteStock = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const addOrder = (order) => {
    setOrders((prev) => [{ ...order, id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }, ...prev]);
  };

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DataContext.Provider value={{ inventory, addStock, updateStock, deleteStock, orders, addOrder, searchQuery, setSearchQuery }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
