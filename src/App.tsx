import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { MainApp } from './components/MainApp';
import { AdminDashboard } from './components/AdminDashboard';

const queryClient = new QueryClient();

const App = () => {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route 
                path="/" 
                element={
                  showAdmin ? (
                    <AdminDashboard onClose={() => setShowAdmin(false)} />
                  ) : (
                    <MainApp onShowAdmin={() => setShowAdmin(true)} />
                  )
                } 
              />
              <Route 
                path="/admin" 
                element={<AdminDashboard onClose={() => setShowAdmin(false)} />} 
              />
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-primary mb-4 font-treesh">404</h1>
                      <p className="text-muted-foreground font-inter">Page not found</p>
                    </div>
                  </div>
                } 
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;