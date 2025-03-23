
import { UserType } from '@/utils/storageUtils';

export interface Consultation {
  id: string;
  type: 'message' | 'video' | 'voice';
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'active';
  timestamp: number;
  doctorName: string;
  doctorId?: string;
  patientName?: string;
  patientId?: string;
  specialty: string;
  notes?: string;
  messages?: Message[];
  duration?: number;
  vitalSigns?: VitalSigns;
  prescription?: Prescription[];
}

export interface Message {
  id: string;
  content: string;
  sender: 'patient' | 'doctor';
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnail?: string;
  size?: number;
}

export interface VitalSigns {
  temperature?: string;
  heartRate?: string;
  bloodPressure?: string;
  oxygenSaturation?: string;
  respiratoryRate?: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating?: number;
  reviewCount?: number;
  about?: string;
  tags?: string[];
  availability?: string[];
  image?: string;
}

export interface ConsultationTypeInfo {
  id: 'message' | 'video' | 'voice';
  name: string;
  icon: any;
  description: string;
}

export interface SpecialtyInfo {
  id: string;
  name: string;
}
