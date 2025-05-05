
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAdminPosts, getCategories } from '@/api/apiClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Category, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Post {
  id: number;
  title: string;
  status: 'published' | 'draft';
  categoryId: number;
  categoryName: string;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch recent posts
        const postsData = await getAdminPosts({ limit: 5 });
        setPosts(postsData);
        
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Calculate some stats
  const publishedCount = posts.filter(post => post.status === 'published').length;
  const draftCount = posts.filter(post => post.status === 'draft').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link to="/admin/noticias/nova">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Notícia
            </Button>
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total de Notícias</CardDescription>
                  <CardTitle className="text-4xl">{posts.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-finance-neutral">
                    <span className="text-finance-primary font-medium">{publishedCount}</span> publicadas, 
                    <span className="text-finance-neutral font-medium ml-1">{draftCount}</span> rascunhos
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total de Categorias</CardDescription>
                  <CardTitle className="text-4xl">{categories.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link to="/admin/categorias" className="text-sm text-finance-primary hover:underline">
                    Gerenciar categorias
                  </Link>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Acesso Rápido</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link 
                      to="/admin/noticias" 
                      className="flex items-center text-finance-primary hover:underline"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Gerenciar Notícias
                    </Link>
                    <Link 
                      to="/admin/categorias" 
                      className="flex items-center text-finance-primary hover:underline"
                    >
                      <Category className="mr-2 h-4 w-4" />
                      Gerenciar Categorias
                    </Link>
                    <Link 
                      to="/admin/layout" 
                      className="flex items-center text-finance-primary hover:underline"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Layout da Homepage
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        {/* Recent Posts */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Notícias Recentes</h2>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {posts.map((post) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/admin/noticias/editar/${post.id}`}
                          className="text-finance-primary hover:text-finance-secondary"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {posts.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Nenhuma notícia encontrada.
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 text-right">
            <Link to="/admin/noticias" className="text-finance-primary hover:underline">
              Ver todas as notícias →
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
