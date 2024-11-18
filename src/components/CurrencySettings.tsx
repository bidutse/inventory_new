import React, { useState } from 'react';
import type { CurrencyRate } from '../types/inventory';

interface Props {
  currencyRate: CurrencyRate;
  onSave: (rate: CurrencyRate) => void;
  onCancel: () => void;
}

export function CurrencySettings({ currencyRate, onSave, onCancel }: Props) {
  const [rate, setRate] = useState(currencyRate.SGDtoIDR);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Currency Settings</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            SGD to IDR Exchange Rate
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              min="0"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">IDR</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            1 SGD = {rate.toLocaleString()} IDR
          </p>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ SGDtoIDR: rate })}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}