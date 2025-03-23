
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/AnimatedTransition';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll event to add background to header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle menu close on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Symptom Checker', path: '/symptom-checker' },
    { name: 'My Profile', path: '/patient-profile' },
    { name: 'Telemedicine', path: '/telemedicine' },
    { name: 'Health Worker', path: '/health-worker' },
  ];

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled || isMenuOpen ? 'glass shadow-sm' : 'bg-transparent'
    )}>
      <div className="px-4 md:container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-health-primary flex items-center justify-center">
              <span className="text-white font-bold">H+</span>
            </div>
            <span className="font-semibold text-lg">HealthBridge</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link 
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-health-primary",
                  location.pathname === item.path ? "text-health-primary" : "text-foreground/80"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User size={18} />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <FadeIn className="md:hidden border-t">
          <nav className="flex flex-col py-4 px-6 gap-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "py-2 text-base transition-colors hover:text-health-primary",
                  location.pathname === item.path ? "text-health-primary font-medium" : "text-foreground/80"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex gap-4 mt-2 pt-4 border-t">
              <Button variant="ghost" size="sm" className="flex-1">
                <Bell size={18} className="mr-2" />
                Notifications
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <User size={18} className="mr-2" />
                Profile
              </Button>
            </div>
          </nav>
        </FadeIn>
      )}
    </header>
  );
}
