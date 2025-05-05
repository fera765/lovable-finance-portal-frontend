
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { getCategories, getPostById, createPost, updatePost } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Category {
  id: number;
  name: string;
}

const PostForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const postId = isEditMode ? parseInt(id) : null;
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories and post data if in edit mode
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        
        // Set first category as default if creating a new post
        if (!isEditMode && data.length > 0) {
          setCategoryId(data[0].id.toString());
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as categorias.",
          variant: "destructive",
        });
      }
    };

    const fetchPost = async () => {
      if (!postId) return;
      
      try {
        setIsLoading(true);
        const data = await getPostById(postId);
        setTitle(data.title);
        setContent(data.content);
        setCategoryId(data.categoryId.toString());
        setStatus(data.status);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da notícia.",
          variant: "destructive",
        });
        navigate('/admin/noticias');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    if (isEditMode) {
      fetchPost();
    }
  }, [isEditMode, postId, navigate]);

  // Save post
  const handleSave = async () => {
    // Validate form
    if (!title.trim()) {
      toast({
        title: "Erro",
        description: "O título é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "O conteúdo é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!categoryId) {
      toast({
        title: "Erro",
        description: "Selecione uma categoria.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const postData = {
        title,
        content,
        categoryId: parseInt(categoryId),
        status,
      };
      
      if (isEditMode && postId) {
        await updatePost(postId, postData);
        toast({
          title: "Sucesso",
          description: "Notícia atualizada com sucesso.",
        });
      } else {
        await createPost(postData);
        toast({
          title: "Sucesso",
          description: "Notícia criada com sucesso.",
        });
      }
      
      navigate('/admin/noticias');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Erro",
        description: `Não foi possível ${isEditMode ? 'atualizar' : 'criar'} a notícia.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Rich Text Editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Editar Notícia' : 'Nova Notícia'}
          </h1>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate('/admin/noticias')}
            >
              Cancelar
            </Button>
            
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título da notícia"
              />
            </div>
            
            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={categoryId}
                  onValueChange={setCategoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={status}
                  onValueChange={(value) => setStatus(value as 'published' | 'draft')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Publicado</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Content (WYSIWYG Editor) */}
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo</Label>
              <div className="min-h-[300px]">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  placeholder="Digite o conteúdo da notícia..."
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PostForm;
</lov-add-dependency>
<lov-add-dependency>react-quill@latest</lov-add-dependency>
