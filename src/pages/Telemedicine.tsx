
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AnimatedPage, SlideUp } from '@/components/ui/AnimatedTransition';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  MessageSquare, 
  Search,
  Filter,
  Clock, 
  Calendar, 
  Stethoscope,
  UserRound,
  FilePlus,
  History,
  Activity,
  Heart,
  Loader2,
  UserRound as User,
  Video,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserType } from '@/utils/storageUtils';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Consultation, ConsultationTypeInfo, SpecialtyInfo } from '@/types/telemedicine';
import { MessageDetail } from '@/components/telemedicine/MessageDetail';
import { ScheduleDetail } from '@/components/telemedicine/ScheduleDetail';
import { PatientDetail } from '@/components/telemedicine/PatientDetail';

// Mock data
const mockPatientConsultations: Consultation[] = [
  {
    id: 'cons-001',
    type: 'message',
    status: 'completed',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    doctorName: 'Dr. Elena Rodriguez',
    doctorId: 'doc-001',
    specialty: 'General Medicine',
    notes: 'Follow up on medication side effects',
    messages: [
      {
        id: 'msg-001',
        content: 'Hello Dr. Rodriguez, I\'ve been experiencing some dizziness with the new medication. Is this normal?',
        sender: 'patient',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000,
        status: 'read',
      },
      {
        id: 'msg-002',
        content: 'Hello. Yes, dizziness can be a side effect for the first few days. If it persists for more than a week or gets worse, please let me know. Make sure to take the medication with food.',
        sender: 'doctor',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 - 25 * 60 * 1000,
        status: 'read',
      },
      {
        id: 'msg-003',
        content: 'Thank you, I\'ll try taking it with meals and see if that helps.',
        sender: 'patient',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 - 20 * 60 * 1000,
        status: 'read',
      }
    ],
    prescription: [
      {
        id: 'presc-001',
        medication: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 6 hours as needed',
        duration: '7 days',
        instructions: 'Take with food. Avoid alcohol.'
      }
    ]
  },
  {
    id: 'cons-002',
    type: 'video',
    status: 'scheduled',
    timestamp: Date.now() + 2 * 24 * 60 * 60 * 1000,
    doctorName: 'Dr. Miguel Sanchez',
    doctorId: 'doc-002',
    specialty: 'Cardiology',
    notes: 'Initial consultation for heart palpitations',
    duration: 30,
  },
  {
    id: 'cons-003',
    type: 'message',
    status: 'pending',
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    doctorName: 'Dr. Sofia Garcia',
    doctorId: 'doc-003',
    specialty: 'Dermatology',
    notes: 'Rash evaluation',
    messages: [
      {
        id: 'msg-004',
        content: 'I\'ve developed a rash on my arms after starting the new medication. I\'ve attached some photos.',
        sender: 'patient',
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
        status: 'delivered',
        attachments: [
          {
            id: 'att-001',
            name: 'rash-photo-1.jpg',
            type: 'image/jpeg',
            url: 'https://example.com/rash-photo-1.jpg',
          },
          {
            id: 'att-002',
            name: 'rash-photo-2.jpg',
            type: 'image/jpeg',
            url: 'https://example.com/rash-photo-2.jpg',
          }
        ]
      }
    ]
  }
];

const mockDoctorConsultations: Consultation[] = [
  {
    id: 'cons-001',
    type: 'message',
    status: 'completed',
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    patientName: 'Maria Lopez',
    patientId: 'pat-001',
    doctorName: 'Dr. Elena Rodriguez',
    specialty: 'General Medicine',
    notes: 'Follow up on medication side effects',
    messages: [
      {
        id: 'msg-001',
        content: 'Hello Dr. Rodriguez, I\'ve been experiencing some dizziness with the new medication. Is this normal?',
        sender: 'patient',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000,
        status: 'read',
      },
      {
        id: 'msg-002',
        content: 'Hello. Yes, dizziness can be a side effect for the first few days. If it persists for more than a week or gets worse, please let me know. Make sure to take the medication with food.',
        sender: 'doctor',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 - 25 * 60 * 1000,
        status: 'read',
      },
      {
        id: 'msg-003',
        content: 'Thank you, I\'ll try taking it with meals and see if that helps.',
        sender: 'patient',
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000 - 20 * 60 * 1000,
        status: 'read',
      }
    ],
    prescription: [
      {
        id: 'presc-001',
        medication: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 6 hours as needed',
        duration: '7 days',
        instructions: 'Take with food. Avoid alcohol.'
      }
    ]
  },
  {
    id: 'cons-004',
    type: 'video',
    status: 'scheduled',
    timestamp: Date.now() + 1 * 24 * 60 * 60 * 1000,
    patientName: 'Carlos Mendez',
    patientId: 'pat-002',
    doctorName: 'Dr. Elena Rodriguez',
    specialty: 'General Medicine',
    notes: 'Follow-up on lab results',
    duration: 20,
    vitalSigns: {
      temperature: '98.6 F',
      heartRate: '72 bpm',
      bloodPressure: '120/80 mmHg',
      oxygenSaturation: '98%',
      respiratoryRate: '16 breaths/min'
    }
  },
  {
    id: 'cons-005',
    type: 'voice',
    status: 'active',
    timestamp: Date.now(),
    patientName: 'Sophia Kim',
    patientId: 'pat-003',
    doctorName: 'Dr. Elena Rodriguez',
    specialty: 'General Medicine',
    notes: 'Discussion of new symptoms',
    duration: 15,
  }
];

const consultationTypes: ConsultationTypeInfo[] = [
  { id: 'message', name: 'Messaging', icon: MessageSquare, description: 'Send messages and images to a healthcare provider' },
  { id: 'video', name: 'Video Call', icon: Video, description: 'Schedule a video consultation with a specialist' },
  { id: 'voice', name: 'Voice Call', icon: Phone, description: 'Schedule a phone call with a healthcare provider' }
];

const specialties: SpecialtyInfo[] = [
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
  icon: any; 
  description: string; 
  selected: boolean; 
  onSelect: (type: string) => void;
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        selected ? "border-health-primary bg-health-primary/5" : "border"
      )}
      onClick={() => onSelect(type)}
    >
      <CardContent className={cn(
        "flex items-start gap-3",
        isMobile ? "p-3" : "p-4"
      )}>
        <div className={cn(
          "rounded-full flex-shrink-0",
          selected ? "bg-health-primary/20 text-health-primary" : "bg-muted text-muted-foreground",
          isMobile ? "p-2" : "p-3"
        )}>
          <Icon className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className={cn(
            "text-muted-foreground",
            isMobile ? "text-xs" : "text-sm"
          )}>{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Telemedicine = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('consultations');
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();
  
  const [isCreating, setIsCreating] = useState(false);
  const [consultationType, setConsultationType] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [consultationNotes, setConsultationNotes] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const userType = user?.userType;
      if (userType === UserType.PATIENT) {
        setConsultations(mockPatientConsultations);
      } else {
        setConsultations(mockDoctorConsultations);
      }
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  const filteredConsultations = consultations.filter(consultation => {
    const searchLower = searchTerm.toLowerCase();
    const nameToSearch = user?.userType === UserType.PATIENT 
      ? consultation.doctorName.toLowerCase() 
      : (consultation.patientName || '').toLowerCase();
    
    return nameToSearch.includes(searchLower) || 
           consultation.specialty.toLowerCase().includes(searchLower) ||
           consultation.type.toLowerCase().includes(searchLower) ||
           consultation.status.toLowerCase().includes(searchLower);
  });
  
  const handleCreateConsultation = () => {
    if (!consultationType || !selectedSpecialty) {
      toast({
        title: "Required fields missing",
        description: "Please select a consultation type and specialty.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new consultation
    const newConsultation: Consultation = {
      id: `cons-${Date.now()}`,
      type: consultationType as 'message' | 'video' | 'voice',
      status: 'pending',
      timestamp: Date.now(),
      doctorName: `Dr. ${specialties.find(s => s.id === selectedSpecialty)?.name || 'Specialist'}`,
      doctorId: `doc-${Date.now()}`,
      specialty: specialties.find(s => s.id === selectedSpecialty)?.name || 'Specialty',
      notes: consultationNotes || undefined,
      messages: consultationType === 'message' ? [] : undefined,
      duration: consultationType !== 'message' ? 30 : undefined
    };
    
    // Add the new consultation to the list
    setConsultations([newConsultation, ...consultations]);
    
    toast({
      title: "Consultation request sent",
      description: "A healthcare provider will respond to your request soon.",
    });
    
    setIsCreating(false);
    setConsultationType('');
    setSelectedSpecialty('');
    setConsultationNotes('');
  };
  
  return (
    <Layout>
      <AnimatedPage className="px-4 md:px-8 py-6 max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Telemedicine</h1>
          <p className="text-muted-foreground">
            Connect with healthcare providers through secure messaging and video consultations
          </p>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
            </TabsList>
            
            {user?.userType === UserType.PATIENT && !isCreating && (
              <Button onClick={() => setIsCreating(true)}>
                Start Consultation
              </Button>
            )}
          </div>
          
          <TabsContent value="consultations" className="space-y-4">
            {isCreating ? (
              <SlideUp>
                <Card>
                  <CardHeader>
                    <CardTitle>Request New Consultation</CardTitle>
                    <CardDescription>
                      Select the type of consultation you'd like to request
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Consultation Type</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                    
                    <div className="space-y-2">
                      <Label>Specialty</Label>
                      <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map((specialty) => (
                            <SelectItem key={specialty.id} value={specialty.id}>
                              {specialty.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Notes (Optional)</Label>
                      <Textarea 
                        placeholder="Briefly describe your symptoms or reason for consultation..."
                        value={consultationNotes}
                        onChange={(e) => setConsultationNotes(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateConsultation}>
                      Request Consultation
                    </Button>
                  </CardFooter>
                </Card>
              </SlideUp>
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search consultations..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-2 text-xs gap-1">
                      <Filter className="h-3 w-3" />
                      Filter
                    </Button>
                    <Select defaultValue="all">
                      <SelectTrigger className="h-8 text-xs w-[110px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-1">
                    <Card className="h-full">
                      <CardHeader className="px-3 py-2 md:p-4">
                        <CardTitle className="text-base md:text-lg">Your Consultations</CardTitle>
                      </CardHeader>
                      
                      <ScrollArea className="h-[60vh] border-t">
                        {loading ? (
                          <div className="p-3 md:p-4 space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                              <div key={index} className="flex gap-3 items-center">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                  <Skeleton className="h-4 w-3/4" />
                                  <Skeleton className="h-3 w-1/2" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : filteredConsultations.length > 0 ? (
                          <div>
                            {filteredConsultations.map((consultation) => (
                              <div 
                                key={consultation.id}
                                className={cn(
                                  "p-3 md:p-4 border-b last:border-0 cursor-pointer hover:bg-muted/30 transition-colors",
                                  selectedConsultation?.id === consultation.id && "bg-muted"
                                )}
                                onClick={() => {
                                  setSelectedConsultation(consultation);
                                  setShowPatientDetail(false);
                                }}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 md:h-10 md:w-10 border">
                                      <AvatarFallback className="bg-health-primary/10 text-health-primary text-xs md:text-sm">
                                        {user?.userType === UserType.PATIENT 
                                          ? consultation.doctorName.split(' ').map(n => n[0]).join('')
                                          : (consultation.patientName || 'PT').split(' ').map(n => n[0]).join('')
                                        }
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <h3 className="font-medium text-sm md:text-base">
                                        {user?.userType === UserType.PATIENT 
                                          ? consultation.doctorName
                                          : consultation.patientName || 'Patient'
                                        }
                                      </h3>
                                      <p className="text-xs md:text-sm text-muted-foreground">{consultation.specialty}</p>
                                    </div>
                                  </div>
                                  
                                  <Badge 
                                    variant="outline" 
                                    className={cn(
                                      "text-[10px] md:text-xs rounded-full font-normal",
                                      consultation.status === 'completed' ? "bg-green-50 text-green-700" :
                                      consultation.status === 'scheduled' ? "bg-blue-50 text-blue-700" :
                                      consultation.status === 'pending' ? "bg-amber-50 text-amber-700" :
                                      consultation.status === 'active' ? "bg-purple-50 text-purple-700" :
                                      "bg-red-50 text-red-700"
                                    )}
                                  >
                                    {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center gap-1 mt-2 text-xs md:text-sm text-muted-foreground">
                                  {consultation.type === 'message' ? (
                                    <MessageSquare className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  ) : consultation.type === 'video' ? (
                                    <Video className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  ) : (
                                    <Phone className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  )}
                                  <span>
                                    {consultation.type.charAt(0).toUpperCase() + consultation.type.slice(1)}
                                  </span>
                                  <span className="mx-1">•</span>
                                  <Clock className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                                  <span>
                                    {new Date(consultation.timestamp).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full py-8">
                            {searchTerm ? (
                              <>
                                <Search className="h-10 w-10 mb-2 text-muted-foreground/50" />
                                <p className="text-muted-foreground">No consultations found for "{searchTerm}"</p>
                                <Button 
                                  variant="link" 
                                  onClick={() => setSearchTerm('')}
                                  className="mt-1"
                                >
                                  Clear search
                                </Button>
                              </>
                            ) : (
                              <>
                                <MessageSquare className="h-10 w-10 mb-2 text-muted-foreground/50" />
                                <p className="text-muted-foreground">No consultations yet</p>
                                {user?.userType === UserType.PATIENT && (
                                  <Button 
                                    variant="link" 
                                    onClick={() => setIsCreating(true)}
                                    className="mt-1"
                                  >
                                    Start your first consultation
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </ScrollArea>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <Card className="h-full">
                      {selectedConsultation ? (
                        showPatientDetail && user?.userType === UserType.HEALTH_WORKER ? (
                          <PatientDetail 
                            patient={{
                              name: selectedConsultation.patientName || 'Patient',
                              id: selectedConsultation.patientId || 'unknown',
                              consultation: selectedConsultation
                            }}
                            onClose={() => setShowPatientDetail(false)}
                          />
                        ) : (
                          <div>
                            {user?.userType === UserType.HEALTH_WORKER && selectedConsultation.patientName && (
                              <div className="p-2 md:p-3 bg-muted/30 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <UserRound className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">{selectedConsultation.patientName}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 text-xs"
                                  onClick={() => setShowPatientDetail(true)}
                                >
                                  View Patient Profile
                                </Button>
                              </div>
                            )}
                            
                            {selectedConsultation.type === 'message' ? (
                              <MessageDetail 
                                consultation={selectedConsultation} 
                                userType={user?.userType || UserType.PATIENT}
                              />
                            ) : (
                              <ScheduleDetail
                                consultation={selectedConsultation}
                                userType={user?.userType || UserType.PATIENT}
                              />
                            )}
                          </div>
                        )
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
                          <div className="text-center max-w-md mx-auto">
                            <div className="p-4 rounded-full bg-health-primary/10 inline-block mb-3">
                              {user?.userType === UserType.PATIENT ? (
                                <Stethoscope className="h-8 w-8 text-health-primary" />
                              ) : (
                                <UserRound className="h-8 w-8 text-health-primary" />
                              )}
                            </div>
                            <h2 className="text-xl font-semibold mb-2">
                              {user?.userType === UserType.PATIENT 
                                ? "Connect with a Healthcare Provider" 
                                : "Select a Patient Consultation"
                              }
                            </h2>
                            <p className="text-muted-foreground mb-4">
                              {user?.userType === UserType.PATIENT 
                                ? "Select a consultation from the list or start a new one to connect with a healthcare provider." 
                                : "Select a patient consultation from the list to view details and respond."
                              }
                            </p>
                            {user?.userType === UserType.PATIENT && (
                              <Button onClick={() => setIsCreating(true)}>
                                Start Consultation
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="providers" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search healthcare providers..." className="pl-9" />
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.id} value={specialty.id}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((provider) => (
                <Card key={provider} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 border">
                          <AvatarFallback className="bg-health-primary/10 text-health-primary">
                            DS
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">Dr. Sarah Johnson</h3>
                          <p className="text-sm text-muted-foreground">Cardiology</p>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg 
                                key={star} 
                                className="w-3 h-3 text-yellow-500" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-xs">(124)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm">
                        <p>Specializes in cardiovascular health, including heart disease prevention and treatment.</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        <Badge variant="outline" className="bg-muted/50 text-xs font-normal">
                          Heart Disease
                        </Badge>
                        <Badge variant="outline" className="bg-muted/50 text-xs font-normal">
                          Hypertension
                        </Badge>
                        <Badge variant="outline" className="bg-muted/50 text-xs font-normal">
                          Cholesterol
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="border-t p-3 flex justify-between items-center bg-muted/30">
                      <div className="text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Available today
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="h-8"
                        onClick={() => {
                          if (user?.userType !== UserType.PATIENT) {
                            toast({
                              title: "Not available",
                              description: "Only patients can start consultations with providers",
                              variant: "destructive"
                            });
                            return;
                          }
                          
                          setIsCreating(true);
                          setActiveTab('consultations');
                          setConsultationType('message');
                          setSelectedSpecialty('cardiology');
                        }}
                      >
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Consult
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </AnimatedPage>
    </Layout>
  );
};

export default Telemedicine;
