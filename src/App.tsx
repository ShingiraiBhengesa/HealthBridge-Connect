
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Index from "@/pages/Index";
import SymptomChecker from "@/pages/SymptomChecker";
import PatientProfile from "@/pages/PatientProfile";
import HealthWorker from "@/pages/HealthWorker";
import Telemedicine from "@/pages/Telemedicine";
import NotFound from "@/pages/NotFound";
import { ChatbotUI } from "@/components/chatbot/ChatbotUI";
import { AuthProvider } from "@/hooks/use-auth";
import { AppStateProvider } from "@/hooks/use-app-state";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

// Feature info pages
import SymptomCheckerInfo from "@/pages/features/SymptomCheckerInfo";
import HealthRecordsInfo from "@/pages/features/HealthRecordsInfo";
import TelemedicineInfo from "@/pages/features/TelemedicineInfo";
import HealthWorkerInfo from "@/pages/features/HealthWorkerInfo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppStateProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/patient-profile" element={<PatientProfile />} />
              <Route path="/health-worker" element={<HealthWorker />} />
              <Route path="/telemedicine" element={<Telemedicine />} />
              
              {/* Feature Info Pages */}
              <Route path="/features/symptom-checker" element={<SymptomCheckerInfo />} />
              <Route path="/features/health-records" element={<HealthRecordsInfo />} />
              <Route path="/features/telemedicine" element={<TelemedicineInfo />} />
              <Route path="/features/health-worker" element={<HealthWorkerInfo />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <ChatbotUI />
          </TooltipProvider>
        </AppStateProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
