
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedPage, SlideUp } from '@/components/ui/AnimatedTransition';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ClipboardList, Users, Map, Sparkles } from 'lucide-react';

const HealthWorkerInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <AnimatedPage>
        <section className="py-6 sm:py-12 md:py-16">
          <div className="container px-2 sm:px-4 mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mb-4 sm:mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <SlideUp>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 flex items-center">
                <Users className="mr-2 sm:mr-3 h-6 sm:h-8 w-6 sm:w-8 text-health-primary" />
                Community Health Worker Toolkit
              </h1>
            </SlideUp>

            <div className="grid gap-6 sm:gap-8 mb-8 sm:mb-12">
              <Card className="col-span-1 md:col-span-2">
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-xl font-semibold mb-4">Empowering Frontline Healthcare Workers</h2>
                  <p className="mb-4">
                    HealthBridge provides community health workers with essential tools to monitor and care for patients 
                    in underserved communities, even without consistent internet access.
                  </p>
                  
                  <h3 className="font-semibold text-lg mt-6 mb-2">Key Features:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Offline patient management and tracking system</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Treatment protocols and checklists for common conditions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Digital diagnostic tools compatible with low-cost accessories</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Specialist consultation request system with prioritization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Community health mapping and outbreak monitoring tools</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 sm:mt-8 bg-muted/30 p-3 sm:p-4 rounded-lg">
                    <p className="text-sm italic">
                      <strong>For Healthcare Workers:</strong> Our tools are designed with input from community health workers 
                      across various regions to ensure they meet real-world needs in challenging environments.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 sm:gap-6">
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <ClipboardList className="mr-2 h-5 w-5 text-health-primary" />
                      Structured Workflows
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step guidance for assessments, treatments, and follow-ups ensures quality care delivery.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Map className="mr-2 h-5 w-5 text-health-primary" />
                      Community Mapping
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Track patient locations, health trends, and resource allocation needs across your community.
                    </p>
                  </CardContent>
                </Card>
                
                <Button 
                  variant="action" 
                  size="lg" 
                  className="w-full mt-4"
                  onClick={() => navigate('/health-worker')}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Access Health Worker Tools
                </Button>
              </div>
            </div>
            
            <div className="mt-8 sm:mt-12 border-t pt-6 sm:pt-8">
              <h2 className="text-xl font-semibold mb-4 sm:mb-6">How the Health Worker Toolkit Helps</h2>
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[
                  {
                    title: "Manage Patient Cases",
                    description: "Track individual patients with structured assessments, treatments, and scheduled follow-ups."
                  },
                  {
                    title: "Access Clinical Decision Support",
                    description: "Get guidance on diagnoses and treatments based on best practices for resource-limited settings."
                  },
                  {
                    title: "Connect with the Healthcare System",
                    description: "Bridge gaps between communities and formal healthcare through referrals and information sharing."
                  }
                ].map((step, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="bg-health-primary/10 text-health-primary w-8 h-8 rounded-full flex items-center justify-center text-lg font-semibold mb-4">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedPage>
    </Layout>
  );
};

export default HealthWorkerInfo;
