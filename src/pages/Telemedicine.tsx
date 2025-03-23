import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatedPage, SlideUp } from '@/components/ui/AnimatedTransition';
import { toast } from '@/components/ui/use-toast';
import { 
  Video, 
  MessageSquare, 
  Phone, 
  Send, 
  Clock, 
  Calendar, 
  User, 
  Camera, 
  Paperclip, 
  WifiOff, 
  CheckCircle2,
  AlertCircle,
  LucideIcon,
  ChevronRight,
  Stethoscope
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  addToOfflineQueue, 
  getPatientProfile, 
  PatientProfile
} from '@/utils/storageUtils';

interface Consultation {
  id: string;
  type: 'message' | 'video' | 'voice';
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  timestamp: number;
  doctorName: string;
  specialty: string;
  notes?: string;
  messages?: Message[];
}

interface Message {
  id: string;
  content: string;
  sender: 'patient' | 'doctor';
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: string[];
}

const mockConsultations: Consultation[] = [
  {
    id: 'cons-001',
    type: 'message',
    status: 'completed',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    doctorName: 'Dr. Elena Rodriguez',
    specialty: 'General Medicine',
    notes: 'Follow up on medication side effects',
    messages: [
      {
        id: 'msg-001',
        content: 'Hello Dr. Rodriguez, I\'ve been experiencing some dizziness with the new medication. Is this normal?',
        sender: 'patient',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000, // 2 days and 30 mins ago
        status: 'read',
      },
      {
        id: 'msg-002',
        content: 'Hello. Yes, dizziness can be a side effect for the first few days. If it persists for more than a week or gets worse, please let me know. Make sure to take the medication with food.',
        sender: 'doctor',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 - 25 * 60 * 1000, // 2 days and 25 mins ago
        status: 'read',
      },
      {
        id: 'msg-003',
        content: 'Thank you, I\'ll try taking it with meals and see if that helps.',
        sender: 'patient',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 - 20 * 60 * 1000, // 2 days and 20 mins ago
        status: 'read',
      }
    ]
  },
  {
    id: 'cons-002',
    type: 'video',
    status: 'scheduled',
    timestamp: Date.now() + 2 * 24 * 60 * 60 * 1000, // 2 days in future
    doctorName: 'Dr. Miguel Sanchez',
    specialty: 'Cardiology',
    notes: 'Initial consultation for heart palpitations',
  },
  {
    id: 'cons-003',
    type: 'message',
    status: 'pending',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    doctorName: 'Dr. Sofia Garcia',
    specialty: 'Dermatology',
    notes: 'Rash evaluation',
    messages: [
      {
        id: 'msg-004',
        content: 'I\'ve developed a rash on my arms after starting the new medication. I\'ve attached some photos.',
        sender: 'patient',
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
        status: 'delivered',
        attachments: ['rash-photo-1.jpg', 'rash-photo-2.jpg']
      }
    ]
  }
];

const consultationTypes = [
  { id: 'message', name: 'Messaging', icon: MessageSquare, description: 'Send messages and images to a healthcare provider' },
  { id: 'video', name: 'Video Call', icon: Video, description: 'Schedule a video consultation with a specialist' },
  { id: 'voice', name: 'Voice Call', icon: Phone, description: 'Schedule a phone call with a healthcare provider' }
];

const specialties = [
  { id: 'general', name: 'General Medicine' },
  { id: 'pediatrics', name: 'Pediatrics' },
  { id: 'cardiology', name: 'Cardiology' },
  { id: 'dermatology', name: 'Dermatology' },
  { id: 'obgyn', name: 'Obstetrics & Gynecology' },
  { id: 'mental-health', name: 'Mental Health' }
];

const ConsultationTypeCard = ({ 
  type, 
  name, 
  icon: Icon, 
  description, 
  selected, 
  onSelect 
}: { 
  type: string; 
  name: string; 
  icon: LucideIcon; 
  description: string; 
  selected: boolean; 
  onSelect: (type: string) => void;
}) => (
  <Card 
    className={cn(
      "cursor-pointer transition-all hover:shadow-md",
      selected ? "border-health-primary bg-health-primary/5" : "border"
    )}
    onClick={() => onSelect(type)}
  >
    <CardContent className="p-4 flex items-start gap-3">
      <div className={cn(
        "p-3 rounded-full",
        selected ? "bg-health-primary/20 text-health-primary" : "bg-muted text-muted-foreground"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const MessageDetail = ({ consultation }: { consultation: Consultation }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [messages, setMessages] = useState<Message[]>(consultation.messages || []);
  
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage.trim(),
      sender: 'patient',
      timestamp: Date.now(),
      status: isOnline ? 'sent' : 'sending',
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    if (!isOnline) {
      addToOfflineQueue({
        operation: 'sync_patient_data',
        data: { type: 'consultation_message', consultationId: consultation.id, message: newMsg }
      });
      
      toast({
        title: "Message saved offline",
        description: "Your message will be sent when connectivity is restored.",
      });
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: number) => {
    const today = new Date();
    const messageDate = new Date(timestamp);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-[65vh]">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-medium">{consultation.doctorName}</h3>
          <p className="text-sm text-muted-foreground">{consultation.specialty}</p>
        </div>
        
        <div className={cn(
          "px-2 py-1 text-xs rounded-full",
          consultation.status === 'completed' ? "bg-green-100 text-green-800" :
          consultation.status === 'scheduled' ? "bg-blue-100 text-blue-800" :
          consultation.status === 'pending' ? "bg-amber-100 text-amber-800" :
          "bg-red-100 text-red-800"
        )}>
          {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          <>
            {messages.map((message, index) => (
              <div key={message.id} className="space-y-1">
                {index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp) ? (
                  <div className="text-xs text-center text-muted-foreground my-2">
                    {formatDate(message.timestamp)}
                  </div>
                ) : null}
                
                <div className={cn(
                  "flex",
                  message.sender === 'patient' ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.sender === 'patient' 
                      ? "bg-health-primary text-white rounded-tr-none" 
                      : "bg-muted rounded-tl-none"
                  )}>
                    <p className="text-sm">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.attachments.map((attachment) => (
                          <div 
                            key={attachment} 
                            className="bg-black/10 text-xs py-1 px-2 rounded flex items-center"
                          >
                            <Paperclip className="h-3 w-3 mr-1" />
                            {attachment}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs opacity-70 text-right mt-1 flex justify-end items-center gap-1">
                      {formatTime(message.timestamp)}
                      {message.sender === 'patient' && (
                        message.status === 'read' ? 
                          <CheckCircle2 className="h-3 w-3" /> : 
                        message.status === 'failed' ? 
                          <AlertCircle className="h-3 w-3" /> : 
                          null
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              <p>No messages yet</p>
              <p className="text-sm">Start your conversation with {consultation.doctorName}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t">
        {!isOnline && (
          <div className="bg-amber-100 text-amber-800 text-xs p-2 rounded-md mb-2 flex items-center">
            <WifiOff className="h-3 w-3 mr-1" /> 
            You're offline. Messages will be sent when connectivity is restored.
          </div>
        )}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
          >
            <Camera className="h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input 
            placeholder="Type your message..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="rounded-full"
          />
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full"
            onClick={handleSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ScheduleDetail = ({ consultation }: { consultation: Consultation }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="space-y-4 p-4">
      <Card className="border">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-muted p-3 rounded-full mr-4">
              {consultation.type === 'video' ? 
                <Video className="h-6 w-6 text-health-primary" /> : 
                <Phone className="h-6 w-6 text-health-primary" />
              }
            </div>
            <div>
              <h3 className="font-medium text-lg">
                {consultation.type === 'video' ? 'Video Consultation' : 'Voice Consultation'}
              </h3>
              <p className="text-muted-foreground">with {consultation.doctorName}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-muted-foreground">{formatDate(consultation.timestamp)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="font-medium">Time</p>
                <p className="text-muted-foreground">{formatTime(consultation.timestamp)}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <User className="h-5 w-5 text-muted-foreground mr-3" />
              <div>
                <p className="font-medium">Specialist</p>
                <p className="text-muted-foreground">{consultation.specialty}</p>
              </div>
            </div>
          </div>
          
          {consultation.notes && (
            <div className="mt-6 pt-6 border-t">
              <p className="font-medium mb-2">Reason for Consultation</p>
              <p className="text-muted-foreground">{consultation.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0 px-6 pb-6">
          <div className="flex gap-3 justify-end w-full">
            <Button variant="outline">Reschedule</Button>
            {Date.now() >= consultation.timestamp - 5 * 60 * 1000 && Date.now() <= consultation.timestamp + 30 * 60 * 1000 && (
              <Button>
                {consultation.type === 'video' ? (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Join Video Call
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Start Call
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <AlertCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">How to prepare for your consultation</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Find a quiet space with good lighting</li>
              <li>• Test your device's camera and microphone beforehand</li>
              <li>• Have a list of your symptoms or questions ready</li>
              <li>• Keep any relevant medical records or medication information on hand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Telemedicine = () => {
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list');
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  
  const [consultationType, setConsultationType] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');

  useEffect(() => {
    const savedProfile = getPatientProfile();
    setProfile(savedProfile);

    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setView('detail');
  };

  const handleCreateConsultation = () => {
    if (!consultationType || !specialty || !consultationNotes) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    let timestamp = Date.now() + 3 * 24 * 60 * 60 * 1000;
    
    if (preferredDate && preferredTime) {
      const [year, month, day] = preferredDate.split('-').map(Number);
      const [hours, minutes] = preferredTime.split(':').map(Number);
      timestamp = new Date(year, month - 1, day, hours, minutes).getTime();
    }

    const newConsultation: Consultation = {
      id: `cons-${Date.now()}`,
      type: consultationType as 'message' | 'video' | 'voice',
      status: consultationType === 'message' ? 'pending' : 'scheduled',
      timestamp,
      doctorName: specialty === 'general' ? 'Dr. Elena Rodriguez' : 
                  specialty === 'pediatrics' ? 'Dr. Carlos Mendez' :
                  specialty === 'cardiology' ? 'Dr. Miguel Sanchez' :
                  specialty === 'dermatology' ? 'Dr. Sofia Garcia' :
                  specialty === 'obgyn' ? 'Dr. Isabella Martinez' : 'Dr. Javier Lopez',
      specialty: specialties.find(s => s.id === specialty)?.name || '',
      notes: consultationNotes,
      messages: consultationType === 'message' ? [] : undefined,
    };

    const updatedConsultations = [...consultations, newConsultation];
    setConsultations(updatedConsultations);

    if (consultationType === 'message') {
      setSelectedConsultation(newConsultation);
      setView('detail');
    } else {
      setView('list');
    }
    
    toast({
      title: "Consultation created",
      description: consultationType === 'message' ? 
        "Your messaging consultation has been started." : 
        "Your consultation has been scheduled.",
    });
    
    setConsultationType('');
    setSpecialty('');
    setConsultationNotes('');
    setPreferredDate('');
    setPreferredTime('');
  };

  return (
    <Layout>
      <AnimatedPage>
        <div className="py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Telemedicine</h1>
            
            {view === 'list' && (
              <Button onClick={() => setView('new')}>
                New Consultation
              </Button>
            )}
            
            {view !== 'list' && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setView('list');
                  setSelectedConsultation(null);
                }}
              >
                Back to List
              </Button>
            )}
          </div>
          
          {view === 'list' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Consultations</CardTitle>
                </CardHeader>
                <CardContent>
                  {consultations.length > 0 ? (
                    <div className="space-y-4">
                      {consultations.map((consultation) => (
                        <motion.div 
                          key={consultation.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card 
                            className="cursor-pointer hover:shadow-md transition-all"
                            onClick={() => handleViewConsultation(consultation)}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                                <div className="flex items-center gap-3">
                                  <div className={cn(
                                    "p-3 rounded-full",
                                    consultation.type === 'message' ? "bg-blue-100 text-blue-600" :
                                    consultation.type === 'video' ? "bg-purple-100 text-purple-600" :
                                    "bg-emerald-100 text-emerald-600"
                                  )}>
                                    {consultation.type === 'message' ? <MessageSquare className="h-5 w-5" /> : 
                                     consultation.type === 'video' ? <Video className="h-5 w-5" /> : 
                                     <Phone className="h-5 w-5" />}
                                  </div>
                                  <div>
                                    <h3 className="font-medium">
                                      {consultation.doctorName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {consultation.specialty} • 
                                      {consultation.type === 'message' ? ' Messaging' : 
                                       consultation.type === 'video' ? ' Video Call' : ' Voice Call'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <div className={cn(
                                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                      consultation.status === 'completed' ? "bg-green-100 text-green-800" :
                                      consultation.status === 'scheduled' ? "bg-blue-100 text-blue-800" :
                                      consultation.status === 'pending' ? "bg-amber-100 text-amber-800" :
                                      "bg-red-100 text-red-800"
                                    )}>
                                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(consultation.timestamp).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  </div>
                                  
                                  <Button variant="ghost" size="icon" className="rounded-full">
                                    <ChevronRight className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>
                              
                              {consultation.notes && (
                                <div className="mt-3 pt-3 border-t">
                                  <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Stethoscope className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No Consultations Yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start a new consultation to connect with healthcare providers for medical advice and support.
                      </p>
                      <Button onClick={() => setView('new')}>
                        Start New Consultation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {!isOnline && (
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <WifiOff className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-amber-800">Offline Mode Active</h3>
                        <p className="text-sm text-amber-700">
                          You're working offline. You can still view your consultations and prepare messages, which will sync when connectivity is restored.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {view === 'new' && (
            <Card>
              <CardHeader>
                <CardTitle>New Consultation</CardTitle>
              </CardHeader>
              <CardContent>
                <SlideUp className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Consultation Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {consultationTypes.map((type) => (
                        <ConsultationTypeCard 
                          key={type.id}
                          type={type.id}
                          name={type.name}
                          icon={type.icon}
                          description={type.description}
                          selected={consultationType === type.id}
                          onSelect={setConsultationType}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {consultationType && (
                    <>
                      <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-medium">Specialist Details</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="specialty">Specialty</Label>
                          <Select 
                            value={specialty} 
                            onValueChange={setSpecialty}
                          >
                            <SelectTrigger id="specialty">
                              <SelectValue placeholder="Select specialty" />
                            </SelectTrigger>
                            <SelectContent>
                              {specialties.map((spec) => (
                                <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notes">Reason for Consultation</Label>
                          <Textarea
                            id="notes"
                            placeholder="Describe your symptoms or reason for consultation..."
                            value={consultationNotes}
                            onChange={(e) => setConsultationNotes(e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                      
                      {(consultationType === 'video' || consultationType === 'voice') && (
                        <div className="space-y-4 pt-4 border-t">
                          <h3 className="text-lg font-medium">Preferred Schedule</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="date">Preferred Date</Label>
                              <Input 
                                id="date" 
                                type="date" 
                                value={preferredDate}
                                onChange={(e) => setPreferredDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="time">Preferred Time</Label>
                              <Input 
                                id="time" 
                                type="time" 
                                value={preferredTime}
                                onChange={(e) => setPreferredTime(e.target.value)}
                              />
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">
                            Note: Actual appointment time may vary based on provider availability. You will receive a confirmation.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="pt-2 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setView('list');
                        setConsultationType('');
                        setSpecialty('');
                        setConsultationNotes('');
                        setPreferredDate('');
                        setPreferredTime('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateConsultation}
                      disabled={!consultationType || !specialty || !consultationNotes}
                    >
                      {consultationType === 'message' ? 'Start Conversation' : 'Request Appointment'}
                    </Button>
                  </div>
                </SlideUp>
              </CardContent>
            </Card>
          )}
          
          {view === 'detail' && selectedConsultation && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedConsultation.type === 'message' ? 'Messaging Consultation' : 
                   selectedConsultation.type === 'video' ? 'Video Consultation' : 
                   'Voice Consultation'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {selectedConsultation.type === 'message' ? (
                  <MessageDetail consultation={selectedConsultation} />
                ) : (
                  <ScheduleDetail consultation={selectedConsultation} />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default Telemedicine;
