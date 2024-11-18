import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import type { InventoryItem, Variation, CurrencyRate } from '../types/inventory';

interface Props {
  item?: InventoryItem;
  currencyRate: CurrencyRate;
  onSubmit: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function ItemForm({ item, currencyRate, onSubmit, onCancel }: Props) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    sku: item?.sku || '',
    quantity: item?.quantity || 0,
    purchasePrice: item?.purchasePrice || 0,
    purchasePriceIDR: item?.purchasePriceIDR || 0,
    sellingPrice: item?.sellingPrice || 0,
    sellingPriceIDR: item?.sellingPriceIDR || 0,
    category: item?.category || '',
    productUrl: item?.productUrl || '',
    variations: item?.variations || [],
  });

  const [newVariation, setNewVariation] = useState({
    color: '',
    size: '',
    quantity: 0,
  });

  const handlePriceChange = (type: 'purchase' | 'selling', currency: 'SGD' | 'IDR', value: number) => {
    if (currency === 'SGD') {
      setFormData(prev => ({
        ...prev,
        [`${type}Price`]: value,
        [`${type}PriceIDR`]: Math.round(value / currencyRate.idrToSgd),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [`${type}PriceIDR`]: value,
        [`${type}Price`]: Number((value * currencyRate.idrToSgd).toFixed(2)),
      }));
    }
  };

  const addVariation = () => {
    if (newVariation.color && newVariation.size && newVariation.quantity > 0) {
      setFormData({
        ...formData,
        variations: [
          ...formData.variations,
          {
            id: Math.random().toString(36).substr(2, 9),
            ...newVariation,
          },
        ],
        quantity: formData.quantity + newVariation.quantity,
      });
      setNewVariation({ color: '', size: '', quantity: 0 });
    }
  };

  const removeVariation = (variationId: string) => {
    const variation = formData.variations.find(v => v.id === variationId);
    if (variation) {
      setFormData({
        ...formData,
        variations: formData.variations.filter(v => v.id !== variationId),
        quantity: formData.quantity - variation.quantity,
      });
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="bg-white p-6 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product URL</label>
          <input
            type="url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.productUrl}
            onChange={(e) => setFormData({ ...formData, productUrl: e.target.value })}
            placeholder="https://example.com/product"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Price (SGD)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.purchasePrice}
            onChange={(e) => handlePriceChange('purchase', 'SGD', Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Price (IDR)</label>
          <input
            type="number"
            required
            min="0"
            step="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.purchasePriceIDR}
            onChange={(e) => handlePriceChange('purchase', 'IDR', Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Selling Price (SGD)</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.sellingPrice}
            onChange={(e) => handlePriceChange('selling', 'SGD', Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Selling Price (IDR)</label>
          <input
            type="number"
            required
            min="0"
            step="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.sellingPriceIDR}
            onChange={(e) => handlePriceChange('selling', 'IDR', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            placeholder="Color"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={newVariation.color}
            onChange={(e) => setNewVariation({ ...newVariation, color: e.target.value })}
          />
          <input
            type="text"
            placeholder="Size"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={newVariation.size}
            onChange={(e) => setNewVariation({ ...newVariation, size: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            min="1"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={newVariation.quantity || ''}
            onChange={(e) => setNewVariation({ ...newVariation, quantity: Number(e.target.value) })}
          />
          <button
            type="button"
            onClick={addVariation}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Variation
          </button>
        </div>

        <div className="bg-gray-50 rounded-md p-4">
          {formData.variations.map((variation) => (
            <div key={variation.id} className="flex items-center justify-between py-2">
              <div className="flex space-x-4">
                <span className="text-sm font-medium">{variation.color}</span>
                <span className="text-sm text-gray-500">{variation.size}</span>
                <span className="text-sm text-gray-500">Qty: {variation.quantity}</span>
              </div>
              <button
                type="button"
                onClick={() => removeVariation(variation.id)}
                className="text-red-600 hover:text-red-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {item ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}