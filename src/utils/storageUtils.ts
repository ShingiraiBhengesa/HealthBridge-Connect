
// Enum for storage keys to prevent typos and centralize storage key definition
export enum StorageKeys {
  PATIENT_PROFILE = 'healthbridge_patient_profile',
  SYMPTOM_HISTORY = 'healthbridge_symptom_history',
  CONSULTATIONS = 'healthbridge_consultations',
  HEALTH_WORKER_PATIENTS = 'healthbridge_health_worker_patients',
  OFFLINE_QUEUE = 'healthbridge_offline_queue',
  USER_TYPE = 'healthbridge_user_type',
}

// User types
export enum UserType {
  PATIENT = 'patient',
  HEALTH_WORKER = 'health_worker',
  DOCTOR = 'doctor',
}

// Generic get data function with type safety
export function getData<T>(key: StorageKeys): T | null {
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error);
    return null;
  }
}

// Generic set data function
export function setData<T>(key: StorageKeys, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting data for key ${key}:`, error);
  }
}

// Clear specific data
export function clearData(key: StorageKeys): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error clearing data for key ${key}:`, error);
  }
}

// Clear all app data
export function clearAllData(): void {
  try {
    Object.values(StorageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}

// Patient profile type
export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  lastUpdated: number; // timestamp
}

// Symptom check result
export interface SymptomCheckResult {
  id: string;
  timestamp: number;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  recommendation: string;
  followUpRequired: boolean;
  notes?: string;
}

// Save patient profile
export function savePatientProfile(profile: PatientProfile): void {
  setData(StorageKeys.PATIENT_PROFILE, profile);
}

// Get patient profile
export function getPatientProfile(): PatientProfile | null {
  return getData<PatientProfile>(StorageKeys.PATIENT_PROFILE);
}

// Save symptom check result
export function saveSymptomCheckResult(result: SymptomCheckResult): void {
  const history = getData<SymptomCheckResult[]>(StorageKeys.SYMPTOM_HISTORY) || [];
  history.push(result);
  setData(StorageKeys.SYMPTOM_HISTORY, history);
}

// Get symptom history
export function getSymptomHistory(): SymptomCheckResult[] {
  return getData<SymptomCheckResult[]>(StorageKeys.SYMPTOM_HISTORY) || [];
}

// Set user type
export function setUserType(type: UserType): void {
  setData(StorageKeys.USER_TYPE, type);
}

// Get user type
export function getUserType(): UserType | null {
  return getData<UserType>(StorageKeys.USER_TYPE);
}

// Queue operation for when online
export interface OfflineOperation {
  id: string;
  operation: 'sync_patient_data' | 'request_consultation' | 'upload_images';
  data: any;
  timestamp: number;
}

// Add operation to offline queue
export function addToOfflineQueue(operation: Omit<OfflineOperation, 'id' | 'timestamp'>): void {
  const queue = getData<OfflineOperation[]>(StorageKeys.OFFLINE_QUEUE) || [];
  const newOperation: OfflineOperation = {
    ...operation,
    id: generateId(),
    timestamp: Date.now(),
  };
  queue.push(newOperation);
  setData(StorageKeys.OFFLINE_QUEUE, queue);
}

// Process offline queue - could be called when connectivity is detected
export function processOfflineQueue(): OfflineOperation[] {
  const queue = getData<OfflineOperation[]>(StorageKeys.OFFLINE_QUEUE) || [];
  // In a real app, you would process each item and sync with the server
  // For demo purposes, we'll just return the queue and clear it
  clearData(StorageKeys.OFFLINE_QUEUE);
  return queue;
}

// Generate a simple unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
