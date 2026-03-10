import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SeoAudit from "./pages/SeoAudit";
import KeywordResearch from "./pages/KeywordResearch";
import RankTracker from "./pages/RankTracker";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import AiAssistant from "./pages/AiAssistant";
import SettingsPage from "./pages/SettingsPage";
import DashboardLayout from "./components/DashboardLayout";
import AuditReport from "./pages/AuditReport";
import MetaTagGenerator from "./pages/MetaTagGenerator";
import BacklinkChecker from "./pages/BacklinkChecker";
import ContentScoreAnalyzer from "./pages/ContentScoreAnalyzer";
import SitemapGenerator from "./pages/SitemapGenerator";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <DashboardLayout>{children}</DashboardLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<DashboardRoute><Dashboard /></DashboardRoute>} />
            <Route path="/dashboard/audit" element={<DashboardRoute><SeoAudit /></DashboardRoute>} />
            <Route path="/dashboard/audit/:id" element={<DashboardRoute><AuditReport /></DashboardRoute>} />
            <Route path="/dashboard/keywords" element={<DashboardRoute><KeywordResearch /></DashboardRoute>} />
            <Route path="/dashboard/rank-tracker" element={<DashboardRoute><RankTracker /></DashboardRoute>} />
            <Route path="/dashboard/competitors" element={<DashboardRoute><CompetitorAnalysis /></DashboardRoute>} />
            <Route path="/dashboard/ai-assistant" element={<DashboardRoute><AiAssistant /></DashboardRoute>} />
            <Route path="/dashboard/meta-tags" element={<DashboardRoute><MetaTagGenerator /></DashboardRoute>} />
            <Route path="/dashboard/backlinks" element={<DashboardRoute><BacklinkChecker /></DashboardRoute>} />
            <Route path="/dashboard/content-score" element={<DashboardRoute><ContentScoreAnalyzer /></DashboardRoute>} />
            <Route path="/dashboard/sitemap" element={<DashboardRoute><SitemapGenerator /></DashboardRoute>} />
            <Route path="/dashboard/settings" element={<DashboardRoute><SettingsPage /></DashboardRoute>} />
            <Route path="/dashboard/pricing" element={<DashboardRoute><PricingPage /></DashboardRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
