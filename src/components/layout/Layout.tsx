
import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  withoutHeader?: boolean;
}

export function Layout({ 
  children, 
  className, 
  fullWidth = false,
  withoutHeader = false 
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {!withoutHeader && <Header />}
      <main className={cn(
        "flex-1 pt-20", // Add padding-top to account for fixed header
        !fullWidth && "px-4 md:container",
        className
      )}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
    </div>
  );
}
