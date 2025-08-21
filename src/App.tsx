@@ .. @@
 import { Toaster } from "@/components/ui/toaster";
 import { Toaster as Sonner } from "@/components/ui/sonner";
 import { TooltipProvider } from "@/components/ui/tooltip";
 import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
-import { AuthProvider, useAuth } from "./contexts/AuthContext";
+import { AuthProvider } from "./contexts/AuthContext";
+import { useAuth } from "./hooks/useAuth";
 import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

@@ .. @@
 const queryClient = new QueryClient();

 const AppContent = () => {
-  const { isAuthenticated } = useAuth();
+  const { user, loading } = useAuth();
   const location = useLocation();
   const showHeaderFooter = location.pathname !== "/login";

+  if (loading) {
+    return (
+      <div className="flex items-center justify-center min-h-screen">
+        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
+      </div>
+    );
+  }

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
-              isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
+              user ? <Dashboard /> : <Navigate to="/login" replace />
             }
           />
-          {/* Keep other routes */}
-          <Route path="*" element={<NotFound />} />
-
           <Route path="/models" element={<Models />} />
           <Route path="/builder" element={<Builder />} />
           <Route path="/pricing" element={<Pricing />} />
           <Route path="/contact" element={<Contact />} />
           <Route path="/about" element={<About />} />
-          <Route path="/dashboard" element={<Dashboard />} />
-          <Route path="/login" element={<Login />} />
+          <Route path="*" element={<NotFound />} />
         </Routes>
       </main>
       {showHeaderFooter && <Footer />}
@@ .. @@
 const App = () => {
   // Set dark mode on initial load
   useEffect(() => {
     document.documentElement.classList.add("dark");
   }, []);

   return (
     <QueryClientProvider client={queryClient}>
-      <TooltipProvider>
-        <Toaster />
-        <Sonner />
-        <BrowserRouter>
-          <div className="flex flex-col min-h-screen">
-            <AppContent />
-          </div>
-        </BrowserRouter>
-      </TooltipProvider>
+      <AuthProvider>
+        <TooltipProvider>
+          <Toaster />
+          <Sonner />
+          <BrowserRouter>
+            <div className="flex flex-col min-h-screen">
+              <AppContent />
+            </div>
+          </BrowserRouter>
+        </TooltipProvider>
+      </AuthProvider>
     </QueryClientProvider>
   );
 };