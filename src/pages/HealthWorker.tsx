
import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { UserPlus, User, Trash2 } from 'lucide-react';
import { useHealthRecords } from '@/utils/healthRecordUtils';
import { usePatients } from '@/utils/patientUtils';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";

const HealthWorker = ()=> {
  // States for managing UI and data
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isEditingPatient, setIsEditingPatient] = useState(false);
  const [isEditingRecord, setIsEditingRecord] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTableView, setIsTableView] = useLocalStorage<boolean>("healthWorkerTableView", false);
  const [isPatientDetailsOpen, setIsPatientDetailsOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState(null);
  const [isRecordDetailsOpen, setIsRecordDetailsOpen] = useState(false);
  const [selectedRecordForDetails, setSelectedRecordForDetails] = useState(null);
  const [dateRange, setDateRange] = useState(undefined);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isRecordFilterVisible, setIsRecordFilterVisible] = useState(false);
  const [recordDateRange, setRecordDateRange] = useState(undefined);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [isRecordDeleteConfirmationOpen, setIsRecordDeleteConfirmationOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isBulkDeleteConfirmationOpen, setIsBulkDeleteConfirmationOpen] = useState(false);
  const [selectedPatientIds, setSelectedPatientIds] = useState<string[]>([]);
  const [isBulkRecordDeleteConfirmationOpen, setIsBulkRecordDeleteConfirmationOpen] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [isAllPatientsSelected, setIsAllPatientsSelected] = useState(false);
  const [isAllRecordsSelected, setIsAllRecordsSelected] = useState(false);
  const [isPatientCommandMenuOpen, setIsPatientCommandMenuOpen] = useState(false);
  const [isRecordCommandMenuOpen, setIsRecordCommandMenuOpen] = useState(false);
  const [isPatientFilterMenuOpen, setIsPatientFilterMenuOpen] = useState(false);
  const [isRecordFilterMenuOpen, setIsRecordFilterMenuOpen] = useState(false);
  const [isPatientColumnMenuOpen, setIsPatientColumnMenuOpen] = useState(false);
  const [isRecordColumnMenuOpen, setIsRecordColumnMenuOpen] = useState(false);
  const [patientColumns, setPatientColumns] = useState({
    firstName: true,
    lastName: true,
    dateOfBirth: true,
    gender: true,
    contactNumber: true,
    email: true,
    address: true,
    medicalHistory: false,
    allergies: false,
    insuranceProvider: false,
    insurancePolicyNumber: false,
  });
  const [recordColumns, setRecordColumns] = useState({
    patientId: true,
    timestamp: true,
    symptoms: true,
    severity: true,
    diagnosis: true,
    treatment: true,
    notes: false,
    followUpRequired: true,
    followUpDate: false,
  });

  // Lots of other state variables removed for brevity

  const { patients, isLoading: isPatientsLoading, error: patientsError, addPatient, editPatient, removePatient } = usePatients();
  const { healthRecords, isLoading: isRecordsLoading, error: recordsError, addHealthRecord, editHealthRecord, removeHealthRecord } = useHealthRecords();

  // Function to handle bulk patient deletion
  const handleBulkDeletePatients = () => {
    if (selectedPatientIds.length > 0) {
      setIsBulkDeleteConfirmationOpen(true);
    } else {
      toast({
        title: "No patients selected",
        description: "Please select patients to delete.",
      });
    }
  };

  return (
    <Layout>
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Health Worker Dashboard</h1>

            <div className="flex gap-2">
              <Button onClick={() => setIsTableView(!isTableView)}>
                {isTableView ? 'Card View' : 'Table View'}
              </Button>

              <DropdownMenu open={isPatientCommandMenuOpen} onOpenChange={setIsPatientCommandMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Patients
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsPatientModalOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Add Patient</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBulkDeletePatients}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Selected</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Main content would go here */}
          <div className="mt-8">
            {isPatientsLoading ? (
              <p>Loading patients...</p>
            ) : patientsError ? (
              <p>Error loading patients: {patientsError.message}</p>
            ) : (
              <p>Patients loaded successfully. Patient count: {patients?.length || 0}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HealthWorker;
