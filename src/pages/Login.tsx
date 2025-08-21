import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bot, User, Mail, Lock, ArrowRight, Github, Chrome, Twitter, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { twMerge } from 'tailwind-merge';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

// A simple component to render the unique background effect
const InteractiveBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden">
    {/* Animated grid effect */}
    <div className="grid-pattern-small absolute inset-0 opacity-[0.02]"></div>
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50"></div>
  </div>
);

// Google Sign In Button Component
const GoogleSignInButton = ({ setMessage }: { setMessage: (msg: { type: 'success' | 'error' | 'info', text: string } | null) => void }) => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setMessage({ type: 'success', text: 'Successfully signed in with Google!' });
      navigate('/dashboard');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <Button variant="outline" className="flex-1 group" onClick={handleGoogleSignIn}>
      <Chrome className="mr-2 h-4 w-4 text-white group-hover:text-primary transition-colors" />
      Google
    </Button>
  );
};

// Login Form Body Component
const LoginFormBody = ({ 
  email, 
  setEmail, 
  password, 
  setPassword, 
  setMessage 
}: {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setMessage: (msg: { type: 'success' | 'error' | 'info', text: string } | null) => void;
}) => {
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage({ type: 'success', text: 'Login successful!' });
      navigate('/dashboard');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="login-email">Email</Label>
        <Input 
          id="login-email" 
          type="email" 
          placeholder="you@example.com" 
          required 
          className="border-gray-700 bg-gray-900 focus:border-neon-blue"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="login-password">Password</Label>
        <Input 
          id="login-password" 
          type="password" 
          required 
          className="border-gray-700 bg-gray-900 focus:border-neon-blue"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full group">
        Sign In
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  );
};

// Signup Form Body Component
const SignupFormBody = ({ 
  username,
  setUsername,
  email, 
  setEmail, 
  password, 
  setPassword, 
  setMessage 
}: {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setMessage: (msg: { type: 'success' | 'error' | 'info', text: string } | null) => void;
}) => {
  const navigate = useNavigate();

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage({ type: 'success', text: 'Account created successfully!' });
      navigate('/dashboard');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="signup-username">Username</Label>
        <Input 
          id="signup-username" 
          type="text" 
          placeholder="botforger" 
          required 
          className="border-gray-700 bg-gray-900 focus:border-neon-green"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input 
          id="signup-email" 
          type="email" 
          placeholder="you@example.com" 
          required 
          className="border-gray-700 bg-gray-900 focus:border-neon-green"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input 
          id="signup-password" 
          type="password" 
          required 
          className="border-gray-700 bg-gray-900 focus:border-neon-green"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full group">
        Create Account
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </form>
  );
};

// The main interactive login/sign-up component
export default function AuthPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setMessage(null);
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
                  <GoogleSignInButton setMessage={setMessage} />
                </div>
                <div className="relative mb-6 z-10">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>
                <LoginFormBody
                  email={loginEmail}
                  setEmail={setLoginEmail}
                  password={loginPassword}
                  setPassword={setLoginPassword}
                  setMessage={setMessage}
                />
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
                  <GoogleSignInButton setMessage={setMessage} />
                </div>
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-700"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                  </div>
                </div>
                <SignupFormBody
                  username={signupUsername}
                  setUsername={setSignupUsername}
                  email={signupEmail}
                  setEmail={setSignupEmail}
                  password={signupPassword}
                  setPassword={setSignupPassword}
                  setMessage={setMessage}
                />
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
}