@@ .. @@
 import React, { useState } from 'react';
-import { useAuthState } from 'react-firebase-hooks/auth';
-import { auth, db } from '../firebase'; // Assuming you have firebase initialized and exported
+import { useAuth } from '@/hooks/useAuth';
+import { db } from '../firebase';
 import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

@@ .. @@
 const CreateBotModal: React.FC<CreateBotModalProps> = ({ isOpen, onClose, onBotCreated }) => {
-  const [user] = useAuthState(auth);
+  const { user } = useAuth();
   const [botName, setBotName] = useState('');
   const [baseLLMModel, setBaseLLMModel] = useState('llama2');
   const [customInstructions, setCustomInstructions] = useState('');
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!user) {
       setError('You must be logged in to create a bot.');
       return;
     }

     setLoading(true);
     setError(null);

     try {
       await addDoc(collection(db, 'bots'), {
         userId: user.uid,
         name: botName,
         baseModel: baseLLMModel,
         instructions: customInstructions,
         createdAt: serverTimestamp(),
       });
       setBotName('');
       setBaseLLMModel('llama2');
       setCustomInstructions('');
       onBotCreated(); // Notify the dashboard to refresh bots
       onClose(); // Close the modal
     } catch (err) {
       console.error('Error creating bot:', err);
       setError('Failed to create bot. Please try again.');
     } finally {
       setLoading(false);
     }
   };

   if (!isOpen) return null;

   return (
-    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
-      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
-        <h2 className="text-xl font-bold mb-4">Create New Bot</h2>
+    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark">
+      <div className="bg-card p-6 rounded-lg shadow-lg w-full max-w-md border">
+        <h2 className="text-xl font-bold mb-4 text-foreground">Create New Bot</h2>
         {error && <p className="text-red-500 mb-4">{error}</p>}
         <form onSubmit={handleSubmit}>
           <div className="mb-4">
-            <label htmlFor="botName" className="block text-sm font-medium text-gray-700">
+            <label htmlFor="botName" className="block text-sm font-medium text-foreground">
               Bot Name
             </label>
             <input
               type="text"
               id="botName"
-              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
+              className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground"
               value={botName}
               onChange={(e) => setBotName(e.target.value)}
               required
             />
           </div>

           <div className="mb-4">
-            <label htmlFor="baseModel" className="block text-sm font-medium text-gray-700">
+            <label htmlFor="baseModel" className="block text-sm font-medium text-foreground">
               Base LLM Model
             </label>
             <select
               id="baseModel"
-              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
+              className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground"
               value={baseLLMModel}
               onChange={(e) => setBaseLLMModel(e.target.value)}
               required
             >
               <option value="llama2">llama2</option>
               <option value="mistral">mistral</option>
-              {/* Add more options as needed */}
+              <option value="codellama">codellama</option>
+              <option value="vicuna">vicuna</option>
             </select>
           </div>

           <div className="mb-4">
-            <label htmlFor="customInstructions" className="block text-sm font-medium text-gray-700">
+            <label htmlFor="customInstructions" className="block text-sm font-medium text-foreground">
               Custom Instructions
             </label>
             <textarea
               id="customInstructions"
               rows={4}
-              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
+              className="mt-1 block w-full border border-input rounded-md shadow-sm p-2 bg-background text-foreground"
               value={customInstructions}
               onChange={(e) => setCustomInstructions(e.target.value)}
             ></textarea>
           </div>

           <div className="flex justify-end space-x-4">
             <button
               type="button"
               onClick={onClose}
-              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
+              className="px-4 py-2 text-foreground bg-secondary rounded-md hover:bg-secondary/80"
               disabled={loading}
             >
               Cancel
             </button>
             <button
               type="submit"
-              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
+              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
               disabled={loading}
             >
               {loading ? 'Creating...' : 'Create Bot'}
             </button>
           </div>
         </form>
       </div>
     </div>
   );
 };

 export default CreateBotModal;