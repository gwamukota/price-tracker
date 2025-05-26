import React from 'react';
import { ArrowDown, ArrowUp, Minus, Tag } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { PriceComparison as PriceComparisonType } from '../../types';
import { formatCurrency, formatPercentage, getPriceChangeColorClass, findBestSupplier } from '../../utils/helpers';

interface PriceComparisonProps {
  comparison: PriceComparisonType;
  onAddPrice: (productId: string) => void;
}

const PriceComparison: React.FC<PriceComparisonProps> = ({
  comparison,
  onAddPrice,
}) => {
  const bestSupplier = findBestSupplier(comparison);
  
  return (
    <Card 
      title={comparison.productName}
      className="h-full"
      isHoverable
      footer={
        <div className="flex justify-between items-center">
          {bestSupplier ? (
            <span className="text-sm">
              Best price: <span className="font-semibold">{formatCurrency(bestSupplier.price)}</span> from <span className="font-semibold">{bestSupplier.supplierName}</span>
            </span>
          ) : (
            <span className="text-sm text-gray-500">No price data available</span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => onAddPrice(comparison.productId)}
            leftIcon={<Tag className="h-4 w-4" />}
          >
            Add Price
          </Button>
        </div>
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparison.suppliers.map((supplier) => (
              <tr key={supplier.supplierId} className="hover:bg-gray-50">
                <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {supplier.supplierName}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                  {supplier.currentPrice > 0 ? (
                    <span className="font-medium">
                      {formatCurrency(supplier.currentPrice)}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                  {supplier.priceChange !== null ? (
                    <div className="flex items-center justify-end">
                      <span className={getPriceChangeColorClass(supplier.priceChange)}>
                        {supplier.priceChange > 0 ? (
                          <ArrowUp className="inline h-3 w-3 mr-1" />
                        ) : supplier.priceChange < 0 ? (
                          <ArrowDown className="inline h-3 w-3 mr-1" />
                        ) : (
                          <Minus className="inline h-3 w-3 mr-1" />
                        )}
                        {formatPercentage(supplier.priceChange)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
            {comparison.suppliers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-4 text-sm text-center text-gray-500">
                  No price data available for this product
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default PriceComparison;