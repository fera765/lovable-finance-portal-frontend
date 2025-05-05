
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-finance-primary-dark text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold">
              <span className="text-finance-primary">Finance</span>
              <span className="text-white">Portal</span>
            </Link>
            <p className="text-sm mt-2 text-gray-300">
              Seu portal de notícias financeiras
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <Link to="/" className="text-gray-300 hover:text-finance-primary transition-colors">
              Home
            </Link>
            <Link to="/sobre" className="text-gray-300 hover:text-finance-primary transition-colors">
              Sobre
            </Link>
            <Link to="/contato" className="text-gray-300 hover:text-finance-primary transition-colors">
              Contato
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
          © {currentYear} Finance Portal. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
