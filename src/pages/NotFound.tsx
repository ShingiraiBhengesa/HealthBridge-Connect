
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/AnimatedTransition";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <FadeIn className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="mb-6 bg-muted/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button 
            size="lg"
            className="px-8"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </div>
      </FadeIn>
    </Layout>
  );
};

export default NotFound;
