
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedPage, SlideUp } from '@/components/ui/AnimatedTransition';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Database, Lock, Shield, Smartphone } from 'lucide-react';

const HealthRecordsInfo = () => {
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
                <Lock className="mr-3 h-8 w-8 text-health-primary" />
                Secure Health Records
              </h1>
            </SlideUp>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Your Health Data, Always Available, Always Secure</h2>
                  <p className="mb-4">
                    HealthBridge securely stores your health records locally on your device with strong encryption. 
                    Your data syncs with our secure cloud servers only when connectivity is available and you've given permission.
                  </p>
                  
                  <h3 className="font-semibold text-lg mt-6 mb-2">Key Features:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>End-to-end encryption for all health data</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Offline access to your complete medical history</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Selective sharing with healthcare providers via QR codes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Chronological health timeline with all events and records</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-health-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>Store lab results, prescriptions, and vaccination records</span>
                    </li>
                  </ul>
                  
                  <div className="mt-8 bg-muted/30 p-4 rounded-lg">
                    <p className="text-sm italic">
                      <strong>Privacy Commitment:</strong> Your health data belongs to you alone. We never sell your data 
                      or share it with third parties without your explicit consent.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Smartphone className="mr-2 h-5 w-5 text-health-primary" />
                      Offline-First Design
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      All your health records are available on your device, even without internet access. Changes sync when connectivity returns.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Shield className="mr-2 h-5 w-5 text-health-primary" />
                      Military-Grade Security
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      AES-256 encryption protects your data on-device and in transit. Only you control who can access your information.
                    </p>
                  </CardContent>
                </Card>
                
                <Button 
                  variant="action" 
                  size="lg" 
                  className="w-full mt-4"
                  onClick={() => navigate('/patient-profile')}
                >
                  <Database className="mr-2 h-5 w-5" />
                  Manage Health Records
                </Button>
              </div>
            </div>
            
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold mb-6">How Your Health Records System Works</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Local Storage First",
                    description: "Your health data is stored securely on your device, ensuring you always have access to it even offline."
                  },
                  {
                    title: "Encrypted Backup",
                    description: "When you have internet access, your data is encrypted and backed up to our secure servers."
                  },
                  {
                    title: "Controlled Sharing",
                    description: "Share specific portions of your health record with providers using time-limited access codes."
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

export default HealthRecordsInfo;
