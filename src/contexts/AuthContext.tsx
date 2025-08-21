@@ .. @@
-import React, { createContext, useContext, useState, ReactNode } from "react";
+import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
+import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
+import { auth } from "../firebase";

 interface AuthContextType {
   isAuthenticated: boolean;
+  user: User | null;
+  loading: boolean;
   login: () => void;
   logout: () => void;
 }

 const AuthContext = createContext<AuthContextType | undefined>(undefined);

 export const AuthProvider = ({ children }: { children: ReactNode }) => {
-  const [isAuthenticated, setIsAuthenticated] = useState(false);
+  const [user, setUser] = useState<User | null>(null);
+  const [loading, setLoading] = useState(true);

-  const login = () => setIsAuthenticated(true);
-  const logout = () => setIsAuthenticated(false);
+  useEffect(() => {
+    const unsubscribe = onAuthStateChanged(auth, (user) => {
+      setUser(user);
+      setLoading(false);
+    });
+
+    return () => unsubscribe();
+  }, []);
+
+  const login = () => {
+    // This will be handled by Firebase auth state changes
+  };
+
+  const logout = async () => {
+    try {
+      await firebaseSignOut(auth);
+    } catch (error) {
+      console.error("Logout error:", error);
+    }
+  };

   return (
-    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
+    <AuthContext.Provider value={{ 
+      isAuthenticated: !!user, 
+      user, 
+      loading, 
+      login, 
+      logout 
+    }}>
       {children}
     </AuthContext.Provider>
   );