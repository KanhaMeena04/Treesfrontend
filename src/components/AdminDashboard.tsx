import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminSidebar } from './AdminSidebar';
import { AdminContent } from './AdminContent';
import { Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard = ({ onClose }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 z-50 shadow-xl transform transition-transform duration-300 ease-in-out">
          <AdminSidebar 
            activeSection={activeSection} 
            onSectionChange={(section) => {
              setActiveSection(section);
              setMobileSidebarOpen(false);
            }}
            isMobile={true}
            onClose={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          isMobile={false}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        {isMobile && (
          <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileSidebar}
                className="h-11 w-11 bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-md"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-red-500">Admin Dashboard</h1>
                <Badge variant="secondary" className="bg-blue-500 text-white text-xs w-fit px-2 py-1">
                  Administrator
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm px-4 py-2 h-10 shadow-sm"
            >
              Back to App
            </Button>
          </header>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <header className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-red-500">Admin Dashboard</h1>
              <Badge variant="secondary" className="bg-blue-500 text-white">Administrator</Badge>
            </div>
            <Button variant="outline" onClick={onClose} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
              Back to App
            </Button>
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <AdminContent activeSection={activeSection} />
          </div>
        </main>
      </div>
    </div>
  );
};