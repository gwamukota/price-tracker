import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { 
  Supplier, 
  Product, 
  PriceEntry, 
  PriceComparison,
  SortConfig
} from '../types';
import { generateId, generatePriceComparisons } from '../utils/helpers';

interface AppContextType {
  // Data
  suppliers: Supplier[];
  products: Product[];
  priceEntries: PriceEntry[];
  priceComparisons: PriceComparison[];
  
  // Suppliers
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
  
  // Products
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Price Entries
  addPriceEntry: (entry: Omit<PriceEntry, 'id'>) => void;
  updatePriceEntry: (id: string, entry: Partial<PriceEntry>) => void;
  deletePriceEntry: (id: string) => void;
  
  // Filters and Sorting
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sortConfig: SortConfig;
  setSortConfig: (config: SortConfig) => void;
  
  // Stats
  getProductCategories: () => string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage for persistence
  const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('suppliers', []);
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [priceEntries, setPriceEntries] = useLocalStorage<PriceEntry[]>('priceEntries', []);
  
  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  
  // Derived state
  const [priceComparisons, setPriceComparisons] = useState<PriceComparison[]>([]);
  
  // Update price comparisons when dependencies change
  useEffect(() => {
    const comparisons = generatePriceComparisons(products, suppliers, priceEntries);
    setPriceComparisons(comparisons);
  }, [products, suppliers, priceEntries]);
  
  // Supplier CRUD operations
  const addSupplier = (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      id: generateId(),
      ...supplierData,
      createdAt: now,
      updatedAt: now,
    };
    setSuppliers([...suppliers, newSupplier]);
  };
  
  const updateSupplier = (id: string, supplierData: Partial<Supplier>) => {
    const now = new Date().toISOString();
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id
          ? { ...supplier, ...supplierData, updatedAt: now }
          : supplier
      )
    );
  };
  
  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== id));
    // Also delete related price entries
    setPriceEntries(priceEntries.filter((entry) => entry.supplierId !== id));
  };
  
  // Product CRUD operations
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      id: generateId(),
      ...productData,
      createdAt: now,
      updatedAt: now,
    };
    setProducts([...products, newProduct]);
  };
  
  const updateProduct = (id: string, productData: Partial<Product>) => {
    const now = new Date().toISOString();
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, ...productData, updatedAt: now }
          : product
      )
    );
  };
  
  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
    // Also delete related price entries
    setPriceEntries(priceEntries.filter((entry) => entry.productId !== id));
  };
  
  // Price Entry CRUD operations
  const addPriceEntry = (entryData: Omit<PriceEntry, 'id'>) => {
    const newEntry: PriceEntry = {
      id: generateId(),
      ...entryData,
    };
    setPriceEntries([...priceEntries, newEntry]);
  };
  
  const updatePriceEntry = (id: string, entryData: Partial<PriceEntry>) => {
    setPriceEntries(
      priceEntries.map((entry) =>
        entry.id === id
          ? { ...entry, ...entryData }
          : entry
      )
    );
  };
  
  const deletePriceEntry = (id: string) => {
    setPriceEntries(priceEntries.filter((entry) => entry.id !== id));
  };
  
  // Helper functions
  const getProductCategories = (): string[] => {
    const categories = Array.from(new Set(products.map((product) => product.category)));
    return categories.filter((category) => category.trim() !== '').sort();
  };
  
  const value = {
    // Data
    suppliers,
    products,
    priceEntries,
    priceComparisons,
    
    // Suppliers
    addSupplier,
    updateSupplier,
    deleteSupplier,
    
    // Products
    addProduct,
    updateProduct,
    deleteProduct,
    
    // Price Entries
    addPriceEntry,
    updatePriceEntry,
    deletePriceEntry,
    
    // Filters and Sorting
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortConfig,
    setSortConfig,
    
    // Stats
    getProductCategories,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};