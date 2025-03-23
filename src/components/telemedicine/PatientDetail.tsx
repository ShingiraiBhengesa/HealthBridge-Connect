
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Consultation } from '@/types/telemedicine';
import { 
  X, 
  FilePlus, 
  History, 
  Activity, 
  Heart
} from 'lucide-react';

interface PatientDetailProps {
  patient: { 
    name: string; 
    id: string; 
    consultation?: Consultation 
  };
  onClose: () => void;
}

export const PatientDetail = ({ patient, onClose }: PatientDetailProps) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <h3 className="text-lg font-medium">Patient Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex flex-col items-center mb-4">
        <Avatar className="h-24 w-24 border-2 border-health-primary/20">
          <AvatarFallback className="text-xl bg-health-primary/10 text-health-primary">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-2 text-xl font-semibold">{patient.name}</h2>
        <p className="text-muted-foreground">Patient ID: {patient.id}</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <div className="p-2 bg-muted rounded-md">42</div>
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <div className="p-2 bg-muted rounded-md">Male</div>
            </div>
            <div className="space-y-2">
              <Label>Blood Type</Label>
              <div className="p-2 bg-muted rounded-md">A+</div>
            </div>
            <div className="space-y-2">
              <Label>Allergies</Label>
              <div className="p-2 bg-muted rounded-md">Penicillin</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Current Medications</Label>
            <div className="p-2 bg-muted rounded-md">
              <ul className="list-disc list-inside space-y-1">
                <li>Lisinopril 10mg (once daily)</li>
                <li>Metformin 500mg (twice daily)</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="vitals" className="space-y-4 pt-4">
          {patient.consultation?.vitalSigns ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Temperature</Label>
                <div className="p-2 bg-muted rounded-md flex justify-between">
                  <span>{patient.consultation.vitalSigns.temperature}</span>
                  <Activity className="h-4 w-4 text-health-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Heart Rate</Label>
                <div className="p-2 bg-muted rounded-md flex justify-between">
                  <span>{patient.consultation.vitalSigns.heartRate}</span>
                  <Heart className="h-4 w-4 text-health-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Blood Pressure</Label>
                <div className="p-2 bg-muted rounded-md">{patient.consultation.vitalSigns.bloodPressure}</div>
              </div>
              <div className="space-y-2">
                <Label>Oxygen Saturation</Label>
                <div className="p-2 bg-muted rounded-md">{patient.consultation.vitalSigns.oxygenSaturation}</div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Respiratory Rate</Label>
                <div className="p-2 bg-muted rounded-md">{patient.consultation.vitalSigns.respiratoryRate}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
              <p>No vital signs recorded</p>
              <Button variant="outline" size="sm" className="mt-2">
                Record Vitals
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex justify-between mb-1">
                <h4 className="font-medium">General Checkup</h4>
                <span className="text-xs text-muted-foreground">May 15, 2023</span>
              </div>
              <p className="text-sm text-muted-foreground">Routine annual physical examination. BP: 120/80, HR: 68</p>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex justify-between mb-1">
                <h4 className="font-medium">Hypertension Follow-up</h4>
                <span className="text-xs text-muted-foreground">Jan 22, 2023</span>
              </div>
              <p className="text-sm text-muted-foreground">Blood pressure controlled. Continued current medication.</p>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex justify-between mb-1">
                <h4 className="font-medium">Diabetes Management</h4>
                <span className="text-xs text-muted-foreground">Nov 10, 2022</span>
              </div>
              <p className="text-sm text-muted-foreground">HbA1c: 7.2%. Adjusted Metformin dosage.</p>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="w-full">
            View Full Medical History
          </Button>
        </TabsContent>
      </Tabs>
      
      <div className="pt-4 border-t flex flex-col gap-2">
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Create Prescription
        </Button>
        
        <Button variant="outline">
          <History className="mr-2 h-4 w-4" />
          Schedule Follow-up
        </Button>
      </div>
    </div>
  );
};
