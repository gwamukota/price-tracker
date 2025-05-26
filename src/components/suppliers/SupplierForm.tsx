import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Supplier } from '../../types';

interface SupplierFormProps {
  supplier?: Supplier;
  onClose: () => void;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplier, onClose }) => {
  const { addSupplier, updateSupplier } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contact: supplier?.contact || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    notes: supplier?.notes || '',
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
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (supplier) {
      updateSupplier(supplier.id, formData);
    } else {
      addSupplier(formData);
    }
    
    onClose();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Supplier Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        fullWidth
        required
      />
      
      <Input
        label="Contact Person"
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        fullWidth
      />
      
      <Input
        label="Phone Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        error={errors.phone}
        fullWidth
        required
      />
      
      <Input
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
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
          {supplier ? 'Update Supplier' : 'Add Supplier'}
        </Button>
      </div>
    </form>
  );
};

export default SupplierForm;