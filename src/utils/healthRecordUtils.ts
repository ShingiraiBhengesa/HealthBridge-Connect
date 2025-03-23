
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Define the HealthRecord type
export interface HealthRecord {
  id: string;
  patientId: string;
  timestamp: Date | string;
  symptoms: string;
  severity: 'mild' | 'moderate' | 'severe';
  diagnosis: string;
  treatment: string;
  notes?: string;
  followUpRequired: boolean;
  followUpDate?: Date | string;
}

// Mock data for health records
const mockHealthRecords: HealthRecord[] = [
  {
    id: uuidv4(),
    patientId: '1',
    timestamp: new Date(),
    symptoms: 'Fever, cough, sore throat',
    severity: 'moderate',
    diagnosis: 'Common cold',
    treatment: 'Rest, fluids, over-the-counter medication',
    followUpRequired: false,
  },
  {
    id: uuidv4(),
    patientId: '2',
    timestamp: new Date(),
    symptoms: 'Headache, dizziness',
    severity: 'mild',
    diagnosis: 'Migraine',
    treatment: 'Pain relievers, rest in dark room',
    followUpRequired: true,
    followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
  },
];

// Custom hook to manage health records
export const useHealthRecords = () => {
  const [healthRecords, setHealthRecords] = useLocalStorage<HealthRecord[]>('healthRecords', mockHealthRecords);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to add a new health record
  const addHealthRecord = async (record: Omit<HealthRecord, 'id'>) => {
    try {
      setIsLoading(true);
      const newRecord = {
        ...record,
        id: uuidv4(),
      };
      setHealthRecords([...healthRecords, newRecord]);
      return newRecord;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add health record');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update an existing health record
  const editHealthRecord = async (id: string, updates: Partial<Omit<HealthRecord, 'id'>>) => {
    try {
      setIsLoading(true);
      const updatedRecords = healthRecords.map((record) =>
        record.id === id ? { ...record, ...updates } : record
      );
      setHealthRecords(updatedRecords);
      return updatedRecords.find((record) => record.id === id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update health record');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a health record
  const removeHealthRecord = async (id: string) => {
    try {
      setIsLoading(true);
      const filteredRecords = healthRecords.filter((record) => record.id !== id);
      setHealthRecords(filteredRecords);
      return id;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete health record');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    healthRecords,
    isLoading,
    error,
    addHealthRecord,
    editHealthRecord,
    removeHealthRecord,
  };
};

// Standalone functions for components that don't need the full hook
export const createHealthRecord = async (record: Omit<HealthRecord, 'id'>) => {
  const newRecord = {
    ...record,
    id: uuidv4(),
  };
  return newRecord;
};

export const updateHealthRecord = async (id: string, record: Partial<Omit<HealthRecord, 'id'>>) => {
  return { id, ...record };
};

export const deleteHealthRecord = async (id: string) => {
  return id;
};
