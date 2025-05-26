import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, BarChart3, Package, Users, DollarSign, Settings } from 'lucide-react';
import Input from '../ui/Input';
import { useAppContext } from '../../context/AppContext';

const Header: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { searchTerm, setSearchTerm } = useAppContext();
  
  // Track scroll position to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const navigation = [
    { name: 'Dashboard', path: '/', icon: BarChart3 },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Suppliers', path: '/suppliers', icon: Users },
    { name: 'Price Tracker', path: '/prices', icon: DollarSign },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];
  
  const headerClasses = `fixed top-0 left-0 right-0 z-10 transition-all duration-200 
    ${isScrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`;
  
  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PriceTrack</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-1 py-2 text-sm font-medium transition-colors border-b-2 ${
                    isActive
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-200'
                  }`}
                >
                  <Icon className="mr-1 h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center">
            <Input
              type="text"
              placeholder="Search products or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              className="w-56 lg:w-72"
            />
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-4 pb-3 space-y-1">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
              fullWidth
            />
          </div>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;