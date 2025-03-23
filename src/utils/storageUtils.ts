
import CryptoJS from 'crypto-js';

// Secret key for encryption (in a real app, this would be more securely managed)
const ENCRYPTION_KEY = 'healthbridge-secure-encryption-key';

// Enhanced data storage with encryption
export const setData = (key: string, data: any) => {
  try {
    // Encrypt sensitive data
    const shouldEncrypt = [
      StorageKeys.PATIENT_PROFILE,
      StorageKeys.PATIENT_PROFILES,
      StorageKeys.HEALTH_WORKER_PROFILE,
      StorageKeys.HEALTH_WORKER_PROFILES,
      StorageKeys.HEALTH_RECORDS,
      StorageKeys.CHAT_HISTORY
    ].includes(key as StorageKeys);
    
    let dataToStore = data;
    
    if (shouldEncrypt && data) {
      // Encrypt the data
      const dataStr = JSON.stringify(data);
      const encryptedData = CryptoJS.AES.encrypt(dataStr, ENCRYPTION_KEY).toString();
      dataToStore = encryptedData;
    } else {
      // Non-sensitive data is just stringified
      dataToStore = JSON.stringify(data);
    }
    
    localStorage.setItem(key, dataToStore);
    
    // Also add to sync queue if it's a data item that should be synced
    if (shouldEncrypt && navigator.onLine) {
      addToSyncQueue(key, data);
    }
  } catch (error) {
    console.error(`Error saving data to localStorage for key "${key}":`, error);
  }
};

// Enhanced data retrieval with decryption
export const getData = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    
    if (!item) return null;
    
    // Check if this is encrypted data
    const shouldDecrypt = [
      StorageKeys.PATIENT_PROFILE,
      StorageKeys.PATIENT_PROFILES,
      StorageKeys.HEALTH_WORKER_PROFILE,
      StorageKeys.HEALTH_WORKER_PROFILES,
      StorageKeys.HEALTH_RECORDS,
      StorageKeys.CHAT_HISTORY
    ].includes(key as StorageKeys);
    
    if (shouldDecrypt) {
      try {
        // Try to decrypt
        const bytes = CryptoJS.AES.decrypt(item, ENCRYPTION_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        
        if (decryptedData) {
          return JSON.parse(decryptedData) as T;
        }
      } catch (decryptError) {
        // If decryption fails, it might be unencrypted data from before encryption was added
        try {
          return JSON.parse(item) as T;
        } catch {
          return null;
        }
      }
    }
    
    // Regular JSON parse for non-encrypted data
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error retrieving data from localStorage for key "${key}":`, error);
    return null;
  }
};

export const removeData = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data from localStorage for key "${key}":`, error);
  }
};

export enum StorageKeys {
  USER_TYPE = 'userType',
  PATIENT_PROFILE = 'patientProfile',
  PATIENT_PROFILES = 'patientProfiles',
  HEALTH_WORKER_PROFILE = 'healthWorkerProfile',
  HEALTH_WORKER_PROFILES = 'healthWorkerProfiles',
  HEALTH_RECORDS = 'healthRecords',
  SYMPTOMS = 'symptoms',
  DIAGNOSES = 'diagnoses',
  CHAT_HISTORY = 'chatHistory',
  SYMPTOM_HISTORY = 'symptomHistory',
  OFFLINE_QUEUE = 'offlineQueue',
  SYNC_QUEUE = 'syncQueue',
  APPOINTMENTS = 'appointments',
  MESSAGES = 'messages',
  NETWORK_STATUS = 'networkStatus',
  APP_LANGUAGE = 'appLanguage',
  LAST_SYNC = 'lastSync'
}

export enum UserType {
  PATIENT = 'patient',
  HEALTH_WORKER = 'healthWorker'
}

export interface SymptomCheckResult {
  id: string;
  timestamp: number;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  recommendation: string;
  followUpRequired: boolean;
  notes?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number | null;
  gender: string;
  email?: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  emergencyContact?: EmergencyContact;
  lastUpdated: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  healthWorkerId: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  timestamp: number;
}

// Enhanced sync functionality
interface SyncQueueItem {
  id: string;
  key: string;
  data: any;
  timestamp: number;
  syncStatus: 'pending' | 'syncing' | 'completed' | 'failed';
  retryCount: number;
}

export const addToSyncQueue = (key: string, data: any) => {
  try {
    const queue = getData<SyncQueueItem[]>(StorageKeys.SYNC_QUEUE) || [];
    
    const syncItem: SyncQueueItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      key,
      data,
      timestamp: Date.now(),
      syncStatus: 'pending',
      retryCount: 0
    };
    
    queue.push(syncItem);
    
    // Use regular JSON.stringify for the sync queue itself
    localStorage.setItem(StorageKeys.SYNC_QUEUE, JSON.stringify(queue));
    
    return syncItem;
  } catch (error) {
    console.error('Error adding to sync queue:', error);
    return null;
  }
};

export const processSyncQueue = async () => {
  if (!navigator.onLine) return;
  
  const queue = getData<SyncQueueItem[]>(StorageKeys.SYNC_QUEUE) || [];
  const pendingItems = queue.filter(item => item.syncStatus === 'pending' || 
                                           (item.syncStatus === 'failed' && item.retryCount < 3));
  
  if (pendingItems.length === 0) return;
  
  // In a real app, this would make API calls to sync data
  // For this demo, we'll just mark items as synced after a delay
  
  for (const item of pendingItems) {
    try {
      // Mark as syncing
      item.syncStatus = 'syncing';
      localStorage.setItem(StorageKeys.SYNC_QUEUE, JSON.stringify(queue));
      
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mark as completed
      item.syncStatus = 'completed';
      localStorage.setItem(StorageKeys.SYNC_QUEUE, JSON.stringify(queue));
      
      console.log(`Synced item ${item.id} for key ${item.key}`);
    } catch (error) {
      console.error(`Error syncing item ${item.id}:`, error);
      item.syncStatus = 'failed';
      item.retryCount += 1;
      localStorage.setItem(StorageKeys.SYNC_QUEUE, JSON.stringify(queue));
    }
  }
  
  // Clean up completed items older than 24 hours
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const updatedQueue = queue.filter(item => 
    !(item.syncStatus === 'completed' && item.timestamp < oneDayAgo)
  );
  
  localStorage.setItem(StorageKeys.SYNC_QUEUE, JSON.stringify(updatedQueue));
  localStorage.setItem(StorageKeys.LAST_SYNC, JSON.stringify(Date.now()));
};

// Function to handle offline actions
interface OfflineQueueItem {
  id: string;
  timestamp: number;
  operation: string;
  data: any;
  type: string;
}

export const addToOfflineQueue = (item: { operation: string; data: any; type: string }) => {
  const queueItem: OfflineQueueItem = {
    ...item,
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    timestamp: Date.now()
  };
  
  const queue = getData<OfflineQueueItem[]>(StorageKeys.OFFLINE_QUEUE) || [];
  queue.push(queueItem);
  setData(StorageKeys.OFFLINE_QUEUE, queue);
  
  return queueItem;
};

// The rest of your existing utility functions
export const savePatientProfile = (profile: PatientProfile) => {
  setData(StorageKeys.PATIENT_PROFILE, profile);
  
  const profiles = getData<PatientProfile[]>(StorageKeys.PATIENT_PROFILES) || [];
  const existingIndex = profiles.findIndex(p => p.id === profile.id);
  
  if (existingIndex >= 0) {
    profiles[existingIndex] = profile;
  } else {
    profiles.push(profile);
  }
  
  setData(StorageKeys.PATIENT_PROFILES, profiles);
};

export const getPatientProfile = (): PatientProfile | null => {
  return getData<PatientProfile>(StorageKeys.PATIENT_PROFILE);
};

export const saveSymptomCheckResult = (result: SymptomCheckResult) => {
  const history = getData<SymptomCheckResult[]>(StorageKeys.SYMPTOM_HISTORY) || [];
  history.push(result);
  setData(StorageKeys.SYMPTOM_HISTORY, history);
};

export const getSymptomHistory = (): SymptomCheckResult[] => {
  return getData<SymptomCheckResult[]>(StorageKeys.SYMPTOM_HISTORY) || [];
};

export const saveAppointment = (appointment: Appointment) => {
  const appointments = getData<Appointment[]>(StorageKeys.APPOINTMENTS) || [];
  const existingIndex = appointments.findIndex(a => a.id === appointment.id);
  
  if (existingIndex >= 0) {
    appointments[existingIndex] = appointment;
  } else {
    appointments.push(appointment);
  }
  
  setData(StorageKeys.APPOINTMENTS, appointments);
  return appointment;
};

export const getAppointmentsByHealthWorker = (healthWorkerId: string): Appointment[] => {
  const appointments = getData<Appointment[]>(StorageKeys.APPOINTMENTS) || [];
  return appointments.filter(a => a.healthWorkerId === healthWorkerId);
};

export const getAppointmentsByPatient = (patientId: string): Appointment[] => {
  const appointments = getData<Appointment[]>(StorageKeys.APPOINTMENTS) || [];
  return appointments.filter(a => a.patientId === patientId);
};

export const saveMessage = (message: Message) => {
  const messages = getData<Message[]>(StorageKeys.MESSAGES) || [];
  messages.push(message);
  setData(StorageKeys.MESSAGES, messages);
  return message;
};

export const getMessagesBetweenUsers = (userId1: string, userId2: string): Message[] => {
  const messages = getData<Message[]>(StorageKeys.MESSAGES) || [];
  return messages.filter(m => 
    (m.senderId === userId1 && m.receiverId === userId2) || 
    (m.senderId === userId2 && m.receiverId === userId1)
  ).sort((a, b) => a.timestamp - b.timestamp);
};
