
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { StorageKeys, UserType, getData, setData } from "@/utils/storageUtils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
}

interface PatientProfileData {
  age: number;
  gender: string;
  bloodType?: string;
  allergies?: string[];
  chronicConditions?: string[];
  medications?: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface HealthWorkerProfileData {
  department: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  register: (
    name: string, 
    email: string, 
    password: string, 
    userType: UserType,
    profileData?: PatientProfileData | HealthWorkerProfileData
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const location = window.location.pathname;
  console.info("AuthProvider rendering, location:", location);

  useEffect(() => {
    const storedUserType = getData<UserType>(StorageKeys.USER_TYPE);
    console.info("Checking auth status, user type:", storedUserType);
    
    if (storedUserType) {
      let userData = null;
      
      if (storedUserType === UserType.PATIENT) {
        userData = getData(StorageKeys.PATIENT_PROFILE);
      } else if (storedUserType === UserType.HEALTH_WORKER) {
        userData = getData(StorageKeys.HEALTH_WORKER_PROFILE);
      }
      
      if (userData) {
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email || "example@healthbridge.com",
          userType: storedUserType
        });
        console.info("User authenticated:", userData.name, storedUserType);
      }
    }
    
    setIsLoading(false);
  }, []);

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    userType: UserType,
    profileData?: PatientProfileData | HealthWorkerProfileData
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const patientProfiles = getData<any[]>(StorageKeys.PATIENT_PROFILES) || [];
      const healthWorkerProfiles = getData<any[]>(StorageKeys.HEALTH_WORKER_PROFILES) || [];
      
      const isEmailRegistered = [...patientProfiles, ...healthWorkerProfiles].some(
        (profile) => profile?.email === email
      );
      
      if (isEmailRegistered) {
        throw new Error("Email already registered. Please use a different email or login.");
      }
      
      if (userType === UserType.PATIENT) {
        const newPatient = {
          id: `patient-${Date.now()}`,
          name,
          email,
          password,
          age: profileData ? (profileData as PatientProfileData).age : null,
          gender: profileData ? (profileData as PatientProfileData).gender : 'undisclosed',
          bloodType: profileData ? (profileData as PatientProfileData).bloodType || '' : '',
          allergies: profileData && (profileData as PatientProfileData).allergies ? 
            (profileData as PatientProfileData).allergies : [],
          chronicConditions: profileData && (profileData as PatientProfileData).chronicConditions ? 
            (profileData as PatientProfileData).chronicConditions : [],
          medications: profileData && (profileData as PatientProfileData).medications ? 
            (profileData as PatientProfileData).medications : [],
          emergencyContact: profileData && (profileData as PatientProfileData).emergencyContact
            ? (profileData as PatientProfileData).emergencyContact
            : {
                name: '',
                relationship: '',
                phone: ''
              },
          lastUpdated: Date.now()
        };
        
        patientProfiles.push(newPatient);
        setData(StorageKeys.PATIENT_PROFILES, patientProfiles);
        
        setData(StorageKeys.PATIENT_PROFILE, newPatient);
        
        navigate('/patient-profile');
      } else if (userType === UserType.HEALTH_WORKER) {
        const newHealthWorker = {
          id: `worker-${Date.now()}`,
          name,
          email,
          password,
          department: profileData ? (profileData as HealthWorkerProfileData).department : '',
          role: profileData ? (profileData as HealthWorkerProfileData).role : '',
          lastUpdated: Date.now()
        };
        
        healthWorkerProfiles.push(newHealthWorker);
        setData(StorageKeys.HEALTH_WORKER_PROFILES, healthWorkerProfiles);
        
        setData(StorageKeys.HEALTH_WORKER_PROFILE, newHealthWorker);
        
        navigate('/health-worker');
      }
      
      setData(StorageKeys.USER_TYPE, userType);
      
      setUser({
        id: `user-${Date.now()}`,
        name,
        email,
        userType
      });
      
      toast({
        title: "Account created successfully",
        description: `Welcome, ${name}!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to register account";
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, userType: UserType) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const profiles = userType === UserType.PATIENT
        ? getData<any[]>(StorageKeys.PATIENT_PROFILES) || []
        : getData<any[]>(StorageKeys.HEALTH_WORKER_PROFILES) || [];
      
      const userProfile = profiles.find(
        (profile) => profile.email === email && profile.password === password
      );
      
      if (!userProfile) {
        throw new Error("Invalid email or password");
      }
      
      if (userType === UserType.PATIENT) {
        setData(StorageKeys.PATIENT_PROFILE, userProfile);
        navigate('/patient-profile');
      } else {
        setData(StorageKeys.HEALTH_WORKER_PROFILE, userProfile);
        navigate('/health-worker');
      }
      
      setData(StorageKeys.USER_TYPE, userType);
      
      setUser({
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        userType
      });
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userProfile.name}!`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to login";
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setData(StorageKeys.USER_TYPE, null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
