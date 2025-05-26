import React from 'react';
import { Edit, Trash2, Tag, Info, Package } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Product } from '../../types';
import { formatDate } from '../../utils/helpers';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onPrices: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onPrices,
}) => {
  return (
    <Card 
      className="h-full" 
      isHoverable
      footer={
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            Added: {formatDate(product.createdAt)}
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              leftIcon={<Edit className="h-4 w-4" />}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(product.id)}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Delete
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPrices(product)}
          leftIcon={<Tag className="h-4 w-4" />}
        >
          Prices
        </Button>
      </div>
      
      <div className="flex items-center mt-3">
        <Badge variant="primary" className="mr-2">
          {product.category}
        </Badge>
        <span className="text-sm text-gray-600">Unit: {product.unit}</span>
      </div>
      
      {product.description && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProductCard;