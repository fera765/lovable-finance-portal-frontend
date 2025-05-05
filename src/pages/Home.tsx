
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '@/api/apiClient';
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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

const Home: React.FC = () => {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getPosts({ limit: 7 });
        
        if (data.length > 0) {
          // Set first post as featured
          setFeaturedPost(data[0]);
          // Set the rest as recent posts
          setRecentPosts(data.slice(1));
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Falha ao carregar as notícias. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

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
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="news-card">
              <Skeleton className="h-40 w-full" />
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
      {/* Featured Post */}
      {featuredPost && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="mb-2">
              <span className="inline-block bg-finance-primary text-white text-xs px-3 py-1 rounded-full">
                {featuredPost.categoryName}
              </span>
              <span className="text-finance-neutral text-sm ml-3">
                {formatDate(featuredPost.createdAt)}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-finance-primary-dark">
              {featuredPost.title}
            </h1>
            
            <div className="prose max-w-none mb-4">
              {truncateContent(featuredPost.content, 300)}
            </div>
            
            <Link to={`/noticia/${featuredPost.id}`}>
              <Button variant="default">
                Ler mais
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Recent Posts Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-finance-primary-dark border-l-4 border-finance-primary pl-3">
          Notícias Recentes
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Card key={post.id} className="news-card">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block bg-finance-primary/10 text-finance-primary text-xs px-2 py-1 rounded">
                    {post.categoryName}
                  </span>
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
      </div>
    </div>
  );
};

export default Home;
