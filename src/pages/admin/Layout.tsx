
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getHomepageLayout, updateHomepageLayout } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { ArrowUp, ArrowDown, Save } from 'lucide-react';

// Sample layout blocks (these would come from the API)
const LAYOUT_BLOCK_NAMES: Record<string, string> = {
  'featured': 'Notícia em Destaque',
  'recent': 'Notícias Recentes',
  'category-finance': 'Finanças',
  'category-market': 'Mercado',
  'category-crypto': 'Criptomoedas',
  'popular': 'Mais Lidas',
};

interface LayoutBlock {
  id: string;
  name: string;
}

const LayoutEditor: React.FC = () => {
  const [layoutBlocks, setLayoutBlocks] = useState<LayoutBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Fetch layout
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        setIsLoading(true);
        const data = await getHomepageLayout();
        
        // Transform the data into blocks with names
        const blocks = data.map((blockId: string) => ({
          id: blockId,
          name: LAYOUT_BLOCK_NAMES[blockId] || blockId,
        }));
        
        setLayoutBlocks(blocks);
      } catch (error) {
        console.error('Error fetching layout:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o layout da homepage.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLayout();
  }, []);

  // Move a block up or down
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === layoutBlocks.length - 1)) {
      return;
    }

    const newLayoutBlocks = [...layoutBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newLayoutBlocks[targetIndex];
    newLayoutBlocks[targetIndex] = newLayoutBlocks[index];
    newLayoutBlocks[index] = temp;
    
    setLayoutBlocks(newLayoutBlocks);
    setIsDirty(true);
  };

  // Save layout
  const saveLayout = async () => {
    try {
      setIsSaving(true);
      
      // Extract just the block IDs for the API
      const blockIds = layoutBlocks.map(block => block.id);
      await updateHomepageLayout(blockIds);
      
      toast({
        title: "Sucesso",
        description: "Layout atualizado com sucesso.",
      });
      
      setIsDirty(false);
    } catch (error) {
      console.error('Error saving layout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o layout.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Layout da Homepage</h1>
          
          <Button
            onClick={saveLayout}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? (
              <span className="flex items-center">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Salvando...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Salvar Layout
              </span>
            )}
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Organize os Blocos da Homepage</h2>
            <p className="text-gray-500 text-sm mt-1">
              Arraste os blocos para reordenar como eles aparecerão na página inicial.
            </p>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-3">
              {layoutBlocks.map((block, index) => (
                <Card key={block.id} className="border border-gray-200">
                  <CardHeader className="p-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-md">{block.name}</CardTitle>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === 0}
                          onClick={() => moveBlock(index, 'up')}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === layoutBlocks.length - 1}
                          onClick={() => moveBlock(index, 'down')}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 text-sm text-gray-500">
                    {block.id}
                  </CardContent>
                </Card>
              ))}
              
              {layoutBlocks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum bloco encontrado para organização.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default LayoutEditor;
