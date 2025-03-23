
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedPage, SlideUp } from '@/components/ui/AnimatedTransition';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, CheckCircle2, HeartPulse, Shield } from 'lucide-react';

const SymptomCheckerInfo = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <AnimatedPage>
        <section className="py-12 md:py-16">
          <div className="container px-4 mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <SlideUp>
              <h1 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
                <Activity className="mr-3 h-8 w-8 text-health-primary" />
                Check Your Symptoms
              </h1>
            </SlideUp>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">How Our Symptom Checker Works</h2>
                  <p className="mb-4">
                    HealthBridge's symptom checker uses medically-validated algorithms to help you evaluate health concerns even when you're offline. 
                    It's designed to be accessible in low-connectivity environments while providing reliable guidance.
                  </p>
                  
                  <h3 className="font-semibold text-lg mt-6 mb-2">Key Features:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Works 100% offline once downloaded</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>User-friendly interface with visual cues for all literacy levels</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Provides tailored recommendations based on your symptoms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Regularly updated with the latest medical guidelines</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Supports multiple languages and accessibility features</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8 bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm italic">
                      <strong>Note:</strong> The symptom checker is not a replacement for professional medical advice. 
                      In case of emergency, seek immediate medical attention when possible.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-health-primary" />
                      Privacy First
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your symptom data remains on your device. If you choose to share it with healthcare providers, it's fully encrypted.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <HeartPulse className="mr-2 h-5 w-5 text-health-primary" />
                      Evidence Based
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Our algorithms are developed with healthcare professionals and follow international medical guidelines.
                    </p>
                  </CardContent>
                </Card>
                
                <Button 
                  variant="action" 
                  size="lg" 
                  className="w-full mt-4"
                  onClick={() => navigate('/symptom-checker')}
                >
                  <Activity className="mr-2 h-5 w-5" />
                  Try Symptom Checker
                </Button>
              </div>
            </div>
            
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold mb-6">How to Use the Symptom Checker</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Enter Your Symptoms",
                    description: "Select from our comprehensive list of symptoms or use the search function to find what you're experiencing."
                  },
                  {
                    title: "Answer Follow-up Questions",
                    description: "The system will ask relevant questions to better understand your condition and health context."
                  },
                  {
                    title: "Review Recommendations",
                    description: "Get tailored advice, potential causes, and guidance on whether to seek professional care."
                  }
                ].map((step, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
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

export default SymptomCheckerInfo;
