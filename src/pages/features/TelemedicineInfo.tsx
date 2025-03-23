
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedPage, SlideUp } from '@/components/ui/AnimatedTransition';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MessageSquare, Signal, Smartphone, Stethoscope, Wifi } from 'lucide-react';

const TelemedicineInfo = () => {
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
                <Stethoscope className="mr-3 h-8 w-8 text-health-primary" />
                Low-Bandwidth Telemedicine
              </h1>
            </SlideUp>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Connect with Healthcare Professionals Anywhere</h2>
                  <p className="mb-4">
                    HealthBridge's telemedicine platform is designed to work even in the most challenging connectivity environments,
                    allowing you to consult with healthcare professionals through text, voice messages, or low-bandwidth video when possible.
                  </p>
                  
                  <h3 className="font-semibold text-lg mt-6 mb-2">Key Features:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Text-based consultations that work with minimal connectivity</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Asynchronous messaging with automatic delivery when connectivity returns</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Compressed image sharing for sending photos of physical symptoms</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Voice message options when typing is difficult</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Adaptive video quality based on available bandwidth</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8 bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm italic">
                      <strong>Did you know?</strong> HealthBridge's telemedicine system can function on as little as 2G connectivity,
                      making it accessible even in the most remote areas.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Signal className="mr-2 h-5 w-5 text-health-primary" />
                      Works on Minimal Bandwidth
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Our platform automatically adapts to your connection quality, prioritizing essential communications.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Wifi className="mr-2 h-5 w-5 text-health-primary" />
                      Offline Message Queue
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Messages are stored locally and automatically sent when your connection is restored.
                    </p>
                  </CardContent>
                </Card>
                
                <Button 
                  variant="action" 
                  size="lg" 
                  className="w-full mt-4"
                  onClick={() => navigate('/telemedicine')}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Connect with a Provider
                </Button>
              </div>
            </div>
            
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold mb-6">How Our Telemedicine Works</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Request a Consultation",
                    description: "Choose between urgent care or scheduled appointments with specialists or general practitioners."
                  },
                  {
                    title: "Connect Based on Bandwidth",
                    description: "Our system automatically selects the best communication method based on your current connectivity."
                  },
                  {
                    title: "Receive Care & Follow-Up",
                    description: "Get diagnoses, prescriptions, and referrals directly through the app with ongoing follow-up care."
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

export default TelemedicineInfo;
