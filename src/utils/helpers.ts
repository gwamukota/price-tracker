import { format, parseISO } from 'date-fns';
import { PriceEntry, Product, Supplier, PriceComparison } from '../types';

// Format currency based on locale
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date to readable format
export const formatDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get price change percentage
export const getPriceChangePercentage = (
  currentPrice: number,
  previousPrice: number | null
): number | null => {
  if (previousPrice === null || previousPrice === 0) return null;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
};

// Format percentage with + or - sign
export const formatPercentage = (percentage: number | null): string => {
  if (percentage === null) return '—';
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

// Get price change color class based on price change
export const getPriceChangeColorClass = (priceChange: number | null): string => {
  if (priceChange === null) return 'text-gray-500';
  if (priceChange > 0) return 'text-red-500';
  if (priceChange < 0) return 'text-green-500';
  return 'text-gray-500';
};

// Get the latest price for a product from a supplier
export const getLatestPrice = (
  priceEntries: PriceEntry[],
  productId: string,
  supplierId: string
): PriceEntry | null => {
  const relevantEntries = priceEntries.filter(
    (entry) => entry.productId === productId && entry.supplierId === supplierId
  );
  
  if (relevantEntries.length === 0) return null;
  
  return relevantEntries.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
};

// Get the previous price for a product from a supplier
export const getPreviousPrice = (
  priceEntries: PriceEntry[],
  productId: string,
  supplierId: string
): PriceEntry | null => {
  const relevantEntries = priceEntries.filter(
    (entry) => entry.productId === productId && entry.supplierId === supplierId
  );
  
  if (relevantEntries.length <= 1) return null;
  
  const sortedEntries = relevantEntries.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return sortedEntries[1];
};

// Generate price comparisons for all products
export const generatePriceComparisons = (
  products: Product[],
  suppliers: Supplier[],
  priceEntries: PriceEntry[]
): PriceComparison[] => {
  return products.map((product) => {
    const supplierComparisons = suppliers.map((supplier) => {
      const latestPriceEntry = getLatestPrice(priceEntries, product.id, supplier.id);
      const previousPriceEntry = getPreviousPrice(priceEntries, product.id, supplier.id);
      
      const currentPrice = latestPriceEntry?.price || 0;
      const previousPrice = previousPriceEntry?.price || null;
      const priceChange = previousPrice !== null 
        ? getPriceChangePercentage(currentPrice, previousPrice) 
        : null;
      
      return {
        supplierId: supplier.id,
        supplierName: supplier.name,
        currentPrice,
        previousPrice,
        priceChange,
        lastUpdated: latestPriceEntry?.date || '',
      };
    });
    
    return {
      productId: product.id,
      productName: product.name,
      suppliers: supplierComparisons,
    };
  });
};

// Find the supplier with the lowest price for a product
export const findBestSupplier = (
  priceComparison: PriceComparison
): { supplierId: string; supplierName: string; price: number } | null => {
  const validSuppliers = priceComparison.suppliers.filter(
    (supplier) => supplier.currentPrice > 0
  );
  
  if (validSuppliers.length === 0) return null;
  
  const bestSupplier = validSuppliers.reduce((best, current) => 
    current.currentPrice < best.currentPrice ? current : best
  );
  
  return {
    supplierId: bestSupplier.supplierId,
    supplierName: bestSupplier.supplierName,
    price: bestSupplier.currentPrice,
  };
};