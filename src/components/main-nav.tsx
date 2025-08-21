@@ .. @@
 import { useState } from "react";
 import { Link, useLocation, useNavigate } from "react-router-dom";
 import { Button } from "@/components/ui/button";
-import { useAuth } from "../hooks/useAuth";
-import { signOut } from "firebase/auth";
+import { useAuth } from "@/hooks/useAuth";
 import { ThemeToggle } from "@/components/theme-toggle";
 import { Bot, Menu, X } from "lucide-react";

@@ .. @@
 export function MainNav() {
   const location = useLocation();
   const navigate = useNavigate();
-  const { user, auth } = useAuth();
+  const { user } = useAuth();
+  const { logout } = useAuth();
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

+  const handleLogout = async () => {
+    try {
+      await logout();
+      navigate("/");
+    } catch (error) {
+      console.error("Logout failed:", error);
+    }
+  };

   return (
@@ .. @@
         <div className="flex items-center gap-4">
           <div className="hidden md:flex items-center gap-4">
- <ThemeToggle />
+            <ThemeToggle />
             {user ? (
- <Button variant="ghost" onClick={async () => {
- try {
- await signOut(auth);
- navigate("/");
- } catch (error) {
- console.error("Logout failed:", error);
- }
-              }}>
- Logout
- </Button>
+              <Button variant="ghost" onClick={handleLogout}>
+                Logout
+              </Button>
             ) : (
- <Button variant="ghost" asChild>
- <Link to="/login">Sign In</Link>
- </Button>)}
- <Button asChild>
- <Link to="/builder">Get Started</Link>
+              <Button variant="ghost" asChild>
+                <Link to="/login">Sign In</Link>
+              </Button>
+            )}
+            <Button asChild>
+              <Link to="/builder">Get Started</Link>
             </Button>
           </div>
@@ .. @@
- <div className="grid grid-cols-2 gap-2 pt-4">
+            <div className="grid grid-cols-2 gap-2 pt-4">
               {user ? (
- <Button variant="outline" className="w-full" onClick={async () => {
- try {
- await signOut(auth);
- navigate("/");
- setMobileMenuOpen(false);
- } catch (error) {
- console.error("Logout failed:", error);
- }
-                }}>
- Logout
- </Button>
-              ) : (<Button variant="outline" className="w-full" asChild> <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link> </Button>)}
+                <Button variant="outline" className="w-full" onClick={() => {
+                  handleLogout();
+                  setMobileMenuOpen(false);
+                }}>
+                  Logout
+                </Button>
+              ) : (
+                <Button variant="outline" className="w-full" asChild>
+                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
+                </Button>
+              )}
               <Button className="w-full" asChild>
                 <Link to="/builder" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
               </Button>