
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedPage, SlideUp } from '@/components/ui/AnimatedTransition';
import { cn } from '@/lib/utils';
import { ChevronRight, AlertTriangle, ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
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

const SymptomChecker = () => {
  const navigate = useNavigate();
  const [currentNode, setCurrentNode] = useState<SymptomNode>(navigateSymptomTree('root'));
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [symptomHistory, setSymptomHistory] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState<SymptomNode | null>(null);
  const [notes, setNotes] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

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
    setNotes('');
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
      notes: notes
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

  return (
    <Layout>
      <AnimatedPage>
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Symptom Checker</h1>
            
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
                {/* Assessment Section */}
                <SlideUp className={cn("transition-all duration-500", isComplete ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
                  <div className="bg-muted/30 p-6 rounded-xl mb-6">
                    <h2 className="text-xl font-semibold mb-4">{currentNode.text}</h2>
                    
                    {currentNode.children && (
                      <div className="space-y-3">
                        {currentNode.children.map((childId) => {
                          const childNode = navigateSymptomTree(childId);
                          return (
                            <Button
                              key={childId}
                              variant="outline"
                              className="w-full justify-between font-normal text-left h-auto py-3 px-4"
                              onClick={() => handleSelect(childId)}
                            >
                              <span>{childNode.text}</span>
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </SlideUp>

                {/* Result Section */}
                {isComplete && result && (
                  <div ref={resultRef} className="animate-fade-in">
                    <div className={cn(
                      "p-6 rounded-xl mb-6 border",
                      getSeverityBgColor(result.severity)
                    )}>
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "p-2 rounded-full",
                          result.severity === 'severe' ? "bg-red-200" : 
                          result.severity === 'moderate' ? "bg-amber-200" : "bg-green-200"
                        )}>
                          <AlertTriangle className={cn(
                            "h-6 w-6",
                            result.severity === 'severe' ? "text-red-600" : 
                            result.severity === 'moderate' ? "text-amber-600" : "text-green-600"
                          )} />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold mb-2">{result.text}</h2>
                          <p className={cn(
                            "font-medium",
                            getSeverityColor(result.severity)
                          )}>
                            {result.severity === 'severe' ? 'Severe - Urgent attention needed' : 
                             result.severity === 'moderate' ? 'Moderate - Medical attention recommended' : 
                             'Mild - Can be managed at home'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-xl mb-6">
                      <h3 className="text-lg font-semibold mb-3">Recommendation</h3>
                      <p className="text-foreground/80 mb-4">{result.recommendation}</p>
                      
                      {result.followUpRequired && (
                        <div className="bg-blue-100 text-blue-800 p-4 rounded-lg">
                          <span className="font-semibold">Follow up recommended:</span> Please consult with a healthcare provider about these symptoms.
                        </div>
                      )}
                    </div>

                    <div className="bg-muted/30 p-6 rounded-xl mb-6">
                      <h3 className="text-lg font-semibold mb-3">Add Notes (Optional)</h3>
                      <textarea
                        className="w-full p-3 border rounded-lg min-h-[100px] bg-background"
                        placeholder="Add any additional details about your symptoms..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
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
                  <h3 className="text-lg font-semibold mb-4">About the Symptom Checker</h3>
                  
                  <div className="space-y-4 text-muted-foreground text-sm">
                    <p>
                      This tool helps you assess symptoms and provides guidance on what to do next. 
                      It is not a substitute for professional medical advice.
                    </p>
                    
                    <div className="p-4 bg-blue-100 text-blue-800 rounded-lg">
                      <span className="font-semibold block mb-1">Important:</span>
                      If you're experiencing severe symptoms like chest pain, difficulty breathing, 
                      or signs of stroke, seek immediate medical attention.
                    </div>
                    
                    <p>
                      The symptom checker works entirely offline, so you can use it even without 
                      internet access. Your symptom data is saved locally on your device.
                    </p>
                    
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
