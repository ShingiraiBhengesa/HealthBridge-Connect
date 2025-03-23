
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Define the Patient type
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date | string;
  gender: 'male' | 'female' | 'other';
  contactNumber: string;
  email: string;
  address: string;
  medicalHistory?: string;
  allergies?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

// Mock data for patients
const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date(1985, 5, 15),
    gender: 'male',
    contactNumber: '+1234567890',
    email: 'john.doe@example.com',
    address: '123 Main St, Anytown, USA',
    medicalHistory: 'Hypertension',
    allergies: 'Penicillin',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: new Date(1990, 8, 22),
    gender: 'female',
    contactNumber: '+0987654321',
    email: 'jane.smith@example.com',
    address: '456 Oak Ave, Somecity, USA',
    insuranceProvider: 'Health Shield',
    insurancePolicyNumber: 'HS123456',
  },
];

// Custom hook to manage patients
export const usePatients = () => {
  const [patients, setPatients] = useLocalStorage<Patient[]>('patients', mockPatients);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Function to add a new patient
  const addPatient = async (patient: Omit<Patient, 'id'>) => {
    try {
      setIsLoading(true);
      const newPatient = {
        ...patient,
        id: uuidv4(),
      };
      setPatients([...patients, newPatient]);
      return newPatient;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add patient');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update an existing patient
  const editPatient = async (id: string, updates: Partial<Omit<Patient, 'id'>>) => {
    try {
      setIsLoading(true);
      const updatedPatients = patients.map((patient) =>
        patient.id === id ? { ...patient, ...updates } : patient
      );
      setPatients(updatedPatients);
      return updatedPatients.find((patient) => patient.id === id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update patient');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to delete a patient
  const removePatient = async (id: string) => {
    try {
      setIsLoading(true);
      const filteredPatients = patients.filter((patient) => patient.id !== id);
      setPatients(filteredPatients);
      return id;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete patient');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    patients,
    isLoading,
    error,
    addPatient,
    editPatient,
    removePatient,
  };
};

// Standalone functions for components that don't need the full hook
export const createPatient = async (patient: Omit<Patient, 'id'>) => {
  const newPatient = {
    ...patient,
    id: uuidv4(),
  };
  return newPatient;
};

export const updatePatient = async (id: string, patient: Partial<Omit<Patient, 'id'>>) => {
  return { id, ...patient };
};

export const deletePatient = async (id: string) => {
  return id;
};
