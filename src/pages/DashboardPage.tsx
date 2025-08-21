import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; // Assuming this is the correct path to your AuthContext
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { auth, db } from '../lib/firebase'; // Import from your new firebase config file


// A simple component to render the unique background effect
const InteractiveBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {/* Animated grid effect */}
    <div className="grid-pattern-small absolute inset-0 opacity-[0.02]"></div>
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50"></div>
  </div>
);


const DashboardPage = () => {
  const navigate = useNavigate();
  const authContext = useAuth(); // Use the useAuth hook for user state
  const user = null; // Adjust according to actual property name
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // The useAuth hook should handle the initial loading and redirection.
    // We only need to fetch additional user data here if the user is authenticated.
    if (user) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log("No such document for user!");
            setUserData(null); // Clear user data if document not found
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null); // Clear user data on error
        }
      };
      fetchUserData();
    }
    // No need to navigate here based on user, useAuth context handles that.
  }, [user]); // Depend on user from context

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // The useAuth hook's state listener should handle the navigation away from the dashboard
      // when the user is signed out.
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Remove loading state check since 'loading' is not provided by AuthContextType

  // If user is null after loading, useAuth should have already redirected.
  // This is a fallback in case redirection takes a moment or if accessed directly without auth.
  if (!user) {
      return null; // Render nothing while redirecting
  }


  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative dark">
      <InteractiveBackground />
      <Card className="glass-card z-10 max-w-lg w-full neon-border-purple">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight gradient-heading">
            Welcome to your Dashboard
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            You are signed in as {userData?.username || user.email}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-primary" />
            <p className="text-lg">This is where your content and bots will live.</p>
          </div>
          <Button onClick={handleSignOut} className="w-full">
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;