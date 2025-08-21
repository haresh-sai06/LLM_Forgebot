
import { Bot, Github, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col dark">
      {/* Header */}
      <section className="bg-card py-12">
        <div className="container-content text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact & Support</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Need help with BotForge? Our support team and community are here to assist you.
          </p>
        </div>
      </section>
      
      {/* Contact Methods */}
      <section className="section">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Discord Community",
                description: "Join our active Discord community for quick help and discussions.",
                icon: MessageCircle,
                action: "Join Discord",
                href: "#"
              },
              {
                title: "GitHub Issues",
                description: "Report bugs, request features, or contribute to our open source code.",
                icon: Github,
                action: "View GitHub",
                href: "#"
              },
              {
                title: "Documentation",
                description: "Browse our detailed guides, tutorials, and API documentation.",
                icon: HelpCircle,
                action: "Read Docs",
                href: "#"
              }
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <Button variant="outline" asChild>
                    <a href={item.href}>{item.action}</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Form */}
      <section className="section bg-card">
        <div className="container-content max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Have a specific question or feedback? Send us a message and we'll get back to you as soon as possible.
              </p>
              
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-md border bg-background/50"
                    placeholder="Your name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 rounded-md border bg-background/50"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Subject</label>
                  <select className="w-full px-3 py-2 rounded-md border bg-background/50">
                    <option value="">Select a topic</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Message</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-md border bg-background/50 h-32 resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
            
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "What hardware do I need to run BotForge?",
                    answer: "For basic models, we recommend at least 8GB RAM and a modern CPU. For larger models, 16GB+ RAM and a GPU will provide better performance. Full requirements are available in our documentation."
                  },
                  {
                    question: "Can I export my trained bot?",
                    answer: "Yes, BotForge allows you to export your trained models in several formats including GGUF and GGML, making it easy to deploy them in various environments."
                  },
                  {
                    question: "Is my data private when using BotForge?",
                    answer: "Absolutely. BotForge processes all data locally on your machine. We never receive, store, or access your training data or conversations."
                  },
                  {
                    question: "Do I need an internet connection to use BotForge?",
                    answer: "After downloading the application and models, you can run BotForge entirely offline. Internet is only required for updates and downloading new models."
                  },
                  {
                    question: "What's the difference between pricing tiers?",
                    answer: "Our pricing tiers differ in available model sizes, training compute resources, and export capabilities. Check our pricing page for a detailed comparison."
                  }
                ].map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="mt-auto pt-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start">
                  <Bot className="h-5 w-5 text-primary mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium mb-1">Try our Support Bot</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get instant answers to common questions with our AI assistant.
                    </p>
                    <Button variant="outline" size="sm">
                      Chat with Support Bot
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
