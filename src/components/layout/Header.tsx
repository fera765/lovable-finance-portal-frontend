
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '@/api/apiClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

const Header: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="bg-finance-primary-dark text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="text-finance-primary">Finance</span>
            <span className="text-white">Portal</span>
          </Link>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-white" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-white hover:text-finance-primary transition-colors"
            >
              Home
            </Link>
            
            {!isLoading && categories.map((category) => (
              <Link
                key={category.id}
                to={`/categoria/${category.id}`}
                className="text-white hover:text-finance-primary transition-colors"
              >
                {category.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Link to="/admin" className="bg-finance-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
                Painel Admin
              </Link>
            ) : (
              <Link to="/admin/login" className="text-white hover:text-finance-primary transition-colors">
                Login
              </Link>
            )}
          </nav>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-2 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-white hover:text-finance-primary transition-colors py-2"
            >
              Home
            </Link>
            
            {!isLoading && categories.map((category) => (
              <Link
                key={category.id}
                to={`/categoria/${category.id}`}
                className="text-white hover:text-finance-primary transition-colors py-2"
              >
                {category.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Link to="/admin" className="bg-finance-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition-colors">
                Painel Admin
              </Link>
            ) : (
              <Link to="/admin/login" className="text-white hover:text-finance-primary transition-colors py-2">
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
