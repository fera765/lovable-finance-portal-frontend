
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAdminPosts, getCategories, deletePost } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Post {
  id: number;
  title: string;
  status: 'published' | 'draft';
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface Filters {
  categoryId?: number;
  status?: 'published' | 'draft';
  search?: string;
}

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories and posts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch posts with filters
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const limit = 10;
      const params = {
        ...filters,
        page: currentPage,
        limit,
      };
      
      const data = await getAdminPosts(params);
      setPosts(data);
      
      // This API might not return total pages information
      // For now, we'll just check if we got fewer than the limit
      setTotalPages(data.length < limit ? currentPage : currentPage + 1);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as notícias.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, filters]);

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when filters change
    const newFilters: Filters = {};
    
    if (filters.categoryId) {
      newFilters.categoryId = filters.categoryId;
    }
    
    if (filters.status) {
      newFilters.status = filters.status;
    }
    
    if (searchTerm.trim()) {
      newFilters.search = searchTerm.trim();
    }
    
    setFilters(newFilters);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  // Delete post
  const handleDeletePost = async () => {
    if (!postToDelete) return;

    try {
      setIsDeleting(true);
      await deletePost(postToDelete.id);
      toast({
        title: "Sucesso",
        description: `Notícia "${postToDelete.title}" excluída com sucesso.`,
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a notícia.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Gerenciar Notícias</h1>
          <Link to="/admin/noticias/nova">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Notícia
            </Button>
          </Link>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <Select 
                value={filters.categoryId?.toString() || ''}
                onValueChange={(value) => setFilters({
                  ...filters,
                  categoryId: value ? parseInt(value) : undefined
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select 
                value={filters.status || ''}
                onValueChange={(value) => setFilters({
                  ...filters,
                  status: value as 'published' | 'draft' | undefined
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os status</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <div className="relative">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por título"
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button 
                onClick={applyFilters}
                className="flex-1"
              >
                Aplicar Filtros
              </Button>
              
              <Button 
                variant="outline" 
                onClick={resetFilters}
              >
                Limpar
              </Button>
            </div>
          </div>
        </div>
        
        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Criação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Última Atualização
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhuma notícia encontrada.
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{post.categoryName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(post.updatedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link to={`/admin/noticias/editar/${post.id}`}>
                              <Button variant="ghost" size="icon" className="text-finance-primary">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="text-red-500"
                                  onClick={() => setPostToDelete(post)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Excluir Notícia</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir a notícia "{post.title}"?
                                    <br /><br />
                                    <span className="font-medium text-red-600">
                                      Esta ação não pode ser desfeita.
                                    </span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={handleDeletePost}
                                    className="bg-red-500 hover:bg-red-600"
                                    disabled={isDeleting}
                                  >
                                    {isDeleting ? 'Excluindo...' : 'Excluir'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!isLoading && posts.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Página {currentPage}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  Anterior
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Posts;
