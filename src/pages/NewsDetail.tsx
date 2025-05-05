
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPostById } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DOMPurify from 'dompurify';

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
  return format(date, "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
};

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || '0');
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Falha ao carregar a notícia. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Sanitize HTML content
  const createSanitizedContent = (content: string) => {
    return { __html: DOMPurify.sanitize(content) };
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-finance-primary-dark mb-4">Oops!</h2>
        <p className="text-finance-dark-gray mb-6">
          {error || 'Notícia não encontrada.'}
        </p>
        <Button onClick={() => navigate('/')}>Voltar para a Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-finance-primary-dark">
          {post.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-finance-neutral space-y-2 sm:space-y-0">
          <Link 
            to={`/categoria/${post.categoryId}`}
            className="inline-block bg-finance-primary/10 text-finance-primary px-3 py-1 rounded"
          >
            {post.categoryName}
          </Link>
          
          <div>
            <span>Publicado em {formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <span className="block sm:inline sm:ml-2">
                (Atualizado em {formatDate(post.updatedAt)})
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Article Content */}
      <article className="prose max-w-none">
        <div dangerouslySetInnerHTML={createSanitizedContent(post.content)} />
      </article>
      
      {/* Article Footer */}
      <div className="border-t border-gray-200 mt-12 pt-8 flex justify-between">
        <Link to={`/categoria/${post.categoryId}`}>
          <Button variant="outline">
            Ver mais em {post.categoryName}
          </Button>
        </Link>
        
        <Link to="/">
          <Button variant="default">
            Voltar para a Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NewsDetail;
