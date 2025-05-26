import React from 'react';
import { Phone, MapPin, Edit, Trash2, User } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Supplier } from '../../types';
import { formatDate } from '../../utils/helpers';

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onEdit,
  onDelete,
}) => {
  return (
    <Card 
      className="h-full" 
      isHoverable
      footer={
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Added: {formatDate(supplier.createdAt)}
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(supplier)}
              leftIcon={<Edit className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(supplier.id)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </div>
        </div>
      }
    >
      <h3 className="text-lg font-bold text-gray-900 mb-2">{supplier.name}</h3>
      
      {supplier.contact && (
        <div className="flex items-start mt-3">
          <User className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
          <span className="text-sm text-gray-600">{supplier.contact}</span>
        </div>
      )}
      
      <div className="flex items-start mt-3">
        <Phone className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
        <span className="text-sm text-gray-600">{supplier.phone}</span>
      </div>
      
      {supplier.address && (
        <div className="flex items-start mt-3">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-2" />
          <span className="text-sm text-gray-600">{supplier.address}</span>
        </div>
      )}
      
      {supplier.notes && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-3">{supplier.notes}</p>
        </div>
      )}
    </Card>
  );
};

export default SupplierCard;