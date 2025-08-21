@@ .. @@
 import React, { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { createUserWithEmailAndPassword } from 'firebase/auth';
-import { auth } from '../lib/firebase'; // Assuming you have firebase config in lib/firebase.ts
+import { auth } from '../firebase';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
-import { useToast } from '@/components/ui/use-toast';
+import { toast } from '@/components/ui/sonner';

 const Signup: React.FC = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
-  const { toast } = useToast();

   const handleSignup = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
     try {
       await createUserWithEmailAndPassword(auth, email, password);
-      toast({
-        title: 'Signup Successful',
-        description: 'Welcome! Redirecting to dashboard...',
-      });
+      toast.success('Signup Successful! Welcome! Redirecting to dashboard...');
       navigate('/dashboard');
     } catch (error: any) {
-      toast({
-        title: 'Signup Failed',
-        description: error.message,
-        variant: 'destructive',
-      });
+      toast.error(`Signup Failed: ${error.message}`);
     } finally {
       setLoading(false);
     }
   };

   return (
-    <div className="flex items-center justify-center min-h-screen">
+    <div className="flex items-center justify-center min-h-screen dark">
       <Card className="w-[350px]">
         <CardHeader>
           <CardTitle>Sign Up</CardTitle>