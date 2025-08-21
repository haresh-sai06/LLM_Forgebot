import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Index from "./pages/Index";
import Models from "./pages/Models";
import Builder from "./pages/Builder";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { MainNav } from "./components/main-nav";
import { Footer } from "./components/footer";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const showHeaderFooter = location.pathname !== "/login";

  return (
    <>
      {showHeaderFooter && <MainNav />}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          {/* Keep other routes */}
          <Route path="*" element={<NotFound />} />

          <Route path="/models" element={<Models />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      {showHeaderFooter && <Footer />}
    </>
  );
};

const App = () => {
  // Set dark mode on initial load
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <AppContent />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
