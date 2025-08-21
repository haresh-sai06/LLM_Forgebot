import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { twMerge } from 'tailwind-merge';

import { auth, db } from '../lib/firebase'; // Import auth and db from your firebase config
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

const AuthPage: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth(); // Use the useAuth hook

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleFlip = () => {
    setMessage(null); // Clear any messages on flip
    setIsFlipped(!isFlipped);
  };

  // Handlers for authentication
  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setMessage({ type: 'info', text: 'Signing in...' });
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setMessage({ type: 'success', text: 'Signed in successfully!' });
      // Redirection handled by useAuth effect
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to sign in. Please check your email and password.' });
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
      // Redirection handled by useAuth effect
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to create account. Please try again.' });
      console.error("Sign-up error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage({ type: 'info', text: 'Signing in with Google...' });
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setMessage({ type: 'success', text: 'Signed in with Google successfully!' });
      // Redirection handled by useAuth effect
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to sign in with Google.' });
      console.error("Google Sign-in error:", error);
    }
  };

  const handleGitHubSignIn = async () => {
    setMessage({ type: 'info', text: 'Signing in with GitHub...' });
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setMessage({ type: 'success', text: 'Signed in with GitHub successfully!' });
      // Redirection handled by useAuth effect
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to sign in with GitHub.' });
      console.error("GitHub Sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
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
        className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Front of the card: Login Form */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <div className={twMerge("bg-gray-800 rounded-xl p-10 text-gray-100 shadow-lg", isFlipped && "opacity-0 pointer-events-none")}>
              <button className="absolute top-4 left-4 z-20 text-gray-400 hover:text-gray-100">
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </button>
              <p className="text-center text-3xl font-bold mb-8">Login</p>
              <div className="flex justify-center space-x-4 mb-6">
                <button onClick={handleGoogleSignIn} className="p-4 rounded-md bg-transparent hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                    <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
                  </svg>
                </button>
                <button onClick={handleGitHubSignIn} className="p-4 rounded-md bg-transparent hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                    <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center pt-6 mb-6">
                <div className="flex-1 h-px bg-gray-600"></div>
                <p className="px-4 text-base text-gray-400">Or with email</p>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>
              <form className="space-y-6" onSubmit={handleSignIn}>
                <div>
                  <label htmlFor="login-email" className="block text-base text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="login-email"
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-5 py-4 text-gray-100 focus:border-purple-400 outline-none text-base"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-base text-gray-400 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="login-password"
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-5 py-4 text-gray-100 focus:border-purple-400 outline-none text-base"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <div className="flex justify-end text-sm text-gray-400 mt-3">
                    <a href="#" className="text-gray-100 hover:underline hover:text-purple-400">Forgot Password?</a>
                  </div>
                </div>
                <button className="w-full bg-purple-400 text-gray-900 py-4 rounded-lg font-semibold text-base hover:bg-purple-500 transition-colors group">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{' '}
                <span onClick={handleFlip} className="text-gray-100 hover:underline hover:text-purple-400 cursor-pointer">Sign up</span>
              </p>
            </div>
          </div>

          {/* Back of the card: Sign Up Form */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className={twMerge("bg-gray-800 rounded-xl p-10 text-gray-100 shadow-lg", !isFlipped && "opacity-0 pointer-events-none")}>
              <button className="absolute top-4 left-4 z-20 text-gray-400 hover:text-gray-100">
                <Link to="/">
                  <Home className="h-5 w-5" />
                </Link>
              </button>
              <p className="text-center text-3xl font-bold mb-8">Sign Up</p>
              <div className="flex justify-center space-x-4 mb-6">
                <button onClick={handleGoogleSignIn} className="p-4 rounded-md bg-transparent hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                    <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z" />
                  </svg>
                </button>
                <button onClick={handleGitHubSignIn} className="p-4 rounded-md bg-transparent hover:bg-gray-700 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6 fill-current">
                    <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center pt-6 mb-6">
                <div className="flex-1 h-px bg-gray-600"></div>
                <p className="px-4 text-base text-gray-400">Or with email</p>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>
              <form className="space-y-6" onSubmit={handleSignUp}>
                <div>
                  <label htmlFor="signup-username" className="block text-base text-gray-400 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    id="signup-username"
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-5 py-4 text-gray-100 focus:border-purple-400 outline-none text-base"
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-base text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="signup-email"
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-5 py-4 text-gray-100 focus:border-purple-400 outline-none text-base"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-base text-gray-400 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="signup-password"
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-5 py-4 text-gray-100 focus:border-purple-400 outline-none text-base"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <button className="w-full bg-purple-400 text-gray-900 py-4 rounded-lg font-semibold text-base hover:bg-purple-500 transition-colors group">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{' '}
                <span onClick={handleFlip} className="text-gray-100 hover:underline hover:text-purple-400 cursor-pointer">Log in</span>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthPage;