
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

// Initialize axios instance with base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token for admin routes
apiClient.interceptors.request.use(
  (config) => {
    // Only add token for admin routes
    if (config.url?.startsWith('/admin')) {
      const token = localStorage.getItem('financePortalToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('financePortalToken');
      if (window.location.pathname.startsWith('/admin') && 
          window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
        toast({
          title: "Sessão expirada",
          description: "Sua sessão expirou. Por favor, faça login novamente.",
          variant: "destructive",
        });
      }
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      toast({
        title: "Erro no servidor",
        description: "Ocorreu um erro no servidor. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
    
    return Promise.reject(error);
  }
);

// API functions

// Auth
export const loginUser = async (email: string, password: string) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

export const createCategory = async (name: string) => {
  const response = await apiClient.post('/admin/categories', { name });
  return response.data;
};

export const deleteCategory = async (id: number) => {
  const response = await apiClient.delete(`/admin/categories/${id}`);
  return response.data;
};

// Posts
export const getPosts = async (params?: { categoryId?: number; page?: number; limit?: number }) => {
  const response = await apiClient.get('/posts', { params });
  return response.data;
};

export const getPostById = async (id: number) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};

export const getAdminPosts = async (params?: { 
  categoryId?: number; 
  status?: 'published' | 'draft';
  page?: number; 
  limit?: number 
}) => {
  const response = await apiClient.get('/admin/posts', { params });
  return response.data;
};

export const createPost = async (postData: {
  title: string;
  content: string;
  categoryId: number;
  status: 'published' | 'draft';
}) => {
  const response = await apiClient.post('/admin/posts', postData);
  return response.data;
};

export const updatePost = async (
  id: number,
  postData: {
    title?: string;
    content?: string;
    categoryId?: number;
    status?: 'published' | 'draft';
  }
) => {
  const response = await apiClient.put(`/admin/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: number) => {
  const response = await apiClient.delete(`/admin/posts/${id}`);
  return response.data;
};

// Homepage Layout
export const getHomepageLayout = async () => {
  const response = await apiClient.get('/admin/layout/homepage');
  return response.data;
};

export const updateHomepageLayout = async (layout: any[]) => {
  const response = await apiClient.put('/admin/layout/homepage', layout);
  return response.data;
};

export default apiClient;
