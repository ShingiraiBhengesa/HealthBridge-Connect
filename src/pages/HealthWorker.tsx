
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, User, UserPlus, Trash2, Search, Filter, Plus, Clipboard, Calendar, Mail, FileText, UserX, Table as TableIcon, Grid } from 'lucide-react';
import { useHealthRecords } from '@/utils/healthRecordUtils';
import { usePatients, Patient } from '@/utils/patientUtils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AnimatedPage } from '@/components/ui/AnimatedTransition';
import { useAuth } from '@/hooks/use-auth';
import { UserType, Appointment, getAppointmentsByHealthWorker, saveAppointment } from '@/utils/storageUtils';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import PatientForm from '@/components/patient/PatientForm';
import { MessageDialog } from '@/components/messaging/MessageDialog';

const HealthWorker = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated || (user?.userType !== UserType.HEALTH_WORKER)) {
      navigate('/login');
      toast({
        title: "Access restricted",
        description: "You need to be logged in as a health worker to access this page.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, user, navigate]);

  const [activeTab, setActiveTab] = useState("patients");
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isTableView, setIsTableView] = useLocalStorage<boolean>("healthWorkerTableView", true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [isAllPatientsSelected, setIsAllPatientsSelected] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isViewingRecords, setIsViewingRecords] = useState(false);
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messagePatientData, setMessagePatientData] = useState<Patient | null>(null);

  const { patients, isLoading: isPatientsLoading, error: patientsError, addPatient, removePatient } = usePatients();
  const { healthRecords } = useHealthRecords();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user?.id) {
      const workerAppointments = getAppointmentsByHealthWorker(user.id);
      setAppointments(workerAppointments);
    }
  }, [user?.id]);

  const filteredPatients = patients?.filter(patient => 
    patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getPatientHealthRecords = (patientId: string) => {
    return healthRecords.filter(record => record.patientId === patientId);
  };

  const getPatientAppointments = (patientId: string) => {
    return appointments.filter(appointment => appointment.patientId === patientId);
  };

  const togglePatientSelection = (patientId: string) => {
    if (selectedPatientIds.includes(patientId)) {
      setSelectedPatientIds(selectedPatientIds.filter(id => id !== patientId));
    } else {
      setSelectedPatientIds([...selectedPatientIds, patientId]);
    }
  };

  const toggleSelectAllPatients = () => {
    if (isAllPatientsSelected) {
      setSelectedPatientIds([]);
    } else {
      setSelectedPatientIds(filteredPatients.map(patient => patient.id));
    }
    setIsAllPatientsSelected(!isAllPatientsSelected);
  };

  const handleBulkDeletePatients = () => {
    if (selectedPatientIds.length === 0) {
      toast({
        title: "No patients selected",
        description: "Please select patients to delete.",
      });
      return;
    }

    selectedPatientIds.forEach(id => {
      removePatient(id);
    });

    toast({
      title: "Patients deleted",
      description: `${selectedPatientIds.length} patient(s) have been deleted.`,
    });

    setSelectedPatientIds([]);
    setIsAllPatientsSelected(false);
  };

  const handleAddPatient = async (patientData: Omit<Patient, 'id'>) => {
    try {
      await addPatient(patientData);
      setIsAddingPatient(false);
      toast({
        title: "Patient added",
        description: `${patientData.firstName} ${patientData.lastName} has been added successfully.`,
      });
    } catch (error) {
      toast({
        title: "Failed to add patient",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDeletePatient = (patient: Patient) => {
    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePatient = async () => {
    if (!patientToDelete) return;
    
    try {
      await removePatient(patientToDelete.id);
      toast({
        title: "Patient deleted",
        description: `${patientToDelete.firstName} ${patientToDelete.lastName} has been deleted successfully.`,
      });
      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
    } catch (error) {
      toast({
        title: "Failed to delete patient",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const addMockAppointment = (patientId: string) => {
    if (!user?.id) return;
    
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patientId,
      healthWorkerId: user.id,
      date: format(new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      time: `${Math.floor(Math.random() * 8) + 9}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      reason: 'Regular checkup',
      status: 'scheduled',
      createdAt: Date.now()
    };
    
    saveAppointment(appointment);
    setAppointments([...appointments, appointment]);
    
    toast({
      title: "Appointment created",
      description: "New appointment has been scheduled.",
    });
  };

  const viewPatientRecords = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewingRecords(true);
  };

  const handleMessagePatient = (patient: Patient) => {
    setMessagePatientData(patient);
    setIsMessageDialogOpen(true);
  };

  const renderPatientCard = (patient: Patient) => (
    <Card key={patient.id} className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg truncate">{patient.firstName} {patient.lastName}</CardTitle>
          <div className="flex">
            <input 
              type="checkbox" 
              checked={selectedPatientIds.includes(patient.id)}
              onChange={() => togglePatientSelection(patient.id)}
              className="h-4 w-4 mr-2"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-destructive"
              onClick={() => handleDeletePatient(patient)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="truncate"><span className="font-medium">Email:</span> {patient.email}</p>
          <p><span className="font-medium">Phone:</span> {patient.contactNumber}</p>
          <p><span className="font-medium">Gender:</span> {patient.gender}</p>
          <p><span className="font-medium">DOB:</span> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 pt-2">
        <Button variant="outline" size="sm" onClick={() => viewPatientRecords(patient)}>
          <FileText className="h-3.5 w-3.5 mr-1.5" />
          Records
        </Button>
        <Button variant="outline" size="sm" onClick={() => addMockAppointment(patient.id)}>
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          Schedule
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleMessagePatient(patient)}>
          <Mail className="h-3.5 w-3.5 mr-1.5" />
          Message
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <Layout>
      <AnimatedPage>
        <div className="py-4 sm:py-6">
          <div className="px-2 sm:px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">Health Worker Dashboard</h1>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Button 
                  onClick={() => setIsTableView(!isTableView)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5"
                >
                  {isTableView ? (
                    <>
                      <Grid className="h-4 w-4" /> 
                      <span className="sr-only sm:not-sr-only">Card View</span>
                    </>
                  ) : (
                    <>
                      <TableIcon className="h-4 w-4" /> 
                      <span className="sr-only sm:not-sr-only">Table View</span>
                    </>
                  )}
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1.5"
                  onClick={() => setIsAddingPatient(true)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">Add Patient</span>
                </Button>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`flex items-center gap-1.5 ${selectedPatientIds.length === 0 ? 'opacity-50 cursor-not-allowed' : 'text-destructive hover:text-destructive'}`}
                  onClick={handleBulkDeletePatients}
                  disabled={selectedPatientIds.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">Delete</span>
                  {selectedPatientIds.length > 0 && (
                    <span className="ml-1">({selectedPatientIds.length})</span>
                  )}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="patients" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <div className="overflow-x-auto pb-1">
                <TabsList className="w-full sm:w-auto">
                  <TabsTrigger value="patients" className="px-2 sm:px-4">
                    <User className="mr-0 sm:mr-2 h-4 w-4" />
                    <span className="sr-only sm:not-sr-only">Patients</span>
                  </TabsTrigger>
                  <TabsTrigger value="appointments" className="px-2 sm:px-4">
                    <Calendar className="mr-0 sm:mr-2 h-4 w-4" />
                    <span className="sr-only sm:not-sr-only">Appointments</span>
                  </TabsTrigger>
                  <TabsTrigger value="records" className="px-2 sm:px-4">
                    <FileText className="mr-0 sm:mr-2 h-4 w-4" />
                    <span className="sr-only sm:not-sr-only">Health Records</span>
                  </TabsTrigger>
                  <TabsTrigger value="messages" className="px-2 sm:px-4">
                    <Mail className="mr-0 sm:mr-2 h-4 w-4" />
                    <span className="sr-only sm:not-sr-only">Messages</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="patients">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="icon" className="w-10">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={() => setIsAddingPatient(true)} 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Patient
                    </Button>
                  </div>
                </div>

                {isPatientsLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <p>Loading patients...</p>
                  </div>
                ) : patientsError ? (
                  <div className="flex justify-center items-center h-40">
                    <p className="text-destructive">Error loading patients: {patientsError.message}</p>
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="flex flex-col justify-center items-center h-40 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground mb-2">No patients found</p>
                    <Button variant="outline" size="sm" onClick={() => setIsAddingPatient(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Patient
                    </Button>
                  </div>
                ) : isTableView ? (
                  <div className="rounded-md border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-10 text-center">
                              <input
                                type="checkbox"
                                checked={isAllPatientsSelected}
                                onChange={toggleSelectAllPatients}
                                className="h-4 w-4"
                              />
                            </TableHead>
                            <TableHead className="font-semibold">Name</TableHead>
                            <TableHead className="font-semibold hidden md:table-cell">Email</TableHead>
                            <TableHead className="font-semibold hidden sm:table-cell">Phone</TableHead>
                            <TableHead className="font-semibold hidden lg:table-cell">Gender</TableHead>
                            <TableHead className="font-semibold hidden lg:table-cell">Date of Birth</TableHead>
                            <TableHead className="text-center font-semibold">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPatients.map((patient) => (
                            <TableRow key={patient.id} className="hover:bg-muted/40 transition-colors">
                              <TableCell className="text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedPatientIds.includes(patient.id)}
                                  onChange={() => togglePatientSelection(patient.id)}
                                  className="h-4 w-4"
                                />
                              </TableCell>
                              <TableCell className="font-medium">{patient.firstName} {patient.lastName}</TableCell>
                              <TableCell className="hidden md:table-cell">{patient.email}</TableCell>
                              <TableCell className="hidden sm:table-cell">{patient.contactNumber}</TableCell>
                              <TableCell className="hidden lg:table-cell">{patient.gender}</TableCell>
                              <TableCell className="hidden lg:table-cell">{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex justify-center space-x-1 sm:space-x-2">
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => viewPatientRecords(patient)} title="View Records">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => addMockAppointment(patient.id)} title="Schedule Appointment">
                                    <Calendar className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleMessagePatient(patient)} title="Message Patient">
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeletePatient(patient)} title="Delete Patient">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPatients.map(renderPatientCard)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="appointments">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Patient</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold hidden sm:table-cell">Time</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">Reason</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            <p className="text-muted-foreground mb-2">No appointments found</p>
                            <Button variant="outline" size="sm" onClick={() => filteredPatients.length > 0 && addMockAppointment(filteredPatients[0].id)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Create Test Appointment
                            </Button>
                          </TableCell>
                        </TableRow>
                      ) : (
                        appointments.map((appointment) => {
                          const patient = patients.find(p => p.id === appointment.patientId);
                          return (
                            <TableRow key={appointment.id} className="hover:bg-muted/40">
                              <TableCell className="font-medium">
                                {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"}
                              </TableCell>
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell className="hidden sm:table-cell">{appointment.time}</TableCell>
                              <TableCell className="hidden md:table-cell">{appointment.reason}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    appointment.status === 'scheduled' ? 'outline' :
                                    appointment.status === 'completed' ? 'default' : 'destructive'
                                  }
                                >
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="records">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Patient</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">Symptoms</TableHead>
                        <TableHead className="font-semibold hidden sm:table-cell">Diagnosis</TableHead>
                        <TableHead className="font-semibold hidden lg:table-cell">Treatment</TableHead>
                        <TableHead className="font-semibold">Severity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {healthRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-6">
                            <p className="text-muted-foreground">No health records found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        healthRecords.map((record) => {
                          const patient = patients.find(p => p.id === record.patientId);
                          return (
                            <TableRow key={record.id} className="hover:bg-muted/40">
                              <TableCell className="font-medium">
                                {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"}
                              </TableCell>
                              <TableCell>{new Date(record.timestamp).toLocaleDateString()}</TableCell>
                              <TableCell className="hidden md:table-cell max-w-[150px] truncate" title={record.symptoms}>{record.symptoms}</TableCell>
                              <TableCell className="hidden sm:table-cell max-w-[150px] truncate" title={record.diagnosis}>{record.diagnosis}</TableCell>
                              <TableCell className="hidden lg:table-cell max-w-[150px] truncate" title={record.treatment}>{record.treatment}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    record.severity === 'mild' ? 'outline' :
                                    record.severity === 'moderate' ? 'default' : 'destructive'
                                  }
                                >
                                  {record.severity}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="messages">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Patient</TableHead>
                        <TableHead className="font-semibold hidden sm:table-cell">Last Message</TableHead>
                        <TableHead className="font-semibold hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-center font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            <p className="text-muted-foreground">No patients available to message</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPatients.map((patient) => (
                          <TableRow key={patient.id} className="hover:bg-muted/40">
                            <TableCell className="font-medium">{patient.firstName} {patient.lastName}</TableCell>
                            <TableCell className="max-w-xs truncate hidden sm:table-cell">
                              <span className="text-muted-foreground italic">No messages yet</span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">—</TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleMessagePatient(patient)}
                                >
                                  <Mail className="h-4 w-4 mr-0 sm:mr-2" />
                                  <span className="sr-only sm:not-sr-only">Message</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Dialog open={isViewingRecords} onOpenChange={setIsViewingRecords}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}'s Records` : 'Patient Records'}
              </DialogTitle>
              <DialogDescription>
                View health records and appointments for this patient
              </DialogDescription>
            </DialogHeader>
            
            {selectedPatient && (
              <Tabs defaultValue="healthRecords" className="w-full">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="healthRecords" className="flex-1">Health Records</TabsTrigger>
                  <TabsTrigger value="patientAppointments" className="flex-1">Appointments</TabsTrigger>
                </TabsList>
                
                <TabsContent value="healthRecords">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Symptoms</TableHead>
                          <TableHead className="font-semibold">Diagnosis</TableHead>
                          <TableHead className="font-semibold">Treatment</TableHead>
                          <TableHead className="font-semibold">Severity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPatientHealthRecords(selectedPatient.id).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              <p className="text-muted-foreground">No health records found for this patient</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          getPatientHealthRecords(selectedPatient.id).map((record) => (
                            <TableRow key={record.id} className="hover:bg-muted/40">
                              <TableCell>{new Date(record.timestamp).toLocaleDateString()}</TableCell>
                              <TableCell>{record.symptoms}</TableCell>
                              <TableCell>{record.diagnosis}</TableCell>
                              <TableCell>{record.treatment}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    record.severity === 'mild' ? 'outline' :
                                    record.severity === 'moderate' ? 'default' : 'destructive'
                                  }
                                >
                                  {record.severity}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="patientAppointments">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Time</TableHead>
                          <TableHead className="font-semibold">Reason</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPatientAppointments(selectedPatient.id).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              <p className="text-muted-foreground mb-2">No appointments found for this patient</p>
                              <Button variant="outline" size="sm" onClick={() => addMockAppointment(selectedPatient.id)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Schedule Appointment
                              </Button>
                            </TableCell>
                          </TableRow>
                        ) : (
                          getPatientAppointments(selectedPatient.id).map((appointment) => (
                            <TableRow key={appointment.id} className="hover:bg-muted/40">
                              <TableCell>{appointment.date}</TableCell>
                              <TableCell>{appointment.time}</TableCell>
                              <TableCell>{appointment.reason}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    appointment.status === 'scheduled' ? 'outline' :
                                    appointment.status === 'completed' ? 'default' : 'destructive'
                                  }
                                >
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            )}
            
            <DialogFooter className="sm:justify-end">
              <Button variant="outline" onClick={() => setIsViewingRecords(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Patient</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new patient to the system
              </DialogDescription>
            </DialogHeader>
            
            <PatientForm 
              onSubmit={handleAddPatient}
              onCancel={() => setIsAddingPatient(false)}
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Patient Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {patientToDelete?.firstName} {patientToDelete?.lastName}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPatientToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeletePatient} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add the Message Dialog component */}
        <MessageDialog
          isOpen={isMessageDialogOpen}
          patient={messagePatientData}
          healthWorkerId={user?.id || ''}
          onClose={() => {
            setIsMessageDialogOpen(false);
            setMessagePatientData(null);
          }}
        />
      </AnimatedPage>
    </Layout>
  );
};

export default HealthWorker;
