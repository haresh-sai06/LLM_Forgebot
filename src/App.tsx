import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Models from "./pages/Models";
import Builder from "./pages/Builder";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
import About from "./pages/About";
import Signup from "./pages/Signup";
import AuthPage from "./pages/AuthPage"; 
import ChatWindow from "./pages/ChatWindow";
import TrainedChatWindow from "./pages/TrainedChatWindow";
import ImageGeneration from "./pages/ImageGeneration";
import AudioGeneration from "./pages/AudioGeneration";
import DataScienceTools from "./pages/DataScienceTools";
import ThreeDARTools from "./pages/ThreeDARTools";

import { MainNav } from "./components/main-nav";
import { Footer } from "./components/footer";
import { useEffect } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  // Ensure header and footer are only hidden on the login page
  const showHeaderFooter = location.pathname !== "/login";

  return (
    <>
      {showHeaderFooter && <MainNav />}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/models" element={<Models />} />
          <Route path="/chat" element={<ChatWindow />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/trained-chat" element={<TrainedChatWindow />} />
          <Route path="/data-science" element={<DataScienceTools />} />
          <Route path="/3d-ar" element={<ThreeDARTools />} />
          <Route path="/audio-gen" element={<AudioGeneration />} />
          <Route path="/image-gen" element={<ImageGeneration />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
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
        <AuthProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <AppContent />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
