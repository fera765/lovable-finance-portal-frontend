
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

// Public Pages
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import NewsDetail from "@/pages/NewsDetail";
import NotFound from "@/pages/NotFound";

// Admin Pages
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import Categories from "@/pages/admin/Categories";
import Posts from "@/pages/admin/Posts";
import PostForm from "@/pages/admin/PostForm";
import LayoutEditor from "@/pages/admin/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/categoria/:id"
              element={
                <Layout>
                  <CategoryPage />
                </Layout>
              }
            />
            <Route
              path="/noticia/:id"
              element={
                <Layout>
                  <NewsDetail />
                </Layout>
              }
            />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/categorias" element={<Categories />} />
            <Route path="/admin/noticias" element={<Posts />} />
            <Route path="/admin/noticias/nova" element={<PostForm />} />
            <Route path="/admin/noticias/editar/:id" element={<PostForm />} />
            <Route path="/admin/layout" element={<LayoutEditor />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
