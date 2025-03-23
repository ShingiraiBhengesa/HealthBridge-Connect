
import React from 'react';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 ${isMobile ? 'pt-14' : 'pt-16 sm:pt-20'}`}>
        <div className="container mx-auto px-2 sm:px-4 md:px-6 max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
};
