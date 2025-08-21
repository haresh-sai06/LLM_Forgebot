import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, User, Mail, Lock, ArrowRight, Github, Chrome, Twitter, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { twMerge } from 'tailwind-merge'; // Assuming this utility is available

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
export default function AuthPage() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative dark">
      <InteractiveBackground />
      
      <motion.div 
        className="relative z-10 w-full max-w-md"
        style={{ perspective: "1000px" }} // Required for 3D transform
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
                <Button variant="ghost" className="absolute top-4 left-4" size="icon" asChild>
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
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="you@example.com" required className="border-gray-700 bg-gray-900 focus:border-neon-blue" />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="login-password">Password</Label>
                      <Link to="#" className="ml-auto inline-block text-sm underline text-muted-foreground hover:text-primary transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <Input id="login-password" type="password" required className="border-gray-700 bg-gray-900 focus:border-neon-blue" />
                  </div>
                  <Button type="submit" className="w-full group">
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
                <div className="mt-4 text-center text-sm">
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
                <Button variant="ghost" className="absolute top-4 left-4" size="icon" asChild>
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
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input id="signup-username" type="text" placeholder="botforger" required className="border-gray-700 bg-gray-900 focus:border-neon-green" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="you@example.com" required className="border-gray-700 bg-gray-900 focus:border-neon-green" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" required className="border-gray-700 bg-gray-900 focus:border-neon-green" />
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
}
