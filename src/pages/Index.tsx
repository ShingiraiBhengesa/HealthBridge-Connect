
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedPage, SlideUp, staggerContainer, staggerItem } from '@/components/ui/AnimatedTransition';
import { PlusCircle, Stethoscope, UserCircle, Users, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Offline-First Symptom Checker',
      description: 'Assess symptoms and receive actionable recommendations without requiring internet connectivity.',
      icon: Activity,
      color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
      action: () => navigate('/symptom-checker')
    },
    {
      title: 'Secure Health Records',
      description: 'Keep your health information encrypted and only accessible to those you authorize.',
      icon: UserCircle,
      color: 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20',
      action: () => navigate('/patient-profile')
    },
    {
      title: 'Low-Bandwidth Telemedicine',
      description: 'Connect with healthcare professionals even with limited connectivity.',
      icon: Stethoscope,
      color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20',
      action: () => navigate('/telemedicine')
    },
    {
      title: 'Community Health Worker Toolkit',
      description: 'Tools for health workers to monitor and care for patients in underserved communities.',
      icon: Users,
      color: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20',
      action: () => navigate('/health-worker')
    }
  ];

  return (
    <Layout>
      <AnimatedPage>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_45%,rgba(30,136,229,0.1),transparent)]" />
          
          <div className="max-w-4xl mx-auto text-center px-6">
            <SlideUp>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance mb-6">
                Healthcare Access for <span className="text-health-primary">Everyone</span>, Everywhere
              </h1>
            </SlideUp>
            
            <SlideUp className="delay-100">
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
                HealthBridge Connect empowers communities with limited resources through offline-first functionality, bridging the gap to quality healthcare access.
              </p>
            </SlideUp>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Button 
                size="lg" 
                className="text-base px-6 py-6 rounded-full shadow-lg shadow-health-primary/20 bg-health-primary hover:bg-health-primary/90"
                onClick={() => navigate('/symptom-checker')}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Start Symptom Check
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-6 py-6 rounded-full border-health-primary text-health-primary hover:bg-health-primary/10"
                onClick={() => navigate('/patient-profile')}
              >
                Create Health Profile
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How HealthBridge Helps</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines innovative technology with community-driven healthcare to overcome limitations in internet access and resources.
            </p>
          </div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="h-full hover:shadow-md transition-all duration-300 overflow-hidden">
                  <div className="absolute h-1 w-full bg-gradient-to-r from-health-primary to-health-accent top-0 left-0" />
                  <CardContent className="pt-6">
                    <div className={`p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-health-primary hover:text-health-primary hover:bg-health-primary/10"
                      onClick={feature.action}
                    >
                      Learn more
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-20 bg-muted/30 rounded-3xl my-12">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              HealthBridge Connect is designed to function even in areas with limited connectivity, ensuring healthcare is always accessible.
            </p>
          </div>

          <div className="max-w-4xl mx-auto px-6">
            <div className="relative">
              <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-health-primary/20" />
              
              {[
                {
                  title: "Check Your Symptoms",
                  description: "Use our offline symptom checker to evaluate your health concerns and receive guidance."
                },
                {
                  title: "Connect with Healthcare Providers",
                  description: "Through low-bandwidth telemedicine, message healthcare professionals and receive timely advice."
                },
                {
                  title: "Store Your Health Information Securely",
                  description: "Your health data is encrypted and stored locally, syncing to the cloud when connectivity is available."
                },
                {
                  title: "Receive Community Support",
                  description: "Community health workers equipped with our tools can provide localized care and monitoring."
                }
              ].map((step, index) => (
                <div key={index} className="relative flex mb-12 last:mb-0">
                  <div className="flex-none mr-8 md:mr-12">
                    <div className="bg-health-primary text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg font-semibold z-10 relative shadow-md">
                      {index + 1}
                    </div>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="glass rounded-3xl px-6 py-12 md:p-16 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Begin Your Health Journey Today</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Take control of your health with HealthBridge Connect's innovative tools designed for everyone, everywhere.
            </p>
            <Button 
              size="lg" 
              className="text-base px-8 py-6 rounded-full shadow-lg shadow-health-primary/20 bg-health-primary hover:bg-health-primary/90"
              onClick={() => navigate('/symptom-checker')}
            >
              Start Your Health Assessment
            </Button>
          </div>
        </section>
      </AnimatedPage>
    </Layout>
  );
};

export default Index;
