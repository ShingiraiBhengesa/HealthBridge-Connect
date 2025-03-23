import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, User, Home, Activity, Stethoscope, Users, LogIn, UserPlus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/AnimatedTransition';
import { cn } from '@/lib/utils';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/hooks/use-auth';
import { UserType } from '@/utils/storageUtils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const isOnAuthPage = ['/login', '/register'].includes(location.pathname);
  const isOnHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const getNavItems = () => {
    if (isOnHomePage) {
      return [
        { name: 'Home', action: () => scrollToSection('hero'), icon: Home },
        { name: 'Features', action: () => scrollToSection('features'), icon: Activity },
        { name: 'How It Works', action: () => scrollToSection('how-it-works'), icon: Users },
        { name: 'Our Impact', action: () => scrollToSection('impact'), icon: Activity }
      ];
    }
    
    if (!isAuthenticated) {
      return [
        { name: 'Home', path: '/', icon: Home }
      ];
    }

    if (user?.userType === UserType.PATIENT) {
      return [
        { name: 'My Profile', path: '/patient-profile', icon: User },
        { name: 'Telemedicine', path: '/telemedicine', icon: Stethoscope }
      ];
    }

    if (user?.userType === UserType.HEALTH_WORKER) {
      return [
        { name: 'Dashboard', path: '/health-worker', icon: Users },
        { name: 'Telemedicine', path: '/telemedicine', icon: Stethoscope }
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled || isMenuOpen ? 'glass shadow-sm' : 'bg-transparent'
    )}>
      <div className="px-4 sm:px-6 md:container py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link 
            to={isAuthenticated ? 
              (user?.userType === UserType.PATIENT ? '/patient-profile' : '/health-worker') : 
              '/'
            } 
            className="flex items-center gap-1.5 sm:gap-2 transition-transform hover:scale-105"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-health-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-base">H+</span>
            </div>
            <span className="font-semibold text-base sm:text-lg">HealthBridge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.path ? (
                  <Link 
                    to={item.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-health-primary flex items-center gap-1.5 px-2 lg:px-3 py-2 rounded-full hover:bg-health-primary/10",
                      location.pathname === item.path ? "text-health-primary bg-health-primary/5" : "text-foreground/80"
                    )}
                  >
                    <item.icon size={16} />
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="text-sm font-medium transition-colors hover:text-health-primary flex items-center gap-1.5 px-2 lg:px-3 py-2 rounded-full hover:bg-health-primary/10 text-foreground/80"
                  >
                    <item.icon size={16} />
                    {item.name}
                  </button>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/telemedicine">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full hover:bg-health-primary/10"
                  >
                    <MessageSquare size={18} />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-health-primary/10"
                >
                  <Bell size={18} />
                </Button>
              </>
            ) : null}
            <UserMenu />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <FadeIn className="md:hidden border-t">
          <nav className="flex flex-col py-3 px-4 gap-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navItems.map((item, index) => (
              <div key={index}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={cn(
                      "py-2 text-base transition-colors hover:text-health-primary flex items-center gap-2 px-3 rounded-md hover:bg-health-primary/5",
                      location.pathname === item.path ? "text-health-primary bg-health-primary/5 font-medium" : "text-foreground/80"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="py-2 text-base w-full text-left transition-colors hover:text-health-primary flex items-center gap-2 px-3 rounded-md hover:bg-health-primary/5 text-foreground/80"
                  >
                    <item.icon size={18} />
                    {item.name}
                  </button>
                )}
              </div>
            ))}
            
            <div className="flex flex-col gap-2 mt-2 pt-3 border-t">
              {isAuthenticated ? (
                <>
                  <Link to="/telemedicine" className="w-full">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="justify-start hover:bg-health-primary/5 w-full"
                    >
                      <MessageSquare size={18} className="mr-2" />
                      Messages
                    </Button>
                  </Link>
                  
                  <Button variant="ghost" size="sm" className="justify-start hover:bg-health-primary/5">
                    <Bell size={18} className="mr-2" />
                    Notifications
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start hover:bg-health-primary/5"
                    onClick={() => {
                      const path = user?.userType === UserType.PATIENT 
                        ? '/patient-profile' 
                        : '/health-worker';
                      window.location.href = path;
                      setIsMenuOpen(false);
                    }}
                  >
                    <User size={18} className="mr-2" />
                    Profile
                  </Button>
                </>
              ) : (
                <UserMenu />
              )}
            </div>
          </nav>
        </FadeIn>
      )}
    </header>
  );
}
