
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { UserType } from "@/utils/storageUtils";
import { User, LogOut, Settings, UserCircle, Activity, Stethoscope, Home, LogIn, UserPlus, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const UserMenu = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Determine which auth action to show based on current route
  const isOnLoginPage = location.pathname === "/login";
  const isOnRegisterPage = location.pathname === "/register";

  if (!isAuthenticated) {
    // Don't show login button if already on login page
    // Don't show register button if already on register page
    return (
      <div className="flex items-center space-x-3">
        {!isOnLoginPage && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground hover:bg-background/80" 
            asChild
          >
            <Link to="/login" className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
        )}
        {!isOnRegisterPage && (
          <Button 
            variant={isOnLoginPage ? "outline" : "default"} 
            size="sm" 
            className={`${isOnLoginPage ? "border-health-primary text-health-primary hover:bg-health-primary/5" : "bg-health-primary hover:bg-health-primary/90"} shadow-sm`}
            asChild
          >
            <Link to="/register" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Join Now
            </Link>
          </Button>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 border-health-primary/10 hover:border-health-primary/30 hover:bg-health-primary/5 transition-all duration-200"
        >
          <div className="flex items-center">
            <div className="size-6 rounded-full bg-health-primary/20 text-health-primary flex items-center justify-center mr-2">
              <UserCircle className="h-4 w-4" />
            </div>
            <span className="mr-1">{user?.name}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-background p-1 border-health-primary/10 shadow-lg shadow-health-primary/5">
        <DropdownMenuLabel className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
          <div className="size-8 rounded-full bg-health-primary/10 text-health-primary flex items-center justify-center">
            <UserCircle className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{user?.name}</span>
            <span className="text-xs">{user?.userType === UserType.PATIENT ? "Patient" : "Health Worker"}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        
        <DropdownMenuItem asChild className="py-2 cursor-pointer">
          <Link to="/" className="flex items-center w-full">
            <Home className="mr-2 h-4 w-4 text-health-primary" />
            Home
          </Link>
        </DropdownMenuItem>
        
        {user?.userType === UserType.PATIENT && (
          <>
            <DropdownMenuItem asChild className="py-2 cursor-pointer">
              <Link to="/patient-profile" className="flex items-center w-full">
                <User className="mr-2 h-4 w-4 text-health-primary" />
                My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2 cursor-pointer">
              <Link to="/symptom-checker" className="flex items-center w-full">
                <Activity className="mr-2 h-4 w-4 text-health-primary" />
                Symptom Checker
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2 cursor-pointer">
              <Link to="/telemedicine" className="flex items-center w-full">
                <Stethoscope className="mr-2 h-4 w-4 text-health-primary" />
                Telemedicine
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        {user?.userType === UserType.HEALTH_WORKER && (
          <>
            <DropdownMenuItem asChild className="py-2 cursor-pointer">
              <Link to="/health-worker" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4 text-health-primary" />
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-2 cursor-pointer">
              <Link to="/telemedicine" className="flex items-center w-full">
                <Stethoscope className="mr-2 h-4 w-4 text-health-primary" />
                Telemedicine
              </Link>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem 
          onClick={logout} 
          className="py-2 cursor-pointer text-destructive hover:bg-destructive/5 hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
