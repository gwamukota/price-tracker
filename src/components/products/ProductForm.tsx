import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { Product } from '../../types';

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct, getProductCategories } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    unit: product?.unit || '',
    description: product?.description || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  const existingCategories = getProductCategories();
  
  const unitOptions = [
    { value: '', label: 'Select a unit...' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'g', label: 'Gram (g)' },
    { value: 'l', label: 'Liter (L)' },
    { value: 'ml', label: 'Milliliter (mL)' },
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'box', label: 'Box' },
    { value: 'pack', label: 'Pack' },
    { value: 'bottle', label: 'Bottle' },
    { value: 'can', label: 'Can' },
    { value: 'bag', label: 'Bag' },
  ];
  
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
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (product) {
      updateProduct(product.id, formData);
    } else {
      addProduct(formData);
    }
    
    onClose();
  };
  
  // Create category options array with an empty option
  const categoryOptions = [
    { value: '', label: 'Select a category...' },
    ...existingCategories.map(category => ({ value: category, label: category })),
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Product Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        fullWidth
        required
      />
      
      {isAddingCategory ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            New Category
          </label>
          <div className="flex space-x-2">
            <Input
              name="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter new category"
              fullWidth
            />
            <Button type="button" onClick={handleAddCategory}>
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingCategory(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <Select
            label="Category"
            name="category"
            value={formData.category}
            options={categoryOptions}
            onChange={(value) => handleSelectChange('category', value)}
            error={errors.category}
            fullWidth
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsAddingCategory(true)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              + Add new category
            </button>
          </div>
        </div>
      )}
      
      <Select
        label="Unit"
        name="unit"
        value={formData.unit}
        options={unitOptions}
        onChange={(value) => handleSelectChange('unit', value)}
        error={errors.unit}
        fullWidth
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;