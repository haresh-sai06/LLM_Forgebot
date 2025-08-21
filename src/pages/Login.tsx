import { useState, FormEvent, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ArrowRight, Github, Chrome, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import { twMerge } from 'tailwind-merge';

// Dummy imports that simulate your actual lib/firebase.ts file
// In your actual project, this code would be in lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3cIUul4sk7uN0xvjMCZ_l4_jVLodEZHQ",
  authDomain: "llmforgebot.firebaseapp.com",
  projectId: "llmforgebot",
  storageBucket: "llmforgebot.firebasestorage.app",
  messagingSenderId: "286106831325",
  appId: "1:286106831325:web:d48b00e3c9a9f132bcce34",
  measurementId: "G-R0RSKFL368"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// A simple component to render the unique background effect
const InteractiveBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {/* Animated grid effect */}
    <div className="grid-pattern-small absolute inset-0 opacity-[0.02]"></div>
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50"></div>
  </div>
);

// The main interactive login/sign-up component
const AuthPage = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const navigate = useNavigate();

  const handleFlip = () => {
    setMessage(null);
    setIsFlipped(!isFlipped);
  };
  
  // Handlers for authentication
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: 'info', text: 'Signing in...' });
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setMessage({ type: 'success', text: 'Signed in successfully!' });
      // navigate("/dashboard"); This will be handled by the auth state listener
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to sign in. Please check your email and password.' });
      console.error("Sign-in error:", error);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: 'info', text: 'Creating account...' });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      const user = userCredential.user;
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: signupUsername,
        email: signupEmail,
        createdAt: new Date()
      });

      setMessage({ type: 'success', text: 'Account created successfully!' });
      // navigate("/dashboard"); This will be handled by the auth state listener
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create account. Please try again.' });
      console.error("Sign-up error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative dark">
      <InteractiveBackground />

      {/* Message Area */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={twMerge(
              "absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md text-sm",
              message.type === 'success' && 'bg-green-600 text-white',
              message.type === 'error' && 'bg-red-600 text-white',
              message.type === 'info' && 'bg-blue-600 text-white'
            )}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="relative z-10 w-full max-w-md"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Front of the card: Login Form */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <Card className={twMerge("glass-card neon-border-blue", isFlipped && "opacity-0 pointer-events-none")}>
              <CardHeader className="text-center">
                <Button variant="ghost" className="absolute top-4 left-4 z-20" size="icon" asChild>
                  <Link to="/">
                    <Home className="h-5 w-5" />
                  </Link>
                </Button>
                <CardTitle className="text-3xl font-extrabold tracking-tight gradient-heading">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Log in to build and manage your custom chatbots.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6 z-10">
                  <Button variant="outline" className="flex-1 group">
                    <Github className="mr-2 h-4 w-4 text-white group-hover:text-primary transition-colors" />
                    GitHub
                  </Button>
                  <Button variant="outline" className="flex-1 group">
                    <Chrome className="mr-2 h-4 w-4 text-white group-hover:text-primary transition-colors" />
                    Google
                  </Button>
                </div>
                <div className="relative mb-6 z-10">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>
                <form className="space-y-4" onSubmit={handleSignIn}>
                  <div className="grid gap-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="you@example.com" required className="border-gray-700 bg-gray-900 focus:border-neon-blue" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="login-password">Password</Label>
                      <Link to="#" className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-primary transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="login-password" type="password" required className="border-gray-700 bg-gray-900 focus:border-neon-blue" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full group">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm z-10">
                  Don't have an account?{" "}
                  <Button variant="link" onClick={handleFlip} className="p-0 h-auto underline-offset-4 text-primary">
                    Sign up
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Back of the card: Sign Up Form */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Card className={twMerge("glass-card neon-border-green", !isFlipped && "opacity-0 pointer-events-none")}>
              <CardHeader className="text-center">
                <Button variant="ghost" className="absolute top-4 left-4 z-20" size="icon" asChild>
                  <Link to="/">
                    <Home className="h-5 w-5" />
                  </Link>
                </Button>
                <CardTitle className="text-3xl font-extrabold tracking-tight gradient-heading">
                  Join BotForge
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Create an account to get started for free.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Button variant="outline" className="flex-1 group">
                    <Github className="mr-2 h-4 w-4 text-white group-hover:text-primary transition-colors" />
                    GitHub
                  </Button>
                  <Button variant="outline" className="flex-1 group">
                    <Chrome className="mr-2 h-4 w-4 text-white group-hover:text-primary transition-colors" />
                    Google
                  </Button>
                </div>
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>
                <form className="space-y-4" onSubmit={handleSignUp}>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input id="signup-username" type="text" placeholder="botforger" required className="border-gray-700 bg-gray-900 focus:border-neon-green" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="you@example.com" required className="border-gray-700 bg-gray-900 focus:border-neon-green" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" required className="border-gray-700 bg-gray-900 focus:border-neon-green" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full group">
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Button variant="link" onClick={handleFlip} className="p-0 h-auto underline-offset-4 text-primary">
                    Log in
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Dashboard component that users are redirected to
const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
      } else {
        // No user is signed in, redirect to login page
        navigate("/auth");
      }
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center dark">
        <p className="text-xl">Redirecting to login...</p>
      </div>
    );
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

// Main App component to handle routing
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
