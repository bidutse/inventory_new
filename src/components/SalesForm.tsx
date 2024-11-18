import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { InventoryItem, SaleFormData, CurrencyRate } from '../types/inventory';

interface Props {
  items: InventoryItem[];
  currencyRate: CurrencyRate;
  onSubmit: (sales: SaleFormData[]) => void;
  onCancel: () => void;
}

export function SalesForm({ items, currencyRate, onSubmit, onCancel }: Props) {
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  const [sales, setSales] = useState<SaleFormData[]>([]);
  const [currentSale, setCurrentSale] = useState<SaleFormData>({
    itemId: '',
    variationId: '',
    quantity: 1,
    salePrice: 0,
    salePriceIDR: 0,
    saleDate: saleDate,
  });

  const selectedItem = items.find(item => item.id === currentSale.itemId);

  const handleItemSelect = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setCurrentSale({
        ...currentSale,
        itemId,
        variationId: '',
        salePrice: item.sellingPrice,
        salePriceIDR: item.sellingPriceIDR,
      });
    }
  };

  const handlePriceChange = (currency: 'SGD' | 'IDR', value: number) => {
    if (currency === 'SGD') {
      setCurrentSale(prev => ({
        ...prev,
        salePrice: value,
        salePriceIDR: Math.round(value / currencyRate.idrToSgd),
      }));
    } else {
      setCurrentSale(prev => ({
        ...prev,
        salePriceIDR: value,
        salePrice: Number((value * currencyRate.idrToSgd).toFixed(2)),
      }));
    }
  };

  const addSale = () => {
    if (currentSale.itemId && currentSale.variationId && currentSale.quantity > 0) {
      const selectedVariation = selectedItem?.variations.find(v => v.id === currentSale.variationId);
      if (selectedVariation && selectedVariation.quantity >= currentSale.quantity) {
        setSales([...sales, { ...currentSale, saleDate }]);
        setCurrentSale({
          itemId: '',
          variationId: '',
          quantity: 1,
          salePrice: 0,
          salePriceIDR: 0,
          saleDate: saleDate,
        });
      }
    }
  };

  const removeSale = (index: number) => {
    setSales(sales.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sales.length > 0) {
      onSubmit(sales);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Sale Date</label>
        <input
          type="date"
          value={saleDate}
          onChange={(e) => setSaleDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Item</label>
          <select
            value={currentSale.itemId}
            onChange={(e) => handleItemSelect(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select an item</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.sku})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Variation</label>
          <select
            value={currentSale.variationId}
            onChange={(e) => setCurrentSale({ ...currentSale, variationId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!currentSale.itemId}
          >
            <option value="">Select a variation</option>
            {selectedItem?.variations.map(variation => (
              <option key={variation.id} value={variation.id}>
                {variation.color} / {variation.size} (Available: {variation.quantity})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            min="1"
            value={currentSale.quantity}
            onChange={(e) => setCurrentSale({ ...currentSale, quantity: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sale Price (SGD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={currentSale.salePrice}
            onChange={(e) => handlePriceChange('SGD', Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Sale Price (IDR)</label>
          <input
            type="number"
            min="0"
            step="1"
            value={currentSale.salePriceIDR}
            onChange={(e) => handlePriceChange('IDR', Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <input
            type="text"
            value={currentSale.notes || ''}
            onChange={(e) => setCurrentSale({ ...currentSale, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <button
          type="button"
          onClick={addSale}
          disabled={!currentSale.itemId || !currentSale.variationId || currentSale.quantity < 1}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sale
        </button>
      </div>

      {sales.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales for {saleDate}</h3>
          <div className="bg-gray-50 rounded-md p-4">
            {sales.map((sale, index) => {
              const item = items.find(i => i.id === sale.itemId);
              const variation = item?.variations.find(v => v.id === sale.variationId);
              return (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {item?.name} - {variation?.color} / {variation?.size}
                    </div>
                    <div className="text-sm text-gray-500">
                      Qty: {sale.quantity} × SGD {sale.salePrice.toFixed(2)} (IDR {sale.salePriceIDR.toLocaleString()})
                    </div>
                    {sale.notes && (
                      <div className="text-sm text-gray-500">
                        Note: {sale.notes}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSale(index)}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={sales.length === 0}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
        >
          Record Sales
        </button>
      </div>
    </form>
  );
}