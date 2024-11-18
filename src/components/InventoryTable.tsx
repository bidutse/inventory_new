import React from 'react';
import { Edit, Trash2, ExternalLink, ChevronRight } from 'lucide-react';
import type { InventoryItem } from '../types/inventory';

interface Props {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryTable({ items, onEdit, onDelete }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSGD = (value: number) => {
    return new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Mobile view
  const renderMobileView = () => (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200 sm:hidden">
      {items.map((item) => (
        <div key={item.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.sku}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Category</p>
                <p className="font-medium">{item.category}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Quantity</p>
                <p className="font-medium">{item.quantity}</p>
              </div>
              <div>
                <p className="text-gray-500">Purchase Price</p>
                <p className="font-medium">{formatSGD(item.purchasePrice)}</p>
                <p className="text-xs text-gray-500">{formatIDR(item.purchasePriceIDR)}</p>
              </div>
              <div>
                <p className="text-gray-500">Selling Price</p>
                <p className="font-medium">{formatSGD(item.sellingPrice)}</p>
                <p className="text-xs text-gray-500">{formatIDR(item.sellingPriceIDR)}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Variations:</p>
              <div className="space-y-2">
                {item.variations.map((v) => (
                  <div key={v.id} className="text-sm">
                    <span className="font-medium">{v.color} / {v.size}</span>
                    <span className="text-gray-500 ml-2">({v.quantity})</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Added: {formatDate(item.createdAt)}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => onEdit(item)}
                  className="text-indigo-600"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop view
  const renderDesktopView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variations</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selling Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.category}</div>
                {item.productUrl && (
                  <a
                    href={item.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center mt-1"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Product
                  </a>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {item.variations.map((v) => (
                    <div key={v.id} className="mb-1">
                      {v.color} / {v.size} ({v.quantity})
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-500">
                  Total: {item.quantity}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatSGD(item.purchasePrice)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatIDR(item.purchasePriceIDR)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatSGD(item.sellingPrice)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatIDR(item.sellingPriceIDR)}
                </div>
                <div className="text-xs text-green-600">
                  {((item.sellingPrice - item.purchasePrice) / item.purchasePrice * 100).toFixed(1)}% margin
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(item.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(item)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {renderMobileView()}
      {renderDesktopView()}
    </>
  );
}