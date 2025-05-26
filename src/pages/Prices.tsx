import React, { useState, useMemo } from 'react';
import { Plus, Tag, Search, Filter } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import PriceEntryForm from '../components/prices/PriceEntryForm';
import PriceComparison from '../components/prices/PriceComparison';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';

const Prices: React.FC = () => {
  const { 
    priceComparisons,
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory,
    getProductCategories
  } = useAppContext();
  
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  const categories = getProductCategories();
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(category => ({ value: category, label: category })),
  ];
  
  // Filter price comparisons
  const filteredComparisons = useMemo(() => {
    return priceComparisons.filter(comparison => 
      (searchTerm === '' || 
        comparison.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comparison.suppliers.some(supplier => 
          supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) &&
      (selectedCategory === '' || 
        // Need to find product to check its category
        comparison.productName.includes(selectedCategory)
      )
    );
  }, [priceComparisons, searchTerm, selectedCategory]);
  
  const handleAddPrice = (productId: string) => {
    setSelectedProductId(productId);
    setIsPriceModalOpen(true);
  };
  
  return (
    <Layout title="Price Tracker">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Search products or suppliers..."
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
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setSelectedProductId(null);
            setIsPriceModalOpen(true);
          }}
        >
          Add Price
        </Button>
      </div>
      
      {/* Price Comparisons Grid */}
      {filteredComparisons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredComparisons.map((comparison) => (
            <PriceComparison
              key={comparison.productId}
              comparison={comparison}
              onAddPrice={handleAddPrice}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Tag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          {priceComparisons.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No price data yet</h3>
              <p className="text-gray-500 mb-4">Add your first price entry to get started</p>
              <Button
                onClick={() => {
                  setSelectedProductId(null);
                  setIsPriceModalOpen(true);
                }}
              >
                Add Price Entry
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No matching price data</h3>
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
      
      {/* Add Price Modal */}
      <Modal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title="Add Price Entry"
        size="md"
      >
        <PriceEntryForm
          productId={selectedProductId || undefined}
          onClose={() => setIsPriceModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

export default Prices;