
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { loginUser } from '@/api/apiClient';
import { toast } from '@/components/ui/use-toast';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('financePortalToken');
    if (token) {
      try {
        // In a real app, verify the token here
        // For now, we'll just assume a token exists means the user is logged in
        const emailFromStorage = localStorage.getItem('financePortalUserEmail');
        if (emailFromStorage) {
          setUser({ email: emailFromStorage });
        }
      } catch (error) {
        console.error('Failed to verify authentication:', error);
        localStorage.removeItem('financePortalToken');
        localStorage.removeItem('financePortalUserEmail');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await loginUser(email, password);
      const { token } = response;
      
      localStorage.setItem('financePortalToken', token);
      localStorage.setItem('financePortalUserEmail', email);
      
      setUser({ email });
      toast({
        title: "Login bem-sucedido",
        description: "Você está logado como administrador.",
      });
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Falha no login",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('financePortalToken');
    localStorage.removeItem('financePortalUserEmail');
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você saiu com sucesso.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
