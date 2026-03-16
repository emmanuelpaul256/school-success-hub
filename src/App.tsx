import { Toaster } from "@/components/ui/toaster";
import { Toaster as HotToaster } from 'react-hot-toast';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/layout";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetails from "./pages/LeadDetails";
import EditLead from "./pages/EditLead";
import Demos from "./pages/Demos";
import DemoDetails from "./pages/DemoDetails";
import Schools from "./pages/Schools";
import SchoolDetails from "./pages/SchoolDetails";
import SchoolUpgrade from "./pages/SchoolUpgrade";
import SchoolSupport from "./pages/SchoolSupport";
import Activity from "./pages/Activity";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <HotToaster />
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/leads/:id" element={<LeadDetails />} />
                <Route path="/leads/:id/edit" element={<EditLead />} />
                <Route path="/demos" element={<Demos />} />
                <Route path="/demos/:id" element={<DemoDetails />} />
                <Route path="/schools" element={<Schools />} />
                <Route path="/schools/:id" element={<SchoolDetails />} />
                <Route path="/schools/:id/upgrade" element={<SchoolUpgrade />} />
                <Route path="/schools/:id/support" element={<SchoolSupport />} />
                <Route path="/activity" element={<Activity />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
