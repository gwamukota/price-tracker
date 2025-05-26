export interface Supplier {
  id: string;
  name: string;
  contact: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceEntry {
  id: string;
  productId: string;
  supplierId: string;
  price: number;
  date: string;
  notes: string;
}

export interface PriceComparison {
  productId: string;
  productName: string;
  suppliers: {
    supplierId: string;
    supplierName: string;
    currentPrice: number;
    previousPrice: number | null;
    priceChange: number | null;
    lastUpdated: string;
  }[];
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}