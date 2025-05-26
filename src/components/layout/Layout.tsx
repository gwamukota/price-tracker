import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  // Update page title
  React.useEffect(() => {
    if (title) {
      document.title = `${title} | PriceTrack`;
    } else {
      document.title = 'PriceTrack - Supplier Price Tracker';
    }
  }, [title]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-16 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {title && (
            <div className="py-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PriceTrack - Supplier Price Tracker for Shopkeepers
        </div>
      </footer>
    </div>
  );
};

export default Layout;