import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedPage, SlideUp } from '@/components/ui/AnimatedTransition';
import { cn } from '@/lib/utils';
import { 
  ChevronRight, 
  AlertTriangle, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle, 
  Brain,
  Stethoscope,
  MessageSquare,
  Heart,
  Ear,
  Thermometer,
  Droplet,
  CircleDot,
  FlaskConical,
  BrainCircuit,
  HelpCircle,
  Search
} from 'lucide-react';
import { 
  navigateSymptomTree, 
  SymptomNode, 
  getSeverityColor,
  getSeverityBgColor
} from '@/utils/symptomCheckerData';
import { 
  saveSymptomCheckResult, 
  SymptomCheckResult,
  StorageKeys, 
  getData
} from '@/utils/storageUtils';
import { toast } from '@/components/ui/use-toast';
import { Form, FormField, FormItem, FormControl, FormDescription } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Simple schema for notes to validate form
const notesSchema = z.object({
  notes: z.string().optional(),
});

type NotesFormValues = z.infer<typeof notesSchema>;

// Custom Lungs component since it's not available in lucide-react
const Lungs = () => (
  <div className="h-5 w-5 flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12a4 4 0 0 1 4-4c2 0 3 1 4 2 1 1 2 2 4 2a4 4 0 0 0 4-4V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"></path>
      <path d="M6 12a4 4 0 0 0 4 4c2 0 3-1 4-2 1-1 2-2 4-2a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2"></path>
      <path d="M7 9c0-1 .5-2 1.5-3"></path>
      <path d="M16.5 15c1-.667 1.5-1.667 1.5-3"></path>
    </svg>
  </div>
);

const SmartDoctorAvatar = ({ severity }: { severity?: string }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center",
        severity === 'severe' ? "bg-red-100" : 
        severity === 'moderate' ? "bg-amber-100" : "bg-blue-100"
      )}>
        {severity ? (
          <Stethoscope className={cn(
            "h-6 w-6",
            severity === 'severe' ? "text-red-600" : 
            severity === 'moderate' ? "text-amber-600" : "text-blue-600"
          )} />
        ) : (
          <Brain className="h-6 w-6 text-health-primary" />
        )}
      </div>
      <div>
        <h3 className="font-medium">Dr. HealthBridge</h3>
        <p className="text-sm text-muted-foreground">AI Health Assistant</p>
      </div>
    </div>
  );
};

const DoctorMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start gap-3 mb-4 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-1">
        <MessageSquare className="h-4 w-4 text-blue-600" />
      </div>
      <div className="flex-1 bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg rounded-tl-none">
        {children}
      </div>
    </div>
  );
};

// Helper function to render the appropriate icon based on symptom node
const getSymptomIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Heart':
      return <Heart className="h-5 w-5" />;
    case 'Brain':
      return <Brain className="h-5 w-5" />;
    case 'Lungs':
      return <Lungs />;
    case 'Eye':
      return <AlertTriangle className="h-5 w-5" />;
    case 'EarHearing':
      return <Ear className="h-5 w-5" />;
    case 'Thermometer':
      return <Thermometer className="h-5 w-5" />;
    case 'Droplet':
      return <Droplet className="h-5 w-5" />;
    case 'Droplets':
      return <CircleDot className="h-5 w-5" />;
    case 'Rash':
      return <FlaskConical className="h-5 w-5" />;
    case 'BrainCircuit':
      return <BrainCircuit className="h-5 w-5" />;
    case 'HelpCircle':
      return <HelpCircle className="h-5 w-5" />;
    case 'HeartPulse':
      return <Heart className="h-5 w-5" />;
    default:
      return <Stethoscope className="h-5 w-5" />;
  }
};

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [currentNode, setCurrentNode] = useState<SymptomNode>(navigateSymptomTree('root'));
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [symptomHistory, setSymptomHistory] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<SymptomNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  
  // Add form handling for notes
  const form = useForm<NotesFormValues>({
    resolver: zodResolver(notesSchema),
    defaultValues: {
      notes: '',
    },
  });

  useEffect(() => {
    // Load any existing symptom history
    const history = getData<SymptomCheckResult[]>(StorageKeys.SYMPTOM_HISTORY) || [];
    setSymptomHistory(history.map(item => item.id));
  }, []);

  const handleSelect = (childId: string) => {
    // Update the path
    const newPath = [...selectedPath, childId];
    setSelectedPath(newPath);
    
    // Navigate to the next node
    const nextNode = navigateSymptomTree(childId);
    setCurrentNode(nextNode);
    
    // Check if we've reached a leaf node
    if (nextNode.isLeaf) {
      setIsComplete(true);
      setResult(nextNode);
      
      // Scroll to result after a short delay to allow rendering
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleBack = () => {
    if (selectedPath.length === 0) {
      return; // Already at root
    }
    
    // Remove the last selection from the path
    const newPath = selectedPath.slice(0, -1);
    setSelectedPath(newPath);
    
    // Navigate to the previous node or root if path is empty
    const prevNodeId = newPath.length > 0 ? newPath[newPath.length - 1] : 'root';
    setCurrentNode(navigateSymptomTree(prevNodeId));
    
    // If we were at a result, go back to questions
    if (isComplete) {
      setIsComplete(false);
      setResult(null);
    }
  };

  const handleReset = () => {
    setSelectedPath([]);
    setCurrentNode(navigateSymptomTree('root'));
    setIsComplete(false);
    setResult(null);
    setSearchTerm('');
    form.reset({ notes: '' });
  };

  const handleSave = () => {
    if (!result) return;
    
    // Create the result object
    const checkResult: SymptomCheckResult = {
      id: `symp-${Date.now()}`,
      timestamp: Date.now(),
      symptoms: selectedPath,
      severity: result.severity || 'mild',
      recommendation: result.recommendation || '',
      followUpRequired: result.followUpRequired || false,
      notes: form.getValues().notes || ''
    };
    
    // Save to local storage
    saveSymptomCheckResult(checkResult);
    
    // Update the UI
    setSymptomHistory([...symptomHistory, checkResult.id]);
    
    // Show success toast
    toast({
      title: "Assessment saved",
      description: "Your symptom check has been saved to your health record",
      duration: 3000,
    });

    // Offer to navigate to profile or another page
    setTimeout(() => {
      navigate('/patient-profile');
    }, 1500);
  };

  // Filter symptom options based on search term if at root level
  const filteredChildren = () => {
    if (currentNode.id !== 'root' || !searchTerm.trim()) {
      return currentNode.children || [];
    }
    
    return currentNode.children?.filter(childId => {
      const node = navigateSymptomTree(childId);
      return node.text.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];
  };

  return (
    <Layout>
      <AnimatedPage>
        <div className="py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">AI Health Assessment</h1>
            
            <div className="flex gap-2">
              {selectedPath.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleBack}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
              )}
              
              {(selectedPath.length > 0 || isComplete) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="flex items-center"
                >
                  <RotateCcw className="mr-1 h-4 w-4" />
                  Start Over
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <Card className="w-full lg:w-2/3 h-full border">
              <CardContent className="pt-6">
                {/* Smart Doctor Avatar */}
                <SmartDoctorAvatar severity={result?.severity} />

                {/* Assessment Section */}
                <SlideUp className={cn("transition-all duration-500", isComplete ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
                  <DoctorMessage>
                    <p className="text-base">{currentNode.text}</p>
                  </DoctorMessage>
                  
                  {/* Search bar for root level */}
                  {currentNode.id === 'root' && (
                    <div className="flex items-center mb-4 ml-11 relative">
                      <input
                        type="text"
                        placeholder="Search symptoms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-9 border rounded-md focus:outline-none focus:ring-2 focus:ring-health-primary/50"
                      />
                      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  
                  {currentNode.children && (
                    <div className="space-y-3 ml-11">
                      {filteredChildren().map((childId) => {
                        const childNode = navigateSymptomTree(childId);
                        return (
                          <Button
                            key={childId}
                            variant="outline"
                            className="w-full justify-between font-normal text-left h-auto py-3 px-4 border-health-primary/20 hover:border-health-primary/50 hover:bg-health-primary/5"
                            onClick={() => handleSelect(childId)}
                          >
                            <div className="flex items-center gap-2">
                              {childNode.icon && getSymptomIcon(childNode.icon)}
                              <span>{childNode.text}</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-health-primary" />
                          </Button>
                        );
                      })}
                      
                      {/* Show message when no search results */}
                      {currentNode.id === 'root' && searchTerm && filteredChildren().length === 0 && (
                        <div className="text-center py-3 text-muted-foreground">
                          No symptoms match your search. Try different keywords.
                        </div>
                      )}
                    </div>
                  )}
                </SlideUp>

                {/* Result Section */}
                {isComplete && result && (
                  <div ref={resultRef} className="animate-fade-in">
                    <DoctorMessage>
                      <h2 className="text-lg font-semibold mb-2">{result.text}</h2>
                      <div className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mb-2",
                        result.severity === 'severe' ? "bg-red-100 text-red-700" : 
                        result.severity === 'moderate' ? "bg-amber-100 text-amber-700" : 
                        "bg-green-100 text-green-700"
                      )}>
                        {result.severity === 'severe' ? 'Urgent attention needed' : 
                         result.severity === 'moderate' ? 'Medical attention recommended' : 
                         'Can be managed at home'}
                      </div>
                      <p className="text-foreground/80 mt-2">{result.recommendation}</p>
                      
                      {result.followUpRequired && (
                        <div className="bg-blue-100 text-blue-800 p-3 rounded-lg mt-3 text-sm">
                          <span className="font-semibold">Medical follow-up recommended:</span> Please consult with a healthcare provider about these symptoms.
                        </div>
                      )}
                    </DoctorMessage>

                    <div className="bg-muted/30 p-5 rounded-xl mb-6 mt-6">
                      <h3 className="text-lg font-semibold mb-3">Add Notes to Your Record</h3>
                      <Form {...form}>
                        <form className="space-y-4">
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <textarea
                                    className="w-full p-3 border rounded-lg min-h-[120px] bg-background"
                                    placeholder="Add details about your symptoms, when they started, or any other relevant information..."
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  These notes will be saved with your assessment.
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full py-6 bg-health-primary hover:bg-health-primary/90 shadow-sm"
                      onClick={handleSave}
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Save Assessment to Health Record
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Information Panel */}
            <div className="w-full lg:w-1/3">
              <Card className="border h-full">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">About AI Health Assessment</h3>
                  
                  <div className="space-y-4 text-muted-foreground text-sm">
                    <p>
                      This AI-powered tool helps you assess symptoms and provides personalized guidance on what to do next. 
                      It uses advanced algorithms to understand your symptoms and provide relevant recommendations.
                    </p>
                    
                    <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
                      <span className="font-semibold block mb-1">Important:</span>
                      This tool is not a substitute for professional medical advice. If you're experiencing severe symptoms, seek immediate medical attention.
                    </div>
                    
                    <p>
                      The symptom checker works entirely offline for privacy. Your symptom data is saved locally on your device and can be accessed in your health profile.
                    </p>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Symptom Categories</h4>
                      <ul className="grid grid-cols-2 gap-2">
                        <li className="flex items-center gap-1"><Thermometer className="h-3 w-3" /> Fever</li>
                        <li className="flex items-center gap-1"><Heart className="h-3 w-3" /> Pain</li>
                        <li className="flex items-center gap-1"><div className="h-3 w-3 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12a4 4 0 0 1 4-4c2 0 3 1 4 2 1 1 2 2 4 2a4 4 0 0 0 4-4V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"></path><path d="M6 12a4 4 0 0 0 4 4c2 0 3-1 4-2 1-1 2-2 4-2a4 4 0 0 1 4 4v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2"></path><path d="M7 9c0-1 .5-2 1.5-3"></path><path d="M16.5 15c1-.667 1.5-1.667 1.5-3"></path></svg></div> Respiratory</li>
                        <li className="flex items-center gap-1"><Droplet className="h-3 w-3" /> Digestive</li>
                        <li className="flex items-center gap-1"><FlaskConical className="h-3 w-3" /> Skin</li>
                        <li className="flex items-center gap-1"><Brain className="h-3 w-3" /> Neurological</li>
                        <li className="flex items-center gap-1"><BrainCircuit className="h-3 w-3" /> Mental Health</li>
                        <li className="flex items-center gap-1"><Heart className="h-3 w-3" /> Cardiovascular</li>
                        <li className="flex items-center gap-1"><CircleDot className="h-3 w-3" /> Urinary</li>
                        <li className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Eye</li>
                        <li className="flex items-center gap-1"><Ear className="h-3 w-3" /> Ear</li>
                        <li className="flex items-center gap-1"><HelpCircle className="h-3 w-3" /> Other</li>
                      </ul>
                    </div>
                    
                    {symptomHistory.length > 0 && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Previous Assessments</h4>
                        <p className="mb-2">You have {symptomHistory.length} saved assessment(s).</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => navigate('/patient-profile')}
                        >
                          View Health History
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default SymptomChecker;
