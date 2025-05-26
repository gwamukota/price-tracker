import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Product, Supplier } from '../../types';

interface PriceEntryFormProps {
  productId?: string;
  supplierId?: string;
  onClose: () => void;
}

const PriceEntryForm: React.FC<PriceEntryFormProps> = ({
  productId,
  supplierId,
  onClose,
}) => {
  const { products, suppliers, addPriceEntry } = useAppContext();
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    productId: productId || '',
    supplierId: supplierId || '',
    price: '',
    date: today,
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.productId) {
      newErrors.productId = 'Product is required';
    }
    
    if (!formData.supplierId) {
      newErrors.supplierId = 'Supplier is required';
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    addPriceEntry({
      productId: formData.productId,
      supplierId: formData.supplierId,
      price: parseFloat(formData.price),
      date: new Date(formData.date).toISOString(),
      notes: formData.notes,
    });
    
    onClose();
  };
  
  // Create product options
  const productOptions = [
    { value: '', label: 'Select a product...' },
    ...products
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((product) => ({
        value: product.id,
        label: `${product.name} (${product.unit})`,
      })),
  ];
  
  // Create supplier options
  const supplierOptions = [
    { value: '', label: 'Select a supplier...' },
    ...suppliers
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((supplier) => ({
        value: supplier.id,
        label: supplier.name,
      })),
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Product"
        name="productId"
        value={formData.productId}
        options={productOptions}
        onChange={(value) => handleSelectChange('productId', value)}
        error={errors.productId}
        fullWidth
        required
        disabled={!!productId}
      />
      
      <Select
        label="Supplier"
        name="supplierId"
        value={formData.supplierId}
        options={supplierOptions}
        onChange={(value) => handleSelectChange('supplierId', value)}
        error={errors.supplierId}
        fullWidth
        required
        disabled={!!supplierId}
      />
      
      <Input
        label="Price"
        name="price"
        type="number"
        step="0.01"
        min="0"
        value={formData.price}
        onChange={handleChange}
        error={errors.price}
        fullWidth
        required
      />
      
      <Input
        label="Date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        error={errors.date}
        fullWidth
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit">Add Price Entry</Button>
      </div>
    </form>
  );
};

export default PriceEntryForm;