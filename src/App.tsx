import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import IndexEN from "./pages/IndexEN";
import Landing from "./pages/Landing";
import LandingEN from "./pages/LandingEN";
import Auth from "./pages/Auth";
import AuthEN from "./pages/AuthEN";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import SettingsEN from "./pages/SettingsEN";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AnimatedRoutes({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(false);
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      {children}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes>
            <Routes>
              <Route path="/" element={<LandingEN />} />
              <Route path="/pl" element={<Landing />} />
              <Route path="/en" element={<IndexEN />} />
              <Route path="/app" element={<IndexEN />} />
              <Route path="/app/pl" element={<Index />} />
              <Route path="/auth" element={<AuthEN />} />
              <Route path="/auth/pl" element={<Auth />} />
              <Route path="/auth/reset-password" element={<AuthEN />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<SettingsEN />} />
              <Route path="/settings/pl" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatedRoutes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
