import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle,
  FileUp,
  HelpCircle,
  MessageSquare,
  RotateCcw,
  Save,
  Sliders,
  Sparkles
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Builder() {
  const [activeStep, setActiveStep] = useState(1);
  const [formality, setFormality] = useState([50]);
  const [creativity, setCreativity] = useState([70]);
  const [conciseness, setConciseness] = useState([30]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [models, setModels] = useState([
    {
      id: 'litebot-3b',
      name: "LiteBot 3B",
      description: "Fast, lightweight model for simple applications.",
      specs: "3B parameters • 4GB RAM • Fast training",
      badge: "Basic"
    },
    {
      id: 'midrange-7b',
      name: "MidRange 7B",
      description: "Balanced performance and capability.",
      specs: "7B parameters • 8GB RAM • Medium training",
      badge: "Pro",
      recommended: true
    },
    {
      id: 'powerbot-13b',
      name: "PowerBot 13B",
      description: "Advanced reasoning and understanding.",
      specs: "13B parameters • 16GB RAM • Longer training",
      badge: "Advanced"
    },
    {
      id: 'ultra-30b',
      name: "Ultra 30B",
      description: "State-of-the-art performance for complex tasks.",
      specs: "30B parameters • 32GB RAM • Extended training",
      badge: "Advanced"
    }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    // Placeholder for fetching models from backend (Ollama integration)
    // async function fetchModels() {
    //   try {
    //     const response = await fetch('/api/ollama/models');
    //     const data = await response.json();
    //     setModels(data.models); // Assume data has models array
    //     // Set default to llama3 if available
    //     const llama3 = data.models.find(m => m.name.toLowerCase().includes('llama3'));
    //     if (llama3) setSelectedModel(llama3.id);
    //   } catch (error) {
    //     console.error('Failed to fetch models:', error);
    //   }
    // }
    // fetchModels();
  }, []);

  const steps = [
    { number: 1, title: "Choose Model" },
    { number: 2, title: "Upload Data" },
    { number: 3, title: "Customize" },
    { number: 4, title: "Train" },
    { number: 5, title: "Export" }
  ];

  const nextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col dark">
      {/* Header */}
      <section className="bg-card py-8">
        <div className="container-content">
          <h1 className="text-3xl font-bold mb-2">Bot Builder</h1>
          <p className="text-muted-foreground">
            Create your custom chatbot in a few simple steps
          </p>
        </div>
      </section>
      
      {/* Stepper */}
      <section className="border-y bg-background/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="container-content py-4">
          <div className="flex items-center justify-between w-full">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full mb-1
                  ${activeStep === step.number 
                    ? 'bg-primary text-primary-foreground' 
                    : activeStep > step.number 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary text-muted-foreground'}`}
                >
                  {step.number}
                </div>
                <span className={`text-xs hidden sm:block ${
                  activeStep === step.number 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="container-content">
          {/* Step 1: Choose Model */}
          {activeStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Select a Base Model</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {models.map((model) => (
                    <Card 
                      key={model.id} 
                      className={`cursor-pointer transition-colors ${selectedModel === model.id ? 'border-primary bg-primary/5' : 'hover:border-primary'}`}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{model.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{model.description}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs bg-secondary/50 px-2 py-0.5 rounded-full">
                              {model.badge}
                            </span>
                            {model.recommended && (
                              <span className="text-xs text-primary mt-1">Recommended</span>
                            )}
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">{model.specs}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Choose Bot Type</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        name: "General Assistant",
                        description: "All-purpose chatbot for diverse questions and tasks.",
                        icon: Bot
                      },
                      {
                        name: "Customer Support",
                        description: "Handles product inquiries, troubleshooting, and FAQs.",
                        icon: MessageSquare
                      },
                      {
                        name: "Custom Specialist",
                        description: "Specialized in a specific domain or knowledge area.",
                        icon: Sparkles,
                        selected: true
                      }
                    ].map((type, index) => (
                      <Card key={index} className={`cursor-pointer hover:border-primary transition-colors ${type.selected ? 'border-primary' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{type.name}</h3>
                            <type.icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {type.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Hardware Requirements</h2>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Required Memory</span>
                        <span className="font-medium">8GB RAM</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-[40%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Required CPU</span>
                        <span className="font-medium">4 Cores</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-[30%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Est. Training Time</span>
                        <span className="font-medium">1.5 Hours</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-[25%]"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-4">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>GPU will significantly speed up training</span>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Need Help?</h3>
                  <div className="bg-card p-4 rounded-lg border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span>How to choose the right model</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <span>System requirements guide</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Upload Data */}
          {activeStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Upload Training Data</h2>
                
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <FileUp className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Support for PDF, TXT, CSV, JSON, DOCX files
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.txt,.csv,.json,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Button>Browse Files</Button>
                      </label>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
                        <ul className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-sm border p-2 rounded">
                              <span>{file.name}</span>
                              <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>Remove</Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="sources">
                  <TabsList className="mb-4">
                    <TabsTrigger value="sources">Data Sources</TabsTrigger>
                    <TabsTrigger value="formats">Supported Formats</TabsTrigger>
                    <TabsTrigger value="preprocess">Preprocessing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="sources">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Recommended Data Sources</h3>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Product documentation and manuals</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>FAQ documents and support tickets</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Chat logs and conversation history</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span>Knowledge base articles</span>
                        </li>
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="formats">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {["PDF", "TXT", "CSV", "JSON", "DOCX", "XLSX"].map((format) => (
                        <div key={format} className="bg-card p-3 rounded-lg border text-center">
                          <span className="text-sm font-medium">.{format.toLowerCase()}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preprocess">
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Your uploaded data will be automatically processed to extract relevant information.
                        Advanced preprocessing options will be available in the next step.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Data Guidelines</h2>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">For Best Results</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 mt-1 flex-shrink-0">•</div>
                          <span className="text-muted-foreground">
                            Include diverse examples of questions and answers
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 mt-1 flex-shrink-0">•</div>
                          <span className="text-muted-foreground">
                            Provide context-rich documents for domain knowledge
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-4 w-4 mt-1 flex-shrink-0">•</div>
                          <span className="text-muted-foreground">
                            Clean data performs better than noisy data
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">Data Privacy Note</h3>
                      <p className="text-xs text-muted-foreground">
                        All processing happens locally on your device. Your data is never sent to external servers.
                        BotForge cannot access your uploaded files.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Data Upload Limit</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Used Space</span>
                        <span className="font-medium">240MB / 1GB</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full w-[24%]"></div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Free tier limit: 1GB. Upgrade for more storage.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Customize Personality */}
          {activeStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Customize Bot Personality</h2>
                
                <Card className="mb-6">
                  <CardContent className="pt-6 px-6">
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <div>
                            <label className="text-sm font-medium">Formality</label>
                            <p className="text-xs text-muted-foreground">How formal or casual your bot should sound</p>
                          </div>
                          <span className="text-sm">{formality[0]}%</span>
                        </div>
                        <Slider
                          value={formality}
                          onValueChange={setFormality}
                          max={100}
                          step={1}
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Casual</span>
                          <span>Formal</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <div>
                            <label className="text-sm font-medium">Creativity</label>
                            <p className="text-xs text-muted-foreground">Balance between creative and factual responses</p>
                          </div>
                          <span className="text-sm">{creativity[0]}%</span>
                        </div>
                        <Slider
                          value={creativity}
                          onValueChange={setCreativity}
                          max={100}
                          step={1}
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Factual</span>
                          <span>Creative</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <div>
                            <label className="text-sm font-medium">Conciseness</label>
                            <p className="text-xs text-muted-foreground">How brief or detailed the responses should be</p>
                          </div>
                          <span className="text-sm">{conciseness[0]}%</span>
                        </div>
                        <Slider
                          value={conciseness}
                          onValueChange={setConciseness}
                          max={100}
                          step={1}
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Concise</span>
                          <span>Detailed</span>
                        </div>
                      </div>
                      
                      <div className="pt-2 pb-6">
                        <label className="text-sm font-medium block mb-2">Bot Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded-md border bg-background/50"
                          placeholder="Enter a name for your bot"
                          defaultValue="CustomSpecialist"
                        />
                      </div>
                      
                      <div className="pt-2 pb-6">
                        <label className="text-sm font-medium block mb-2">System Prompt</label>
                        <textarea
                          className="w-full px-3 py-2 rounded-md border bg-background/50 h-32 resize-none"
                          placeholder="You are a helpful assistant specialized in..."
                          defaultValue="You are a helpful assistant specialized in providing technical support for software products. You are knowledgeable, precise, and aim to solve user problems efficiently while maintaining a friendly tone."
                        ></textarea>
                        <p className="text-xs text-muted-foreground mt-2">
                          This defines your bot's role and behavior instructions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex items-center gap-2 text-sm">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset to Default
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Save className="h-3.5 w-3.5" />
                    Save as Template
                  </Button>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold mb-4">Preview Response Style</h2>
                
                <Card className="mb-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Chat Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-secondary/40 rounded-lg p-3">
                      <p className="text-sm">
                        How do I reset my password for the admin portal?
                      </p>
                    </div>
                    
                    <div className="bg-primary/10 rounded-lg p-3 border-l-2 border-primary">
                      <p className="text-sm">
                        To reset your password for the admin portal, please follow these steps:
                      </p>
                      <ol className="text-sm pl-5 mt-2 list-decimal">
                        <li>Go to the login page</li>
                        <li>Click on "Forgot Password"</li>
                        <li>Enter your email address</li>
                        <li>Check your inbox for reset instructions</li>
                      </ol>
                      <p className="text-sm mt-2">
                        If you don't receive an email within 5 minutes, please check your spam folder or contact support.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Advanced Settings</h3>
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Temperature</label>
                          <p className="text-xs text-muted-foreground">Response randomness</p>
                        </div>
                        <input
                          type="number"
                          className="w-16 px-2 py-1 rounded-md border bg-background/50 text-sm"
                          defaultValue="0.7"
                          min="0"
                          max="2"
                          step="0.1"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Max Tokens</label>
                          <p className="text-xs text-muted-foreground">Response length limit</p>
                        </div>
                        <input
                          type="number"
                          className="w-16 px-2 py-1 rounded-md border bg-background/50 text-sm"
                          defaultValue="256"
                          min="1"
                          step="1"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium">Context Window</label>
                          <p className="text-xs text-muted-foreground">Conversation memory</p>
                        </div>
                        <input
                          type="number"
                          className="w-16 px-2 py-1 rounded-md border bg-background/50 text-sm"
                          defaultValue="4096"
                          min="1024"
                          step="1024"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4-5: Simple placeholder for now */}
          {activeStep === 4 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Training Your Bot</h2>
              <p className="text-muted-foreground mb-8">This step would show the training progress interface</p>
              <Button onClick={nextStep}>
                Skip to Export
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          
          {activeStep === 5 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Export Your Bot</h2>
              <p className="text-muted-foreground mb-8">This step would show export options and formats</p>
              <Button onClick={() => setActiveStep(1)}>
                Start Over
                <RotateCcw className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Bottom Navigation */}
      <section className="border-t bg-card py-4 sticky bottom-0">
        <div className="container-content flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={activeStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={nextStep}
            disabled={activeStep === steps.length}
            className="gap-2"
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}