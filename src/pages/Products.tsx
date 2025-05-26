import React, { useState, useMemo } from 'react';
import { Plus, Package, Search, Filter, ArrowUpDown } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProductCard from '../components/products/ProductCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import ProductForm from '../components/products/ProductForm';
import PriceEntryForm from '../components/prices/PriceEntryForm';
import Select from '../components/ui/Select';
import { useAppContext } from '../context/AppContext';
import { Product, SortConfig } from '../types';

const Products: React.FC = () => {
  const { 
    products, 
    deleteProduct, 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory,
    sortConfig,
    setSortConfig,
    getProductCategories
  } = useAppContext();
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const categories = getProductCategories();
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(category => ({ value: category, label: category })),
  ];
  
  // Handle product edit
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };
  
  // Handle product delete
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };
  
  // Handle price click
  const handlePriceClick = (product: Product) => {
    setSelectedProduct(product);
    setIsPriceModalOpen(true);
  };
  
  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    });
  };
  
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => 
        (searchTerm === '' || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) &&
        (selectedCategory === '' || product.category === selectedCategory)
      )
      .sort((a, b) => {
        const direction = sortConfig.direction === 'asc' ? 1 : -1;
        if (sortConfig.key === 'name') {
          return a.name.localeCompare(b.name) * direction;
        }
        if (sortConfig.key === 'category') {
          return a.category.localeCompare(b.category) * direction;
        }
        if (sortConfig.key === 'createdAt') {
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
        }
        return 0;
      });
  }, [products, searchTerm, selectedCategory, sortConfig]);
  
  return (
    <Layout title="Products">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            fullWidth
          />
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            leftIcon={<Filter className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            leftIcon={<ArrowUpDown className="h-4 w-4" />}
            onClick={() => handleSort('name')}
          >
            Sort
          </Button>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              setSelectedProduct(null);
              setIsProductModalOpen(true);
            }}
          >
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onPrices={handlePriceClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          {products.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No products yet</h3>
              <p className="text-gray-500 mb-4">Add your first product to get started</p>
              <Button
                onClick={() => {
                  setSelectedProduct(null);
                  setIsProductModalOpen(true);
                }}
              >
                Add Product
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No matching products</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Clear Filters
              </Button>
            </>
          )}
        </div>
      )}
      
      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
        size="md"
      >
        <ProductForm
          product={selectedProduct || undefined}
          onClose={() => setIsProductModalOpen(false)}
        />
      </Modal>
      
      {/* Add Price Modal */}
      <Modal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title={`Add Price for ${selectedProduct?.name || ''}`}
        size="md"
      >
        <PriceEntryForm
          productId={selectedProduct?.id}
          onClose={() => setIsPriceModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

export default Products;