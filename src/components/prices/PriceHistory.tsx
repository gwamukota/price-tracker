import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { format, parseISO } from 'date-fns';
import Card from '../ui/Card';
import { PriceEntry, Product, Supplier } from '../../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceHistoryProps {
  product: Product;
  suppliers: Supplier[];
  priceEntries: PriceEntry[];
}

const PriceHistory: React.FC<PriceHistoryProps> = ({
  product,
  suppliers,
  priceEntries
}) => {
  // Filter price entries for the current product
  const filteredEntries = priceEntries.filter(
    (entry) => entry.productId === product.id
  );
  
  if (filteredEntries.length === 0) {
    return (
      <Card title="Price History">
        <div className="text-center py-8 text-gray-500">
          No price data available for this product
        </div>
      </Card>
    );
  }
  
  // Group entries by supplier
  const supplierMap = new Map<string, { name: string; entries: PriceEntry[] }>();
  
  suppliers.forEach((supplier) => {
    const supplierEntries = filteredEntries.filter(
      (entry) => entry.supplierId === supplier.id
    );
    
    if (supplierEntries.length > 0) {
      supplierMap.set(supplier.id, {
        name: supplier.name,
        entries: supplierEntries.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      });
    }
  });
  
  // Prepare chart data
  const colors = [
    'rgb(59, 130, 246)', // Blue
    'rgb(13, 148, 136)', // Teal
    'rgb(245, 158, 11)', // Amber
    'rgb(22, 163, 74)',  // Green
    'rgb(225, 29, 72)',  // Red
    'rgb(124, 58, 237)', // Purple
  ];
  
  // Get unique dates from all entries
  const allDates = Array.from(
    new Set(
      filteredEntries.map((entry) => 
        format(parseISO(entry.date), 'yyyy-MM-dd')
      )
    )
  ).sort();
  
  const datasets = Array.from(supplierMap.entries()).map(([id, { name, entries }], index) => {
    const dataPoints = allDates.map(date => {
      const matchingEntry = entries.find(entry => 
        format(parseISO(entry.date), 'yyyy-MM-dd') === date
      );
      return matchingEntry ? matchingEntry.price : null;
    });
    
    return {
      label: name,
      data: dataPoints,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
      tension: 0.3,
      pointRadius: 3,
      pointHoverRadius: 5,
    };
  });
  
  const chartData: ChartData<'line'> = {
    labels: allDates.map(date => format(parseISO(date), 'MMM d, yyyy')),
    datasets,
  };
  
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(value as number);
          },
        },
      },
    },
  };
  
  return (
    <Card title="Price History">
      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
    </Card>
  );
};

export default PriceHistory;