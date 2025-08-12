import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminSidebar } from './AdminSidebar';
import { AdminContent } from './AdminContent';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard = ({ onClose }: AdminDashboardProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-[#FF3D71]">Admin Dashboard</h1>
            <Badge variant="secondary" className="bg-[#007BFF] text-white">Administrator</Badge>
          </div>
          <Button variant="outline" onClick={onClose} className="border-[#FF3D71] text-[#FF3D71] hover:bg-[#FF3D71] hover:text-white">
            Back to App
          </Button>
        </header>

        <main className="flex-1 p-6">
          <AdminContent activeSection={activeSection} />
        </main>
      </div>
    </div>
  );
};