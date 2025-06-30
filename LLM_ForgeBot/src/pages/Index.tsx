
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Bot, Code, FileCheck, PlayCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen dark">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50 z-0"></div>
        <div className="grid-pattern absolute inset-0 opacity-[0.03] z-0"></div>
        
        <div className="container-content relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full border text-sm font-medium mb-4 animate-fade-in">
              <span className="flex h-2 w-2 rounded-full bg-neon-green mr-2"></span>
              <span>Now supporting multiple local LLM formats</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight gradient-heading animate-slide-up">
              Build Smart Chatbots.<br />
              Your Data. Your Control.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:200ms]">
              Create, train, and deploy custom chatbots using local LLMs. Keep your data private
              while building intelligent conversational experiences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up [animation-delay:400ms]">
              <Button size="lg" asChild>
                <Link to="/builder">
                  Start for Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" className="group" asChild>
                <Link to="#">
                  <PlayCircle className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  Watch Demo
                </Link>
              </Button>
              
              <Button size="lg" variant="secondary" asChild>
                <Link to="/models">Choose a Model</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="section bg-card">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Build your custom chatbot in three simple steps with our intuitive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Select Model",
                description: "Choose from a variety of local LLMs based on your needs and hardware capabilities.",
                icon: Bot,
                color: "neon-blue"
              },
              {
                step: "02",
                title: "Train with Your Data",
                description: "Upload documents, conversations, or datasets to fine-tune your bot for specific knowledge.",
                icon: FileCheck,
                color: "neon-green"
              },
              {
                step: "03",
                title: "Export & Deploy",
                description: "Download your trained model or deploy directly to your application or website.",
                icon: Code,
                color: "neon-orange"
              }
            ].map((item, index) => (
              <Card key={index} className={`neon-border-${item.color} overflow-hidden glass-card`}>
                <CardContent className="p-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${item.color}/10 mb-4`}>
                    <item.icon className={`h-6 w-6 text-neon-${item.color}`} />
                  </div>
                  <span className="text-sm font-mono text-muted-foreground">{item.step}</span>
                  <h3 className="text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Demo Bots Section */}
      <section className="section">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Try Our Demo Bots</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the capabilities of our platform with these pre-built bots
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: "Customer Support Bot", 
                description: "Handles common questions about products and services.",
                badge: "Basic",
                badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              },
              {
                title: "Technical Assistant", 
                description: "Provides coding help and technical documentation.",
                badge: "Advanced",
                badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
              },
              {
                title: "Content Writer", 
                description: "Generates marketing copy and creative content.",
                badge: "Pro",
                badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              }
            ].map((bot, index) => (
              <Card key={index} className="overflow-hidden glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`label-badge ${bot.badgeColor}`}>
                      {bot.badge}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <PlayCircle className="h-4 w-4" />
                      <span className="sr-only">Try bot</span>
                    </Button>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{bot.title}</h3>
                  <p className="text-sm text-muted-foreground">{bot.description}</p>
                  <Button variant="link" className="mt-4 p-0 h-auto" asChild>
                    <Link to="#">Try this bot <ArrowRight className="ml-1 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button size="lg" asChild>
              <Link to="/models">
                Explore All Models
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Trust & Security Section */}
      <section className="section bg-card">
        <div className="container-content">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Your Data Stays With You</h2>
            <p className="text-muted-foreground">
              BotForge is designed with privacy at its core. Your data never leaves your environment.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
              {[
                {
                  title: "100% Local Processing",
                  description: "All training happens on your hardware, not in our cloud.",
                  icon: ShieldCheck,
                },
                {
                  title: "No Data Sharing",
                  description: "Your documents and conversations never leave your system.",
                  icon: ShieldCheck,
                },
                {
                  title: "Open Source Models",
                  description: "We use transparent, auditable open source LLMs.",
                  icon: ShieldCheck,
                }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section">
        <div className="container-content max-w-5xl">
          <div className="glass-card neon-border-blue overflow-hidden">
            <div className="p-8 md:p-12 bg-gradient-to-br from-transparent to-primary/5">
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">Ready to Create Your Custom Bot?</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Start building for free, no credit card required. Upgrade anytime as your needs grow.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button size="lg" asChild>
                    <Link to="/builder">Start Building Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/pricing">View Pricing Plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
