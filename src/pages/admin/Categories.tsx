
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getCategories, createCategory, deleteCategory } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Trash2, Plus } from 'lucide-react';
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

interface Category {
  id: number;
  name: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as categorias.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erro",
        description: "O nome da categoria não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAdding(true);
      await createCategory(newCategoryName);
      setNewCategoryName('');
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso.",
      });
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a categoria.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      toast({
        title: "Sucesso",
        description: `Categoria "${categoryToDelete.name}" excluída com sucesso.`,
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a categoria.",
        variant: "destructive",
      });
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
        
        {/* Add Category Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Adicionar Nova Categoria</h2>
          
          <div className="flex space-x-4">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da categoria"
              className="flex-1"
            />
            
            <Button
              onClick={handleAddCategory}
              disabled={isAdding || !newCategoryName.trim()}
            >
              {isAdding ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Adicionando...
                </span>
              ) : (
                <span className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </span>
              )}
            </Button>
          </div>
        </div>
        
        {/* Categories List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Categorias Existentes</h2>
          </div>
          
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.length === 0 ? (
                <li className="px-6 py-4 text-gray-500 text-center">
                  Nenhuma categoria encontrada.
                </li>
              ) : (
                categories.map((category) => (
                  <li key={category.id} className="px-6 py-4 flex justify-between items-center">
                    <span className="text-gray-800">{category.name}</span>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setCategoryToDelete(category)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir a categoria "{category.name}"?
                            <br /><br />
                            <span className="font-medium text-red-600">
                              Atenção: Esta ação não pode ser desfeita e pode afetar notícias vinculadas a esta categoria.
                            </span>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteCategory}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Categories;
