import React from 'react';
import { BarChart3, Package, DollarSign, TrendingUp } from 'lucide-react';
import type { InventoryStatsData } from '../types/inventory';

interface Props {
  stats: InventoryStatsData;
}

export function InventoryStats({ stats }: Props) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600">
            <Package className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-sm font-medium text-gray-500">Total Items</p>
            <p className="text-lg font-semibold text-gray-900">{stats.totalItems}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-sm font-medium text-gray-500">Inventory Value</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {formatIDR(stats.totalValueIDR)}
              <span className="block text-sm text-gray-500">{formatSGD(stats.totalValue)}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 rounded-full bg-purple-100 text-purple-600">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-sm font-medium text-gray-500">Potential Revenue</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {formatIDR(stats.potentialRevenueIDR)}
              <span className="block text-sm text-gray-500">{formatSGD(stats.potentialRevenue)}</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center">
          <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="ml-3 sm:ml-4">
            <p className="text-sm font-medium text-gray-500">Potential Profit</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {formatIDR(stats.potentialProfitIDR)}
              <span className="block text-sm text-gray-500">{formatSGD(stats.potentialProfit)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}