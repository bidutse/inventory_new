import React, { useRef } from 'react';
import { Upload, X, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import type { InventoryItem } from '../types/inventory';

interface Props {
  onImport: (items: Omit<InventoryItem, 'id' | 'lastUpdated' | 'createdAt'>[]) => void;
  onCancel: () => void;
  currencyRate: { idrToSgd: number };
}

export function BulkImportForm({ onImport, onCancel, currencyRate }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = [
      {
        name: 'Example Product',
        sku: 'SKU-001',
        category: 'Electronics',
        productUrl: 'https://example.com/product',
        purchasePriceSGD: 20.00,
        sellingPriceSGD: 39.99,
        variations: JSON.stringify([
          { color: 'Black', size: 'Standard', quantity: 30 },
          { color: 'White', size: 'Standard', quantity: 20 }
        ])
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    // Add column widths
    ws['!cols'] = [
      { wch: 30 }, // name
      { wch: 15 }, // sku
      { wch: 20 }, // category
      { wch: 40 }, // productUrl
      { wch: 15 }, // purchasePriceSGD
      { wch: 15 }, // sellingPriceSGD
      { wch: 50 }, // variations
    ];

    XLSX.writeFile(wb, 'inventory-import-template.xlsx');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const items = jsonData.map(row => {
          const purchasePrice = Number(row.purchasePriceSGD);
          const sellingPrice = Number(row.sellingPriceSGD);
          let variations;
          
          try {
            variations = JSON.parse(row.variations);
          } catch (e) {
            variations = [];
          }

          const quantity = variations.reduce((sum: number, v: any) => sum + (Number(v.quantity) || 0), 0);

          return {
            name: row.name,
            sku: row.sku,
            category: row.category,
            productUrl: row.productUrl,
            purchasePrice,
            purchasePriceIDR: Math.round(purchasePrice / currencyRate.idrToSgd),
            sellingPrice,
            sellingPriceIDR: Math.round(sellingPrice / currencyRate.idrToSgd),
            quantity,
            variations: variations.map((v: any) => ({
              id: Math.random().toString(36).substr(2, 9),
              color: v.color,
              size: v.size,
              quantity: Number(v.quantity) || 0
            }))
          };
        });

        onImport(items);
      } catch (error) {
        alert('Error processing file. Please make sure you are using the correct template.');
        console.error('Error processing file:', error);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Bulk Import Products</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </button>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
              >
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="sr-only"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                Select Excel File
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Upload the Excel file using the template format
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}