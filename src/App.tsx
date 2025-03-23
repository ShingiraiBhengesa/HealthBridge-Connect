
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/patient-profile" element={<PatientProfile />} />
          <Route path="/health-worker" element={<HealthWorker />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatbotUI />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
