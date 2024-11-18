import React, { useState } from 'react';
import type { CurrencyRate } from '../types/inventory';

interface Props {
  rate: CurrencyRate;
  onSubmit: (rate: CurrencyRate) => void;
}

export function CurrencyRateForm({ rate, onSubmit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(rate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        1 SGD = {(1 / rate.idrToSgd).toFixed(2)} IDR
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="number"
        step="0.000001"
        value={formData.idrToSgd}
        onChange={(e) => setFormData({ idrToSgd: Number(e.target.value) })}
        className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder="IDR to SGD rate"
      />
      <button
        type="submit"
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update
      </button>
      <button
        type="button"
        onClick={() => setIsEditing(false)}
        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
    </form>
  );
}