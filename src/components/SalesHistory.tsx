import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { Sale, InventoryItem } from '../types/inventory';

interface Props {
  sales: Sale[];
  items: InventoryItem[];
}

export function SalesHistory({ sales, items }: Props) {
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

  const exportToExcel = () => {
    const exportData = sales.map(sale => {
      const item = items.find(i => i.id === sale.itemId);
      const variation = item?.variations.find(v => v.id === sale.variationId);
      
      return {
        'Date': formatDate(sale.saleDate),
        'Product': item?.name || '',
        'SKU': item?.sku || '',
        'Variation': `${variation?.color} / ${variation?.size}`,
        'Quantity': sale.quantity,
        'Price (SGD)': sale.salePrice,
        'Total (SGD)': sale.salePrice * sale.quantity,
        'Price (IDR)': sale.salePriceIDR,
        'Total (IDR)': sale.salePriceIDR * sale.quantity,
        'Notes': sale.notes || ''
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales History');

    // Add column widths
    ws['!cols'] = [
      { wch: 12 }, // Date
      { wch: 30 }, // Product
      { wch: 15 }, // SKU
      { wch: 20 }, // Variation
      { wch: 10 }, // Quantity
      { wch: 12 }, // Price SGD
      { wch: 12 }, // Total SGD
      { wch: 15 }, // Price IDR
      { wch: 15 }, // Total IDR
      { wch: 30 }, // Notes
    ];

    XLSX.writeFile(wb, `sales-history-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Group sales by date
  const salesByDate = sales.reduce((acc, sale) => {
    const date = sale.saleDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(sale);
    return acc;
  }, {} as Record<string, Sale[]>);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Sales History</h3>
        <button
          onClick={exportToExcel}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </button>
      </div>
      <div className="border-t border-gray-200">
        {Object.entries(salesByDate)
          .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
          .map(([date, dateSales]) => {
            const dailyTotal = dateSales.reduce(
              (total, sale) => ({
                sgd: total.sgd + sale.salePrice * sale.quantity,
                idr: total.idr + sale.salePriceIDR * sale.quantity,
              }),
              { sgd: 0, idr: 0 }
            );

            return (
              <div key={date} className="border-b border-gray-200 last:border-0">
                <div className="bg-gray-50 px-4 py-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(date)}
                    </span>
                    <span className="text-sm text-gray-700">
                      Daily Total: {formatSGD(dailyTotal.sgd)} / {formatIDR(dailyTotal.idr)}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {dateSales.map((sale) => {
                    const item = items.find(i => i.id === sale.itemId);
                    const variation = item?.variations.find(v => v.id === sale.variationId);
                    
                    return (
                      <div key={sale.id} className="px-4 py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {variation?.color} / {variation?.size}
                            </div>
                            {sale.notes && (
                              <div className="text-sm text-gray-500 italic">
                                Note: {sale.notes}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {sale.quantity} × {formatSGD(sale.salePrice)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatIDR(sale.salePriceIDR)}
                            </div>
                            <div className="text-sm font-medium text-green-600">
                              Total: {formatSGD(sale.salePrice * sale.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}