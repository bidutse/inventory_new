import React, { useState, useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';
import type { InventoryItem, CurrencyRate, Sale, SaleFormData } from './types/inventory';
import type { InventoryStatsData } from './types/inventory';
import { InventoryTable } from './components/InventoryTable';
import { InventoryStats } from './components/InventoryStats';
import { ItemForm } from './components/ItemForm';
import { CurrencyRateForm } from './components/CurrencyRateForm';
import { SalesForm } from './components/SalesForm';
import { SalesHistory } from './components/SalesHistory';
import { BulkImportForm } from './components/BulkImportForm';

const initialItems: InventoryItem[] = [
  {
    id: '1',
    name: 'Wireless Mouse',
    sku: 'WM-001',
    quantity: 50,
    purchasePrice: 20.00,
    purchasePriceIDR: 234000,
    sellingPrice: 39.99,
    sellingPriceIDR: 468000,
    category: 'Electronics',
    productUrl: 'https://example.com/wireless-mouse',
    createdAt: '2024-03-15T08:00:00Z',
    lastUpdated: new Date().toISOString(),
    variations: [
      { id: '1-1', color: 'Black', size: 'Standard', quantity: 30 },
      { id: '1-2', color: 'White', size: 'Standard', quantity: 20 },
    ],
  },
];

export function App() {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    return savedItems ? JSON.parse(savedItems) : initialItems;
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const savedSales = localStorage.getItem('inventorySales');
    return savedSales ? JSON.parse(savedSales) : [];
  });
  
  const [currencyRate, setCurrencyRate] = useState<CurrencyRate>(() => {
    const savedRate = localStorage.getItem('currencyRate');
    return savedRate ? JSON.parse(savedRate) : { idrToSgd: 0.000085 };
  });

  const [showForm, setShowForm] = useState(false);
  const [showSalesForm, setShowSalesForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | undefined>();

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('inventorySales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('currencyRate', JSON.stringify(currencyRate));
  }, [currencyRate]);

  const calculateStats = () => {
    return items.reduce(
      (stats, item) => ({
        totalItems: stats.totalItems + item.quantity,
        totalValue: stats.totalValue + item.purchasePrice * item.quantity,
        totalValueIDR: stats.totalValueIDR + item.purchasePriceIDR * item.quantity,
        potentialRevenue: stats.potentialRevenue + item.sellingPrice * item.quantity,
        potentialRevenueIDR: stats.potentialRevenueIDR + item.sellingPriceIDR * item.quantity,
        potentialProfit: stats.potentialProfit + (item.sellingPrice - item.purchasePrice) * item.quantity,
        potentialProfitIDR: stats.potentialProfitIDR + (item.sellingPriceIDR - item.purchasePriceIDR) * item.quantity,
      }),
      {
        totalItems: 0,
        totalValue: 0,
        totalValueIDR: 0,
        potentialRevenue: 0,
        potentialRevenueIDR: 0,
        potentialProfit: 0,
        potentialProfitIDR: 0,
      }
    );
  };

  const handleSubmit = (formData: Omit<InventoryItem, 'id' | 'lastUpdated' | 'createdAt'>) => {
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...formData, id: item.id, createdAt: item.createdAt, lastUpdated: new Date().toISOString() }
          : item
      ));
    } else {
      setItems([
        ...items,
        {
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
      ]);
    }
    setShowForm(false);
    setEditingItem(undefined);
  };

  const handleSalesSubmit = (newSales: SaleFormData[]) => {
    const salesWithIds = newSales.map(sale => ({
      ...sale,
      id: Math.random().toString(36).substr(2, 9),
    }));
    
    setSales([...sales, ...salesWithIds]);
    
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      salesWithIds.forEach(sale => {
        const itemIndex = updatedItems.findIndex(item => item.id === sale.itemId);
        if (itemIndex !== -1) {
          const item = updatedItems[itemIndex];
          const variationIndex = item.variations.findIndex(v => v.id === sale.variationId);
          if (variationIndex !== -1) {
            item.variations[variationIndex].quantity -= sale.quantity;
            item.quantity -= sale.quantity;
          }
        }
      });
      return updatedItems;
    });
    
    setShowSalesForm(false);
  };

  const handleBulkImport = (newItems: Omit<InventoryItem, 'id' | 'lastUpdated' | 'createdAt'>[]) => {
    const itemsWithIds = newItems.map(item => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }));
    setItems([...items, ...itemsWithIds]);
    setShowBulkImport(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all inventory and sales data? This action cannot be undone.')) {
      setItems([]);
      setSales([]);
      localStorage.removeItem('inventoryItems');
      localStorage.removeItem('inventorySales');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Inventory Management</h1>
            <div className="flex flex-wrap gap-3">
              <CurrencyRateForm
                rate={currencyRate}
                onSubmit={setCurrencyRate}
              />
              <button
                onClick={() => setShowSalesForm(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 min-w-[120px]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Record Sale
              </button>
              <button
                onClick={() => setShowBulkImport(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 min-w-[120px]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Bulk Import
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 min-w-[120px]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Item
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 min-w-[120px]"
              >
                <Trash className="h-5 w-5 mr-2" />
                Clear Data
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <InventoryStats stats={calculateStats()} />
          </div>

          {showForm && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <ItemForm
                item={editingItem}
                currencyRate={currencyRate}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingItem(undefined);
                }}
              />
            </div>
          )}

          {showSalesForm && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Record Sales</h2>
              <SalesForm
                items={items}
                currencyRate={currencyRate}
                onSubmit={handleSalesSubmit}
                onCancel={() => setShowSalesForm(false)}
              />
            </div>
          )}

          {showBulkImport && (
            <div className="mb-8">
              <BulkImportForm
                currencyRate={currencyRate}
                onImport={handleBulkImport}
                onCancel={() => setShowBulkImport(false)}
              />
            </div>
          )}

          <div className="space-y-8">
            <div className="overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">Inventory</h2>
              <InventoryTable
                items={items}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">Sales History</h2>
              <SalesHistory sales={sales} items={items} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}