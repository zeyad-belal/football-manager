import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, DollarSign, LogOut } from 'lucide-react';
import { formatCurrency } from '@/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, team, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 mt-12">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Football Manager
              </h1>
              {team && (
                <div className="ml-8 flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{team.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium">{formatCurrency(team.budget)}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span>{user?.email}</span>
              </div>
              <button
                onClick={logout}
                className="btn-secondary flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
