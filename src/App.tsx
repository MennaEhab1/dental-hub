import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import ServicesPage from "./pages/ServicesPage";
import DoctorsPage from "./pages/DoctorsPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import BookingPage from "./pages/booking/BookingPage";
import BookingConfirmation from "./pages/booking/BookingConfirmation";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/confirmation" element={<BookingConfirmation />} />
              
              {/* Patient Routes */}
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/appointments" element={<PatientDashboard />} />
              <Route path="/patient/profile" element={<PatientDashboard />} />
              <Route path="/patient/messages" element={<PatientDashboard />} />
              <Route path="/patient/settings" element={<PatientDashboard />} />
              
              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<DoctorDashboard />} />
              <Route path="/doctor/messages" element={<DoctorDashboard />} />
              <Route path="/doctor/settings" element={<DoctorDashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/patients" element={<AdminDashboard />} />
              <Route path="/admin/doctors" element={<AdminDashboard />} />
              <Route path="/admin/appointments" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminDashboard />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
