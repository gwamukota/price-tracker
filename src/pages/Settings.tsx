import React, { useState } from 'react';
import { Save, Trash2, Download, Upload, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Export data as JSON
  const handleExport = () => {
    const data = {
      suppliers: JSON.parse(localStorage.getItem('suppliers') || '[]'),
      products: JSON.parse(localStorage.getItem('products') || '[]'),
      priceEntries: JSON.parse(localStorage.getItem('priceEntries') || '[]'),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `pricetrack-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  };
  
  // Import data from JSON file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        
        if (data.suppliers) {
          localStorage.setItem('suppliers', JSON.stringify(data.suppliers));
        }
        
        if (data.products) {
          localStorage.setItem('products', JSON.stringify(data.products));
        }
        
        if (data.priceEntries) {
          localStorage.setItem('priceEntries', JSON.stringify(data.priceEntries));
        }
        
        // Reload the page to refresh data
        window.location.reload();
      } catch (error) {
        alert('Error importing data. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
  };
  
  // Reset all data
  const handleReset = () => {
    localStorage.removeItem('suppliers');
    localStorage.removeItem('products');
    localStorage.removeItem('priceEntries');
    
    // Reload the page to refresh data
    window.location.reload();
  };
  
  return (
    <Layout title="Settings">
      <div className="grid grid-cols-1 gap-6 max-w-3xl">
        {/* Data Management */}
        <Card 
          title="Data Management" 
          subtitle="Export, import, or reset your data"
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-base font-medium text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-500">Download all your data as a JSON file</p>
              </div>
              <Button
                variant="outline"
                onClick={handleExport}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export
              </Button>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Import Data</h4>
                  <p className="text-sm text-gray-500">Upload a previously exported JSON file</p>
                </div>
                <div>
                  <Input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    id="import-file"
                    className="hidden"
                  />
                  <label htmlFor="import-file">
                    <Button
                      variant="outline"
                      as="span"
                      leftIcon={<Upload className="h-4 w-4" />}
                    >
                      Import
                    </Button>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Reset Data</h4>
                  <p className="text-sm text-gray-500">Delete all your data and start fresh</p>
                </div>
                {!showResetConfirm ? (
                  <Button
                    variant="danger"
                    onClick={() => setShowResetConfirm(true)}
                    leftIcon={<Trash2 className="h-4 w-4" />}
                  >
                    Reset
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowResetConfirm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleReset}
                    >
                      Confirm Reset
                    </Button>
                  </div>
                )}
              </div>
              
              {showResetConfirm && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">
                    Warning: This action cannot be undone. All your data will be permanently deleted.
                    Please export your data first if you want to keep a backup.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
        
        {/* About */}
        <Card title="About PriceTrack">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              PriceTrack is a tool designed to help shopkeepers in informal markets compare 
              and track supplier prices to make smarter purchasing decisions.
            </p>
            
            <div className="pt-2">
              <h4 className="text-base font-medium text-gray-900 mb-2">Features</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>Add and manage suppliers</li>
                <li>Track products and their details</li>
                <li>Record price changes over time</li>
                <li>Compare prices across different suppliers</li>
                <li>Identify price trends and best deals</li>
                <li>Export and import data for backup</li>
              </ul>
            </div>
            
            <div className="pt-2">
              <h4 className="text-base font-medium text-gray-900 mb-2">Data Storage</h4>
              <p className="text-sm text-gray-600">
                All your data is stored locally on your device using your browser's local storage.
                No data is sent to any server. Make sure to export your data regularly as a backup.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;