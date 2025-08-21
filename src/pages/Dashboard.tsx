@@ .. @@
 import { useEffect, useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { ArrowRight, Bot, Plus, FileText, Activity, Users, Settings } from "lucide-react";
 import { Link } from "react-router-dom";
 import { Progress } from "@/components/ui/progress";
-import { useAuth } from "@/hooks/use-auth";
+import { useAuth } from "@/hooks/useAuth";
 import { Separator } from "@/components/ui/separator";
 import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
-import { db } from "../firebase"; // Adjust the path as needed based on your folder structure
+import { db } from "../firebase";

@@ .. @@
 export default function Dashboard() {
   const { user, loading } = useAuth();
-  const [bots, setBots] = useState([]);
+  const [bots, setBots] = useState<any[]>([]);

   useEffect(() => {
     if (user) {
       const q = query(collection(db, "bots"), where("userId", "==", user.uid));
       const unsubscribe = onSnapshot(q, (snapshot) => {
         const botsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
         setBots(botsData);
       });
       return () => unsubscribe();
     }
   }, [user]);

-  const handleDeleteBot = async (botId) => {
+  const handleDeleteBot = async (botId: string) => {
     if (window.confirm("Are you sure you want to delete this bot?")) {
       try {
         await deleteDoc(doc(db, "bots", botId));
       } catch (error) {
         console.error("Error deleting bot: ", error);
       }
     }
   };

@@ .. @@
                     <div>
                       <h3 className="text-lg font-semibold">{bot.name}</h3>
                       <p className="text-sm text-muted-foreground">
-                        Status: <span className="font-medium text-primary">{bot.status || 'Unknown'}</span>
+                        Base Model: <span className="font-medium text-primary">{bot.baseModel || 'Unknown'}</span>
                       </p>
                     </div>
                   </div>
                   <div className="flex items-center space-x-4">
                     <span className="text-sm text-muted-foreground hidden sm:block">
-                      Created At: {new Date(bot.createdAt?.toDate()).toLocaleDateString()}
+                      Created: {bot.createdAt ? new Date(bot.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
                     </span>
                     <Button variant="destructive" size="sm" onClick={() => handleDeleteBot(bot.id)}>Delete</Button>
                     <Button variant="outline" size="sm" asChild>