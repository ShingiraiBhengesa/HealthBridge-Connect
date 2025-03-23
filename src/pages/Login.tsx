
import { Layout } from '@/components/layout/Layout';
import { LoginForm } from '@/components/auth/LoginForm';
import { AnimatedPage } from '@/components/ui/AnimatedTransition';

const Login = () => {
  return (
    <Layout>
      <AnimatedPage>
        <div className="container max-w-6xl mx-auto py-12">
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">Welcome to HealthBridge Connect</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Log in to access your health records, check symptoms, or manage patient data.
              </p>
            </div>
            
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default Login;
