import React, { useState, useMemo } from 'react';
import { Plus, Users, Search, ArrowUpDown } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SupplierCard from '../components/suppliers/SupplierCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import SupplierForm from '../components/suppliers/SupplierForm';
import { useAppContext } from '../context/AppContext';
import { Supplier } from '../types';

const Suppliers: React.FC = () => {
  const { 
    suppliers, 
    deleteSupplier, 
    searchTerm, 
    setSearchTerm,
    sortConfig,
    setSortConfig
  } = useAppContext();
  
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  // Handle supplier edit
  const handleEditSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsSupplierModalOpen(true);
  };
  
  // Handle supplier delete
  const handleDeleteSupplier = (id: string) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      deleteSupplier(id);
    }
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
  
  // Filter and sort suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers
      .filter(supplier => 
        searchTerm === '' || 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.notes.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const direction = sortConfig.direction === 'asc' ? 1 : -1;
        if (sortConfig.key === 'name') {
          return a.name.localeCompare(b.name) * direction;
        }
        if (sortConfig.key === 'createdAt') {
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
        }
        return 0;
      });
  }, [suppliers, searchTerm, sortConfig]);
  
  return (
    <Layout title="Suppliers">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            fullWidth
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
              setSelectedSupplier(null);
              setIsSupplierModalOpen(true);
            }}
          >
            Add Supplier
          </Button>
        </div>
      </div>
      
      {/* Suppliers Grid */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          {suppliers.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No suppliers yet</h3>
              <p className="text-gray-500 mb-4">Add your first supplier to get started</p>
              <Button
                onClick={() => {
                  setSelectedSupplier(null);
                  setIsSupplierModalOpen(true);
                }}
              >
                Add Supplier
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No matching suppliers</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            </>
          )}
        </div>
      )}
      
      {/* Add/Edit Supplier Modal */}
      <Modal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        title={selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}
        size="md"
      >
        <SupplierForm
          supplier={selectedSupplier || undefined}
          onClose={() => setIsSupplierModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

export default Suppliers;