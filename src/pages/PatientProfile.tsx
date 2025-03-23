
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnimatedPage, SlideUp } from '@/components/ui/AnimatedTransition';
import { 
  getPatientProfile, 
  savePatientProfile, 
  PatientProfile as PatientProfileType,
  getSymptomHistory,
  SymptomCheckResult
} from '@/utils/storageUtils';
import { toast } from '@/components/ui/use-toast';
import { UserCircle, Plus, X, CalendarClock, FilePlus2, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSeverityBgColor, getSeverityColor } from '@/utils/symptomCheckerData';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const PatientProfile = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<PatientProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [symptomHistory, setSymptomHistory] = useState<SymptomCheckResult[]>([]);
  
  // Form fields
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  useEffect(() => {
    // Load profile data
    const savedProfile = getPatientProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      setName(savedProfile.name);
      // Fix: Check if age is null/undefined before toString()
      setAge(savedProfile.age != null ? savedProfile.age.toString() : '');
      setGender(savedProfile.gender || '');
      setBloodType(savedProfile.bloodType || '');
      setAllergies(savedProfile.allergies || []);
      setChronicConditions(savedProfile.chronicConditions || []);
      setMedications(savedProfile.medications || []);
      if (savedProfile.emergencyContact) {
        setEmergencyContactName(savedProfile.emergencyContact.name || '');
        setEmergencyContactRelationship(savedProfile.emergencyContact.relationship || '');
        setEmergencyContactPhone(savedProfile.emergencyContact.phone || '');
      }
    } else {
      // If no profile exists, go to edit mode
      setIsEditing(true);
    }

    // Load symptom history
    const history = getSymptomHistory();
    setSymptomHistory(history.sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const handleSaveProfile = () => {
    if (!name || !age || !gender) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields (name, age, gender).",
        variant: "destructive",
      });
      return;
    }

    const newProfile: PatientProfileType = {
      id: profile?.id || `profile-${Date.now()}`,
      name,
      age: parseInt(age),
      gender,
      bloodType: bloodType || undefined,
      allergies,
      chronicConditions,
      medications,
      emergencyContact: emergencyContactName ? {
        name: emergencyContactName,
        relationship: emergencyContactRelationship,
        phone: emergencyContactPhone,
      } : undefined,
      lastUpdated: Date.now(),
    };

    savePatientProfile(newProfile);
    setProfile(newProfile);
    setIsEditing(false);

    toast({
      title: "Profile saved",
      description: "Your health profile has been updated successfully.",
    });
  };

  const handleAddItem = (
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>, 
    newItem: string, 
    setNewItem: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!newItem.trim()) return;
    if (!list.includes(newItem.trim())) {
      setList([...list, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>, 
    item: string
  ) => {
    setList(list.filter((i) => i !== item));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <AnimatedPage>
        <div className="py-4 sm:py-8 px-2 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Health Profile</h1>
            
            {!isEditing && profile && (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            )}
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4 sm:space-y-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="history">Health History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 sm:space-y-6">
              {isEditing ? (
                <Card>
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="flex items-center text-xl sm:text-2xl">
                      <UserCircle className="mr-2 h-5 w-5 text-health-primary" />
                      Edit Health Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
                    <SlideUp className="space-y-4">
                      {/* Basic Information */}
                      <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-base sm:text-lg font-medium">Basic Information</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input 
                              id="name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)} 
                              placeholder="Enter your full name"
                              required
                            />
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="age">Age *</Label>
                            <Input 
                              id="age" 
                              type="number" 
                              value={age} 
                              onChange={(e) => setAge(e.target.value)}
                              placeholder="Enter your age"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                          <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="gender">Gender *</Label>
                            <Select 
                              value={gender} 
                              onValueChange={setGender}
                            >
                              <SelectTrigger id="gender">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="bloodType">Blood Type</Label>
                            <Select 
                              value={bloodType} 
                              onValueChange={setBloodType}
                            >
                              <SelectTrigger id="bloodType">
                                <SelectValue placeholder={isMobile ? "Select blood type" : "Select blood type (if known)"} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                                <SelectItem value="unknown">Unknown</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Medical Information */}
                      <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
                        <h3 className="text-base sm:text-lg font-medium">Medical Information</h3>
                        
                        {/* Allergies */}
                        <div className="space-y-1 sm:space-y-2">
                          <Label>Allergies</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {allergies.map(allergy => (
                              <div 
                                key={allergy} 
                                className="flex items-center bg-muted px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                              >
                                <span>{allergy}</span>
                                <X 
                                  className="ml-1 sm:ml-2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                                  onClick={() => handleRemoveItem(allergies, setAllergies, allergy)}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input 
                              value={newAllergy} 
                              onChange={(e) => setNewAllergy(e.target.value)}
                              placeholder="Add an allergy"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddItem(allergies, setAllergies, newAllergy, setNewAllergy);
                                }
                              }}
                            />
                            <Button 
                              type="button" 
                              variant="secondary" 
                              size="icon"
                              onClick={() => handleAddItem(allergies, setAllergies, newAllergy, setNewAllergy)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Chronic Conditions */}
                        <div className="space-y-1 sm:space-y-2">
                          <Label>Chronic Conditions</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {chronicConditions.map(condition => (
                              <div 
                                key={condition} 
                                className="flex items-center bg-muted px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                              >
                                <span>{condition}</span>
                                <X 
                                  className="ml-1 sm:ml-2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                                  onClick={() => handleRemoveItem(chronicConditions, setChronicConditions, condition)}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input 
                              value={newCondition} 
                              onChange={(e) => setNewCondition(e.target.value)}
                              placeholder="Add a chronic condition"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddItem(chronicConditions, setChronicConditions, newCondition, setNewCondition);
                                }
                              }}
                            />
                            <Button 
                              type="button" 
                              variant="secondary" 
                              size="icon"
                              onClick={() => handleAddItem(chronicConditions, setChronicConditions, newCondition, setNewCondition)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Medications */}
                        <div className="space-y-1 sm:space-y-2">
                          <Label>Current Medications</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {medications.map(medication => (
                              <div 
                                key={medication} 
                                className="flex items-center bg-muted px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                              >
                                <span>{medication}</span>
                                <X 
                                  className="ml-1 sm:ml-2 h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                                  onClick={() => handleRemoveItem(medications, setMedications, medication)}
                                />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input 
                              value={newMedication} 
                              onChange={(e) => setNewMedication(e.target.value)}
                              placeholder="Add a medication"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddItem(medications, setMedications, newMedication, setNewMedication);
                                }
                              }}
                            />
                            <Button 
                              type="button" 
                              variant="secondary" 
                              size="icon"
                              onClick={() => handleAddItem(medications, setMedications, newMedication, setNewMedication)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
                        <h3 className="text-base sm:text-lg font-medium">Emergency Contact</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                          <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="emergencyName">Contact Name</Label>
                            <Input 
                              id="emergencyName" 
                              value={emergencyContactName} 
                              onChange={(e) => setEmergencyContactName(e.target.value)}
                              placeholder="Emergency contact name"
                            />
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="emergencyRelationship">Relationship</Label>
                            <Input 
                              id="emergencyRelationship" 
                              value={emergencyContactRelationship} 
                              onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                              placeholder="e.g., Spouse, Parent, Friend"
                            />
                          </div>
                          
                          <div className="space-y-1 sm:space-y-2">
                            <Label htmlFor="emergencyPhone">Phone Number</Label>
                            <Input 
                              id="emergencyPhone" 
                              value={emergencyContactPhone} 
                              onChange={(e) => setEmergencyContactPhone(e.target.value)}
                              placeholder="Emergency contact phone"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col sm:flex-row justify-end gap-2">
                        {profile && (
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              // Reset form values
                              if (profile) {
                                setName(profile.name);
                                setAge(profile.age.toString());
                                setGender(profile.gender);
                                setBloodType(profile.bloodType || '');
                                setAllergies(profile.allergies);
                                setChronicConditions(profile.chronicConditions);
                                setMedications(profile.medications);
                                if (profile.emergencyContact) {
                                  setEmergencyContactName(profile.emergencyContact.name);
                                  setEmergencyContactRelationship(profile.emergencyContact.relationship);
                                  setEmergencyContactPhone(profile.emergencyContact.phone);
                                }
                              }
                            }}
                            className="w-full sm:w-auto order-2 sm:order-1"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button 
                          onClick={handleSaveProfile} 
                          className="w-full sm:w-auto order-1 sm:order-2"
                        >
                          Save Profile
                        </Button>
                      </div>
                    </SlideUp>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {profile ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card>
                        <CardHeader className="pb-2 sm:pb-4">
                          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between text-xl sm:text-2xl">
                            <div className="flex items-center mb-2 sm:mb-0">
                              <UserCircle className="mr-2 h-5 w-5 text-health-primary" />
                              Health Profile
                            </div>
                            <div className="text-xs sm:text-sm font-normal text-muted-foreground flex items-center">
                              <CalendarClock className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                              Last updated: {formatDate(profile.lastUpdated)}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
                          {/* Basic Information */}
                          <div className="space-y-3 sm:space-y-4">
                            <h3 className="text-base sm:text-lg font-medium">Basic Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-muted-foreground">Full Name</p>
                                <p className="font-medium">{profile.name}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-muted-foreground">Age</p>
                                <p className="font-medium">{profile.age} years</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-muted-foreground">Gender</p>
                                <p className="font-medium capitalize">{profile.gender}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-muted-foreground">Blood Type</p>
                                <p className="font-medium">{profile.bloodType || 'Not specified'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Medical Information */}
                          <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
                            <h3 className="text-base sm:text-lg font-medium">Medical Information</h3>
                            
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-muted-foreground">Allergies</p>
                                <div className="flex flex-wrap gap-2">
                                  {profile.allergies.length > 0 ? (
                                    profile.allergies.map(allergy => (
                                      <div 
                                        key={allergy} 
                                        className="bg-muted px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                                      >
                                        {allergy}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs sm:text-sm text-muted-foreground italic">No allergies recorded</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-muted-foreground">Chronic Conditions</p>
                                <div className="flex flex-wrap gap-2">
                                  {profile.chronicConditions.length > 0 ? (
                                    profile.chronicConditions.map(condition => (
                                      <div 
                                        key={condition} 
                                        className="bg-muted px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                                      >
                                        {condition}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs sm:text-sm text-muted-foreground italic">No chronic conditions recorded</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-muted-foreground">Current Medications</p>
                                <div className="flex flex-wrap gap-2">
                                  {profile.medications.length > 0 ? (
                                    profile.medications.map(medication => (
                                      <div 
                                        key={medication} 
                                        className="bg-muted px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                                      >
                                        {medication}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-xs sm:text-sm text-muted-foreground italic">No medications recorded</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Emergency Contact */}
                          <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t">
                            <h3 className="text-base sm:text-lg font-medium">Emergency Contact</h3>
                            
                            {profile.emergencyContact ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                <div className="space-y-1">
                                  <p className="text-xs sm:text-sm text-muted-foreground">Contact Name</p>
                                  <p className="font-medium">{profile.emergencyContact.name}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs sm:text-sm text-muted-foreground">Relationship</p>
                                  <p className="font-medium">{profile.emergencyContact.relationship}</p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs sm:text-sm text-muted-foreground">Phone Number</p>
                                  <p className="font-medium">{profile.emergencyContact.phone}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs sm:text-sm text-muted-foreground italic">No emergency contact recorded</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <Card>
                      <CardContent className="pt-6 flex flex-col items-center justify-center py-10 sm:py-12">
                        <UserCircle className="h-12 sm:h-16 w-12 sm:w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg sm:text-xl font-medium mb-2">No Health Profile Found</h3>
                        <p className="text-sm text-muted-foreground mb-6 text-center max-w-md px-2">
                          Create a health profile to keep track of your medical information and help healthcare providers better understand your health needs.
                        </p>
                        <Button 
                          onClick={() => setIsEditing(true)}
                          className="w-full sm:w-auto"
                        >
                          Create Health Profile
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between text-xl sm:text-2xl">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <Activity className="mr-2 h-5 w-5 text-health-primary" />
                      Health History
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/symptom-checker')}
                      className="flex items-center w-full sm:w-auto"
                    >
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      New Assessment
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                  {symptomHistory.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {symptomHistory.map((result, index) => (
                        <motion.div 
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <Card className={cn(
                            "overflow-hidden",
                            result.followUpRequired && "border-amber-400"
                          )}>
                            <div className={cn(
                              "h-1",
                              result.severity === 'severe' ? "bg-red-500" : 
                              result.severity === 'moderate' ? "bg-amber-500" : "bg-green-500"
                            )} />
                            <CardContent className="pt-3 sm:pt-4 px-3 sm:px-6">
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 sm:mb-4">
                                <div className="flex items-center mb-2 sm:mb-0">
                                  <AlertTriangle className={cn(
                                    "h-4 sm:h-5 w-4 sm:w-5 mr-2",
                                    getSeverityColor(result.severity)
                                  )} />
                                  <h3 className="text-sm sm:text-base font-medium">
                                    Symptom Assessment
                                  </h3>
                                </div>
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  {formatDate(result.timestamp)}
                                </div>
                              </div>
                              
                              {/* Severity indicator */}
                              <div className={cn(
                                "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mb-2 sm:mb-3",
                                result.severity === 'severe' ? "bg-red-100 text-red-800" : 
                                result.severity === 'moderate' ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                              )}>
                                {result.severity === 'severe' ? 'Severe' : 
                                 result.severity === 'moderate' ? 'Moderate' : 'Mild'}
                              </div>
                              
                              <div className="space-y-2 sm:space-y-3">
                                <div className="space-y-1">
                                  <p className="text-xs sm:text-sm text-muted-foreground">Recommendation</p>
                                  <p className="text-xs sm:text-sm">{result.recommendation}</p>
                                </div>
                                
                                {result.notes && (
                                  <div className="space-y-1">
                                    <p className="text-xs sm:text-sm text-muted-foreground">Notes</p>
                                    <p className="text-xs sm:text-sm italic">{result.notes}</p>
                                  </div>
                                )}
                                
                                {result.followUpRequired && (
                                  <div className="bg-amber-100 text-amber-800 p-2 sm:p-3 rounded-md text-xs sm:text-sm mt-2">
                                    <span className="font-semibold">Follow-up required:</span> This assessment recommended a follow-up with a healthcare provider.
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 sm:py-12">
                      <Activity className="h-10 sm:h-12 w-10 sm:w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg sm:text-xl font-medium mb-2">No Health Records Found</h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto px-2">
                        Use the Symptom Checker to assess your symptoms and save the results to your health record.
                      </p>
                      <Button 
                        onClick={() => navigate('/symptom-checker')}
                        className="w-full sm:w-auto"
                      >
                        Start Symptom Check
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedPage>
    </Layout>
  );
};

export default PatientProfile;
