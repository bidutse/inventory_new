export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  purchasePrice: number;
  purchasePriceIDR: number;
  sellingPrice: number;
  sellingPriceIDR: number;
  category: string;
  productUrl: string;
  createdAt: string;
  lastUpdated: string;
  variations: Variation[];
}

export interface Variation {
  id: string;
  color: string;
  size: string;
  quantity: number;
}

export interface Sale {
  id: string;
  itemId: string;
  variationId: string;
  quantity: number;
  salePrice: number;
  salePriceIDR: number;
  saleDate: string;
  notes?: string;
}

export interface SaleFormData {
  itemId: string;
  variationId: string;
  quantity: number;
  salePrice: number;
  salePriceIDR: number;
  saleDate: string;
  notes?: string;
}

export interface InventoryStatsData {
  totalItems: number;
  totalValue: number;
  totalValueIDR: number;
  potentialRevenue: number;
  potentialRevenueIDR: number;
  potentialProfit: number;
  potentialProfitIDR: number;
}

export interface CurrencyRate {
  idrToSgd: number;
}