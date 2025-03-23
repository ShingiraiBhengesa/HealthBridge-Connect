import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedPage, SlideUp, staggerContainer, staggerItem } from '@/components/ui/AnimatedTransition';
import { NetworkStatus } from '@/components/ui/NetworkStatus';
import { 
  PlusCircle, Stethoscope, UserCircle, Users, Activity, 
  Globe, Zap, Rocket, TrendingUp, Target, 
  Lock, FileText, HeartPulse, Languages, LogIn,
  ArrowRightCircle, CheckCircle2, UserPlus, WifiOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      title: 'Offline-First Health Assessment',
      description: 'Check symptoms and get personalized recommendations even without internet access.',
      icon: Activity,
      color: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20',
      action: () => navigate('/symptom-checker'),
      infoLink: '/features/symptom-checker'
    },
    {
      title: 'Secure Health Records',
      description: 'Store your medical information locally with encryption, syncing when connectivity is available.',
      icon: Lock,
      color: 'bg-cyan-500/10 text-cyan-500 dark:bg-cyan-500/20',
      action: () => navigate('/patient-profile'),
      infoLink: '/features/health-records'
    },
    {
      title: 'Low-Bandwidth Telemedicine',
      description: 'Connect with healthcare professionals even with limited connectivity via text or voice.',
      icon: Stethoscope,
      color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20',
      action: () => navigate('/telemedicine'),
      infoLink: '/features/telemedicine'
    },
    {
      title: 'Community Health Worker Toolkit',
      description: 'Tools for health workers to monitor and care for patients in underserved communities.',
      icon: Users,
      color: 'bg-purple-500/10 text-purple-500 dark:bg-purple-500/20',
      action: () => navigate('/health-worker'),
      infoLink: '/features/health-worker'
    }
  ];

  const additionalFeatures = [
    {
      title: 'Multilingual Support',
      description: 'Language options and visual icons to overcome literacy barriers.',
      icon: Languages,
    },
    {
      title: 'Epidemiological Monitoring',
      description: 'Anonymous data aggregation for early detection of outbreaks.',
      icon: Globe,
    },
    {
      title: 'Offline Sync',
      description: 'Your data is stored locally and synced when connectivity returns.',
      icon: WifiOff,
    },
    {
      title: 'Health Education',
      description: 'Access educational content on preventive care and maternal health.',
      icon: FileText,
    },
    {
      title: 'Emergency Triage',
      description: 'Quick assessment for medical emergencies with clear guidance.',
      icon: HeartPulse,
    },
    {
      title: 'Patient Records',
      description: 'Comprehensive health profiles accessible via QR code sharing.',
      icon: UserCircle,
    }
  ];

  return (
    <Layout>
      <AnimatedPage>
        <section id="hero" className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_45%,rgba(30,136,229,0.1),transparent)]" />
          
          <div className="max-w-4xl mx-auto text-center px-6">
            <SlideUp>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance mb-6">
                <span className="text-health-primary">HealthBridge Connect:</span> Healthcare for Everyone, Everywhere
              </h1>
            </SlideUp>
            
            <SlideUp className="delay-100">
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
                Bridging the healthcare gap through offline-first technology, low-bandwidth telemedicine, 
                and community health worker support — ensuring quality care reaches every community.
              </p>
            </SlideUp>
            
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {isAuthenticated ? (
                <>
                  <Button 
                    variant="action" 
                    size="xl" 
                    className="px-8 py-7 rounded-full w-full sm:w-auto"
                    onClick={() => navigate('/symptom-checker')}
                  >
                    <Activity className="mr-2 h-5 w-5" />
                    Start Health Assessment
                    <ArrowRightCircle className="ml-1 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="px-8 py-7 rounded-full border-health-primary text-health-primary hover:bg-health-primary/10 w-full sm:w-auto"
                    onClick={() => navigate(user?.userType === 'patient' ? '/patient-profile' : '/health-worker')}
                  >
                    <UserCircle className="mr-2 h-5 w-5" />
                    {user?.userType === 'patient' ? 'View Health Profile' : 'Health Worker Dashboard'}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="action" 
                    size="xl" 
                    className="px-8 py-7 rounded-full w-full sm:w-auto sm:max-w-[210px]"
                    onClick={() => navigate('/register')}
                  >
                    <UserPlus className="mr-2 h-5 w-5" />
                    Join HealthBridge
                    <ArrowRightCircle className="ml-1 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="px-8 py-7 rounded-full border-health-primary text-health-primary hover:bg-health-primary/10 w-full sm:w-auto"
                    onClick={() => navigate('/symptom-checker')}
                  >
                    <Activity className="mr-2 h-5 w-5" />
                    Symptom Checker
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-20">
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
                <Card className="h-full hover:shadow-md transition-all duration-300 overflow-hidden group">
                  <div className="absolute h-1 w-full bg-gradient-to-r from-health-primary to-health-accent top-0 left-0" />
                  <CardContent className="pt-6">
                    <div className={`p-3 rounded-lg w-12 h-12 flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-health-primary hover:text-health-primary hover:bg-health-primary/10 group-hover:translate-x-1 transition-transform"
                      onClick={() => navigate(feature.infoLink)}
                    >
                      Learn more
                      <ArrowRightCircle className="ml-1 h-4 w-4 opacity-70 group-hover:opacity-100" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="py-12 md:py-16 bg-muted/30 rounded-3xl my-6">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Additional Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                HealthBridge Connect offers a comprehensive suite of tools designed for healthcare access in resource-limited environments.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4 group hover:bg-white/50 dark:hover:bg-white/5 rounded-xl transition-colors">
                  <div className="bg-health-primary/10 group-hover:bg-health-primary/20 p-3 rounded-full mb-4 group-hover:scale-110 transition-all">
                    <feature.icon className="h-6 w-6 text-health-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-12 md:py-20">
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
                  description: "Use our offline symptom checker to evaluate your health concerns and receive guidance based on medically-validated algorithms.",
                  icon: Target
                },
                {
                  title: "Connect with Healthcare Providers",
                  description: "Through low-bandwidth telemedicine, message healthcare professionals and receive timely advice even with limited connectivity.",
                  icon: Zap
                },
                {
                  title: "Store Your Health Information Securely",
                  description: "Your health data is encrypted and stored locally, syncing to the cloud when connectivity is available, ensuring your privacy.",
                  icon: Lock
                },
                {
                  title: "Receive Community Support",
                  description: "Community health workers equipped with our tools can provide localized care and connect you with specialists when needed.",
                  icon: Users
                },
                {
                  title: "Contribute to Public Health",
                  description: "Anonymous data helps health authorities identify disease outbreaks early, protecting your community while respecting your privacy.",
                  icon: Rocket
                }
              ].map((step, index) => (
                <div key={index} className="relative flex mb-12 last:mb-0 group">
                  <div className="flex-none mr-8 md:mr-12">
                    <div className="bg-health-primary text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg font-semibold z-10 relative shadow-md group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <step.icon className="mr-2 h-5 w-5 text-health-primary" />
                      {step.title}
                      <CheckCircle2 className="ml-2 h-4 w-4 text-health-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="impact" className="py-12 md:py-16 my-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Impact</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                HealthBridge Connect is designed to make a difference in healthcare access and outcomes worldwide.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-md transition-all duration-300 group">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center group-hover:text-health-primary transition-colors">
                    <Globe className="mr-2 h-5 w-5 text-health-primary" />
                    Increased Access
                  </h3>
                  <p className="text-muted-foreground">
                    Our offline-first technology reaches remote populations with limited infrastructure, bringing healthcare to the most underserved communities.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all duration-300 group">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center group-hover:text-health-primary transition-colors">
                    <Activity className="mr-2 h-5 w-5 text-health-primary" />
                    Improved Quality
                  </h3>
                  <p className="text-muted-foreground">
                    By connecting local providers with specialists, we reduce misdiagnosis rates and improve treatment outcomes even in resource-limited settings.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all duration-300 group">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center group-hover:text-health-primary transition-colors">
                    <TrendingUp className="mr-2 h-5 w-5 text-health-primary" />
                    Reduced Costs
                  </h3>
                  <p className="text-muted-foreground">
                    Our platform minimizes unnecessary travel and optimizes resource allocation, making healthcare more affordable for patients and providers alike.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 text-center">
          <div className="glass rounded-3xl px-6 py-12 md:p-16 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Join the HealthBridge Movement</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Take control of your health with innovative tools designed for everyone, everywhere. Together, we can bridge the healthcare gap.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {isAuthenticated ? (
                <Button 
                  variant="action" 
                  size="xl" 
                  className="text-base px-8 py-6 rounded-full"
                  onClick={() => navigate('/symptom-checker')}
                >
                  Start Your Health Assessment
                  <ArrowRightCircle className="ml-1 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="action" 
                    size="xl" 
                    className="text-base px-8 py-6 rounded-full"
                    onClick={() => navigate('/register')}
                  >
                    Create Free Account
                    <ArrowRightCircle className="ml-1 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="xl" 
                    className="text-base px-8 py-6 rounded-full border-health-primary text-health-primary hover:bg-health-primary/10"
                    onClick={() => navigate('/symptom-checker')}
                  >
                    Try Symptom Checker
                    <Activity className="ml-1 h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
        
        <NetworkStatus />
      </AnimatedPage>
    </Layout>
  );
};

export default Index;
