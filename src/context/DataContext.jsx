import { useEffect, useState } from 'react';
import { DataContext } from './dataContextValue.js';

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

const DEFAULT_SALES = [
  { id: 'SAL-001', date: 'Oct 23, 2023', item: 'Angle Profile 30x30', quantity: 120, amount: '$1,440.00', customer: 'AluCorp France', paymentMethod: 'Bank Transfer' },
  { id: 'SAL-002', date: 'Oct 24, 2023', item: 'Aluminium Extrusion 40x40', quantity: 450, amount: '$3,600.00', customer: 'VitreDesign Paris', paymentMethod: 'Credit Card' },
  { id: 'SAL-003', date: 'Oct 25, 2023', item: 'U-Channel Standard', quantity: 80, amount: '$720.00', customer: 'LogiStructure S.A.', paymentMethod: 'Bank Transfer' },
];

const DEFAULT_EXPENSES = [
  { id: 'EXP-001', date: 'Oct 22, 2023', category: 'Raw Materials', description: 'Aluminium billet extrusion purchase', amount: '$4,800.00', status: 'paid' },
  { id: 'EXP-002', date: 'Oct 24, 2023', category: 'Logistics', description: 'Container freight shipment', amount: '$1,200.00', status: 'paid' },
  { id: 'EXP-003', date: 'Oct 25, 2023', category: 'Energy', description: 'Factory electricity bill', amount: '$850.00', status: 'unpaid' },
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

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('xavalux_sales');
    return saved ? JSON.parse(saved) : DEFAULT_SALES;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('xavalux_expenses');
    return saved ? JSON.parse(saved) : DEFAULT_EXPENSES;
  });

  useEffect(() => {
    localStorage.setItem('xavalux_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('xavalux_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('xavalux_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('xavalux_expenses', JSON.stringify(expenses));
  }, [expenses]);

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

  const addSale = (sale) => {
    setSales((prev) => [{ ...sale, id: `SAL-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }, ...prev]);
  };

  const deleteSale = (id) => {
    setSales((prev) => prev.filter((s) => s.id !== id));
  };

  const addExpense = (expense) => {
    setExpenses((prev) => [{ ...expense, id: `EXP-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}` }, ...prev]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <DataContext.Provider value={{ 
      inventory, addStock, updateStock, deleteStock, 
      orders, addOrder, 
      sales, addSale, deleteSale, 
      expenses, addExpense, deleteExpense, 
      searchQuery, setSearchQuery 
    }}>
      {children}
    </DataContext.Provider>
  );
}
