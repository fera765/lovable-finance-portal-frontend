
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPosts, getCategories } from '@/api/apiClient';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Post {
  id: number;
  title: string;
  content: string;
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = parseInt(id || '0');
  
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch category and posts
  useEffect(() => {
    const fetchCategoryAndPosts = async () => {
      try {
        setIsLoading(true);
        
        // First, get the category name
        const categories = await getCategories();
        const categoryData = categories.find((cat: Category) => cat.id === categoryId);
        if (categoryData) {
          setCategory(categoryData);
        } else {
          setError('Categoria não encontrada.');
          return;
        }
        
        // Then, get posts for this category
        const limit = 9;
        const postsData = await getPosts({ 
          categoryId, 
          page: currentPage,
          limit 
        });
        
        setPosts(postsData);
        
        // This API might not return total pages information
        // For now, we'll just check if we got fewer than the limit
        setTotalPages(postsData.length < limit ? currentPage : currentPage + 1);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Falha ao carregar os dados. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndPosts();
    }
  }, [categoryId, currentPage]);

  // Truncate content for preview
  const truncateContent = (content: string, maxLength: number = 150): string => {
    // Remove HTML tags
    const strippedContent = content.replace(/<\/?[^>]+(>|$)/g, '');
    if (strippedContent.length <= maxLength) return strippedContent;
    return `${strippedContent.substring(0, maxLength)}...`;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <Card key={i} className="news-card">
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-finance-primary-dark mb-4">Oops!</h2>
        <p className="text-finance-dark-gray mb-6">{error}</p>
        <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-finance-primary-dark border-b-2 border-finance-primary pb-2">
        {category?.name}
      </h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-finance-dark-gray mb-6">
            Nenhuma notícia encontrada nesta categoria.
          </p>
          <Link to="/">
            <Button variant="default">Voltar para a Home</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="news-card">
                <CardHeader>
                  <div className="flex justify-end mb-2">
                    <span className="text-finance-neutral text-xs">
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="text-xl">
                    <Link 
                      to={`/noticia/${post.id}`}
                      className="hover:text-finance-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <p className="text-finance-dark-gray text-sm">
                    {truncateContent(post.content)}
                  </p>
                </CardContent>
                
                <CardFooter>
                  <Link 
                    to={`/noticia/${post.id}`}
                    className="text-finance-primary hover:underline text-sm"
                  >
                    Continuar lendo →
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Anterior
              </Button>
              
              <Button
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryPage;
