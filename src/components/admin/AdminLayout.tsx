import React, { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Settings,
  FileText, 
  FolderTree, 
  LogOut 
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const isActive = (path: string) => location.pathname === path;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-finance-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-finance-primary-dark text-white hidden md:block">
        <div className="p-4">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="text-finance-primary">Finance</span>
            <span className="text-white">Portal</span>
          </Link>
          <div className="mt-2 text-sm text-gray-300">Painel Administrativo</div>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Gerenciamento
          </div>
          
          <Link 
            to="/admin"
            className={`admin-link ${isActive('/admin') ? 'active' : ''}`}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/categorias"
            className={`admin-link ${isActive('/admin/categorias') ? 'active' : ''}`}
          >
            <FolderTree size={18} />
            <span>Categorias</span>
          </Link>
          
          <Link 
            to="/admin/noticias"
            className={`admin-link ${isActive('/admin/noticias') ? 'active' : ''}`}
          >
            <FileText size={18} />
            <span>Notícias</span>
          </Link>
          
          <Link 
            to="/admin/layout"
            className={`admin-link ${isActive('/admin/layout') ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>Layout da Homepage</span>
          </Link>
          
          <div className="px-4 mt-8 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Conta
          </div>
          
          <Button 
            variant="ghost" 
            className="admin-link w-full justify-start text-white"
            onClick={() => {
              logout();
              navigate('/');
            }}
          >
            <LogOut size={18} />
            <span>Sair</span>
          </Button>
        </nav>
      </aside>
      
      {/* Mobile Header */}
      <div className="md:hidden bg-finance-primary-dark text-white w-full p-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="text-finance-primary">Finance</span>
            <span className="text-white">Portal</span>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="text-white"
          >
            <LogOut size={18} />
          </Button>
        </div>
        
        {/* Mobile Navigation */}
        <div className="flex justify-between mt-4">
          <Link 
            to="/admin"
            className={`flex flex-col items-center p-2 ${isActive('/admin') ? 'bg-finance-primary rounded-md' : ''}`}
          >
            <Home size={18} />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/categorias"
            className={`flex flex-col items-center p-2 ${isActive('/admin/categorias') ? 'bg-finance-primary rounded-md' : ''}`}
          >
            <FolderTree size={18} />
            <span className="text-xs mt-1">Categorias</span>
          </Link>
          
          <Link 
            to="/admin/noticias"
            className={`flex flex-col items-center p-2 ${isActive('/admin/noticias') ? 'bg-finance-primary rounded-md' : ''}`}
          >
            <FileText size={18} />
            <span className="text-xs mt-1">Notícias</span>
          </Link>
          
          <Link 
            to="/admin/layout"
            className={`flex flex-col items-center p-2 ${isActive('/admin/layout') ? 'bg-finance-primary rounded-md' : ''}`}
          >
            <Settings size={18} />
            <span className="text-xs mt-1">Layout</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
