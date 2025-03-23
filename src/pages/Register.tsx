
import { Layout } from '@/components/layout/Layout';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AnimatedPage } from '@/components/ui/AnimatedTransition';

const Register = () => {
  return (
    <Layout>
      <AnimatedPage>
        <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center space-y-6 md:space-y-8">
            <div className="text-center space-y-3 md:space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Create Your Account</h1>
              <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base px-4">
                Sign up to access HealthBridge Connect services as a patient or health worker.
              </p>
            </div>
            
            <div className="w-full max-w-md px-4 md:px-0">
              <RegisterForm />
            </div>
          </div>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default Register;
