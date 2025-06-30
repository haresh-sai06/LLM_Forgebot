
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { 
  CheckCircle2,
  ChevronDown, 
  Clock, 
  Code2, 
  Download, 
  Filter, 
  Layers, 
  Cpu, // Changed from Memory to Cpu which is available in lucide
  Search, 
  Star, 
  Zap 
} from "lucide-react";

export default function Models() {
  // Sample model data
  const models = [
    {
      id: 1,
      name: "LiteBot 3B",
      size: "3B",
      category: "Basic",
      trainingTime: "30 min",
      memoryUse: "4GB",
      license: "Apache 2.0",
      featured: false,
      capabilities: ["General chat", "Basic Q&A", "Light context handling"],
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      id: 2,
      name: "MidRange 7B",
      size: "7B",
      category: "Pro",
      trainingTime: "1.5 hrs",
      memoryUse: "8GB",
      license: "MIT",
      featured: true,
      capabilities: ["Advanced chat", "Document Q&A", "Good context retention", "Basic reasoning"],
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    },
    {
      id: 3,
      name: "PowerBot 13B",
      size: "13B",
      category: "Advanced",
      trainingTime: "3 hrs",
      memoryUse: "16GB",
      license: "MIT",
      featured: false,
      capabilities: ["Complex reasoning", "Long context window", "Specialized knowledge", "Code generation"],
      badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    },
    {
      id: 4,
      name: "LiteBot Code",
      size: "3B",
      category: "Basic",
      trainingTime: "45 min",
      memoryUse: "4GB",
      license: "Apache 2.0",
      featured: false,
      capabilities: ["Code completion", "Basic debugging", "Documentation generation"],
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      id: 5,
      name: "Ultra 30B",
      size: "30B",
      category: "Advanced",
      trainingTime: "8 hrs",
      memoryUse: "32GB",
      license: "CC BY-NC",
      featured: false,
      capabilities: ["Human-like chat", "Expert reasoning", "Creative content", "Specialized domains"],
      badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    },
    {
      id: 6,
      name: "MidRange Writer",
      size: "7B",
      category: "Pro",
      trainingTime: "2 hrs",
      memoryUse: "8GB",
      license: "MIT",
      featured: false,
      capabilities: ["Content writing", "Blog posts", "Marketing copy", "Basic storytelling"],
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col dark">
      {/* Header */}
      <section className="bg-card py-12">
        <div className="container-content text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Model Marketplace</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Browse our collection of fine-tunable models for different use cases,
            optimized for local running on your hardware.
          </p>
        </div>
      </section>
      
      {/* Filter Bar */}
      <section className="border-y bg-background/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="container-content py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                <Button variant="outline" size="sm" className="gap-1.5">
                  Size
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  Memory
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  License
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  Category
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search models..."
                className="pl-9 h-9 w-full md:w-[250px] rounded-md border bg-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Model Grid */}
      <section className="flex-1 py-12">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <Card key={model.id} className={`overflow-hidden glass-card ${model.featured ? 'neon-border-blue' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`label-badge ${model.badgeColor} mb-2`}>
                        {model.category}
                      </span>
                      {model.featured && (
                        <span className="ml-2 label-badge bg-primary/20 text-primary">
                          Featured
                        </span>
                      )}
                      <h3 className="text-lg font-semibold">{model.name}</h3>
                    </div>
                    <span className="label-badge bg-secondary font-mono">{model.size}</span>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Est. Training: {model.trainingTime}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Cpu className="h-4 w-4 mr-2" /> {/* Changed from Memory to Cpu */}
                      <span>Memory: {model.memoryUse}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Code2 className="h-4 w-4 mr-2" />
                      <span>License: {model.license}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Capabilities</h4>
                    <ul className="space-y-1">
                      {model.capabilities.map((capability, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-secondary/30 flex flex-wrap gap-2 justify-between">
                  <Button variant="secondary" size="sm">
                    <Download className="h-4 w-4 mr-1.5" />
                    Download
                  </Button>
                  <Button size="sm">
                    <Zap className="h-4 w-4 mr-1.5" />
                    Use This Model
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium mb-4">Don't see what you need?</h3>
            <Button variant="outline" className="gap-2">
              <Layers className="h-4 w-4" />
              Request Custom Model
            </Button>
          </div>
        </div>
      </section>
      
      {/* Compare Models Section */}
      <section className="section bg-card">
        <div className="container-content text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Need Help Choosing?</h2>
            <p className="text-muted-foreground mb-6">
              Compare models side-by-side to find the perfect fit for your use case and hardware constraints.
            </p>
            <div className="flex justify-center">
              <Button className="gap-2">
                <Star className="h-4 w-4" />
                Compare Models
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
