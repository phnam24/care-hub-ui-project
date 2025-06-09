
import React from 'react';
import Navigation from './Navigation';
import FloatingChatButton from './chat/FloatingChatButton';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Show floating chat button only for patients */}
      {user?.role === 'patient' && <FloatingChatButton />}
    </div>
  );
};

export default Layout;
