import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  DollarSign,
  BarChart3,
  Tag 
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import PriceComparison from '../components/prices/PriceComparison';
import Modal from '../components/ui/Modal';
import PriceEntryForm from '../components/prices/PriceEntryForm';
import { useAppContext } from '../context/AppContext';
import { 
  formatCurrency, 
  formatPercentage, 
  getPriceChangeColorClass,
  findBestSupplier
} from '../utils/helpers';
import { PriceComparison as PriceComparisonType } from '../types';

const Dashboard: React.FC = () => {
  const { 
    products, 
    suppliers, 
    priceEntries, 
    priceComparisons 
  } = useAppContext();
  
  const [recentPriceChanges, setRecentPriceChanges] = useState<PriceComparisonType[]>([]);
  const [bestDeals, setBestDeals] = useState<PriceComparisonType[]>([]);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  useEffect(() => {
    // Get recent price changes
    const comparisonsWithChanges = priceComparisons
      .filter(comparison => 
        comparison.suppliers.some(supplier => supplier.priceChange !== null)
      )
      .sort((a, b) => {
        const maxChangeA = Math.max(
          ...a.suppliers
            .filter(s => s.priceChange !== null)
            .map(s => Math.abs(s.priceChange || 0))
        );
        const maxChangeB = Math.max(
          ...b.suppliers
            .filter(s => s.priceChange !== null)
            .map(s => Math.abs(s.priceChange || 0))
        );
        return maxChangeB - maxChangeA;
      })
      .slice(0, 4);
    
    setRecentPriceChanges(comparisonsWithChanges);
    
    // Get best deals
    const comparisonsWithPrices = priceComparisons
      .filter(comparison => 
        comparison.suppliers.some(supplier => supplier.currentPrice > 0)
      )
      .sort((a, b) => {
        const bestA = findBestSupplier(a);
        const bestB = findBestSupplier(b);
        if (!bestA) return 1;
        if (!bestB) return -1;
        return bestA.price - bestB.price;
      })
      .slice(0, 4);
    
    setBestDeals(comparisonsWithPrices);
  }, [priceComparisons]);
  
  const handleAddPrice = (productId: string) => {
    setSelectedProductId(productId);
    setIsPriceModalOpen(true);
  };
  
  return (
    <Layout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-3 mr-4">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-80">Total Products</h3>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/products">
              <Button 
                variant="outline" 
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                View Products
              </Button>
            </Link>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-3 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-80">Total Suppliers</h3>
              <p className="text-2xl font-bold">{suppliers.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/suppliers">
              <Button 
                variant="outline" 
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                View Suppliers
              </Button>
            </Link>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex items-center">
            <div className="rounded-full bg-white/20 p-3 mr-4">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium opacity-80">Price Entries</h3>
              <p className="text-2xl font-bold">{priceEntries.length}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/prices">
              <Button 
                variant="outline" 
                className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                View Prices
              </Button>
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Recent Price Changes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Recent Price Changes
          </h2>
          <Link to="/prices">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        
        {recentPriceChanges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPriceChanges.map((comparison) => (
              <PriceComparison
                key={comparison.productId}
                comparison={comparison}
                onAddPrice={handleAddPrice}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No price changes yet</h3>
              <p className="mb-4">Start tracking prices to see recent changes here</p>
              <Link to="/prices">
                <Button>Add Price Entries</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
      
      {/* Best Deals */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-teal-600" />
            Best Deals
          </h2>
          <Link to="/prices">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        
        {bestDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bestDeals.map((comparison) => (
              <PriceComparison
                key={comparison.productId}
                comparison={comparison}
                onAddPrice={handleAddPrice}
              />
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No price data yet</h3>
              <p className="mb-4">Start adding prices to see best deals here</p>
              <Link to="/prices">
                <Button>Add Price Entries</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
      
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

export default Dashboard;