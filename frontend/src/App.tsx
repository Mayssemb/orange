import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { store } from "@/redux/stores.js";
import { Provider } from "react-redux";
// Login
import LoginPage from "./pages/LoginPage";

// Team Lead Pages
import TeamLeadDashboard from "./pages/team-lead/TeamLeadDashboard";
import TeamLeadProposals from "./pages/team-lead/TeamLeadProposals";
import TeamLeadCandidates from "./pages/team-lead/TeamLeadCandidates";
import TeamLeadNewProposal from "./pages/team-lead/TeamLeadNewProposal";

// HR Pages
import HRDashboardPage from "./pages/hr/HRDashboardPage";
import HRProposalsPage from "./pages/hr/HRProposalsPage";
import HRCandidatesPage from "./pages/hr/HRCandidatesPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>

    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Login */}
          <Route path="/" element={<LoginPage />} />

          {/* Team Lead Routes */}
          <Route path="/team-lead" element={<TeamLeadDashboard />} />
          <Route path="/team-lead/proposals" element={<TeamLeadProposals />} />
          <Route path="/team-lead/candidates" element={<TeamLeadCandidates />} />
          <Route path="/team-lead/new-proposal" element={<TeamLeadNewProposal />} />

          {/* HR Routes */}
          <Route path="/hr" element={<HRDashboardPage />} />
          <Route path="/hr/proposals" element={<HRProposalsPage />} />
          <Route path="/hr/candidates" element={<HRCandidatesPage />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);

export default App;

