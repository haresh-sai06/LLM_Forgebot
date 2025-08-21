
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, HelpCircle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  
  const pricingPlans = [
    {
      name: "Free",
      description: "For hobbyists and beginners",
      price: { monthly: "$0", yearly: "$0" },
      features: [
        { text: "Access to basic models (up to 3B)", included: true, tooltip: "Small but effective models for simple tasks" },
        { text: "5 training hours / month", included: true, tooltip: "CPU-based training on your local machine" },
        { text: "1GB storage for training data", included: true, tooltip: "Enough for documentation and simple datasets" },
        { text: "Export as GGUF format", included: true, tooltip: "Standard format compatible with most applications" },
        { text: "Community support", included: true, tooltip: "Access to Discord and forums" },
        { text: "Advanced fine-tuning options", included: false, tooltip: "Custom training parameters and methods" },
        { text: "Advanced model access", included: false, tooltip: "Models larger than 3B parameters" },
        { text: "Priority training queue", included: false, tooltip: "Your training jobs get prioritized" },
      ],
      cta: "Start for Free",
      popular: false,
    },
    {
      name: "Pro",
      description: "For developers and small teams",
      price: { monthly: "$19", yearly: "$190" },
      features: [
        { text: "Access to all models (up to 13B)", included: true, tooltip: "Medium and large models for advanced tasks" },
        { text: "30 training hours / month", included: true, tooltip: "CPU and basic GPU acceleration support" },
        { text: "10GB storage for training data", included: true, tooltip: "Store multiple datasets and document collections" },
        { text: "Export in all formats", included: true, tooltip: "GGUF, GGML, and other specialized formats" },
        { text: "Email support", included: true, tooltip: "Get help via email within 48 hours" },
        { text: "Advanced fine-tuning options", included: true, tooltip: "Custom training parameters and methods" },
        { text: "Private model hosting", included: false, tooltip: "Host your models on our secure cloud" },
        { text: "Team collaboration", included: false, tooltip: "Share models and datasets with team members" },
      ],
      cta: "Go Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For businesses with advanced needs",
      price: { monthly: "Contact us", yearly: "Contact us" },
      features: [
        { text: "Access to all models (including 30B+)", included: true, tooltip: "Our largest and most capable models" },
        { text: "Unlimited training hours", included: true, tooltip: "No limits on how much you can train" },
        { text: "100GB storage + expansion options", included: true, tooltip: "Expandable storage for enterprise-scale data" },
        { text: "Custom export formats", included: true, tooltip: "Support for specialized deployment environments" },
        { text: "Dedicated support", included: true, tooltip: "Priority support with dedicated contact" },
        { text: "Advanced fine-tuning options", included: true, tooltip: "Custom training parameters and methods" },
        { text: "Private model hosting", included: true, tooltip: "Host your models on our secure cloud" },
        { text: "Team collaboration", included: true, tooltip: "Share models and datasets with team members" },
      ],
      cta: "Contact Sales",
      popular: false,
    }
  ];

  return (
    <div className="min-h-screen flex flex-col dark">
      {/* Header */}
      <section className="bg-card py-12">
        <div className="container-content text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the right plan for your needs. All plans include the core BotForge platform.
          </p>
        </div>
      </section>
      
      {/* Billing Toggle */}
      <section className="pt-8 pb-4">
        <div className="container-content text-center">
          <div className="flex items-center justify-center space-x-4">
            <span 
              className={`cursor-pointer ${billingCycle === "monthly" ? "text-primary font-medium" : "text-muted-foreground"}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </span>
            
            <div 
              className="w-12 h-6 bg-secondary rounded-full p-1 cursor-pointer"
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            >
              <div 
                className={`w-4 h-4 rounded-full transition-transform duration-300 ${
                  billingCycle === "yearly" ? "bg-primary translate-x-6" : "bg-primary translate-x-0"
                }`}
              />
            </div>
            
            <div className="flex items-center">
              <span 
                className={`cursor-pointer ${billingCycle === "yearly" ? "text-primary font-medium" : "text-muted-foreground"}`}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly
              </span>
              <span className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Cards */}
      <section className="flex-1 pb-16">
        <div className="container-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`relative overflow-hidden ${
                  plan.popular ? 'border-primary shadow-lg' : 'glass-card'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price[billingCycle]}</span>
                    {plan.price[billingCycle] !== "Contact us" && (
                      <span className="text-muted-foreground ml-1">/{billingCycle === "monthly" ? "month" : "year"}</span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <h4 className="text-sm font-medium">Includes:</h4>
                  <ul className="space-y-2">
                    <TooltipProvider>
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className={`mr-2 mt-1 ${feature.included ? 'text-primary' : 'text-muted-foreground'}`}>
                            {feature.included ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <div className="h-4 w-4 border rounded-full" />
                            )}
                          </span>
                          <span className={feature.included ? '' : 'text-muted-foreground'}>
                            {feature.text}
                          </span>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 ml-1.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-[200px]">{feature.tooltip}</p>
                            </TooltipContent>
                          </Tooltip>
                        </li>
                      ))}
                    </TooltipProvider>
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="section bg-card">
        <div className="container-content max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="grid gap-6">
            {[
              {
                question: "Can I upgrade or downgrade my plan anytime?",
                answer: "Yes, you can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, your new plan will take effect at the end of your current billing cycle."
              },
              {
                question: "What happens if I exceed my training hours?",
                answer: "If you exceed your allocated training hours, you'll have the option to purchase additional hours or wait until the next billing cycle when your hours reset."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 14-day money-back guarantee for new subscriptions. If you're not satisfied with our service, contact us within 14 days of your initial purchase for a full refund."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for annual enterprise plans."
              },
              {
                question: "Is there a difference in features between monthly and yearly billing?",
                answer: "The features are identical whether you choose monthly or yearly billing. Yearly billing simply offers a 20% discount compared to paying monthly."
              }
            ].map((item, index) => (
              <div key={index} className="border-b border-border pb-4">
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <HelpCircle className="h-5 w-5 text-primary mr-2" />
                  {item.question}
                </h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-muted-foreground mb-4">
              Have more questions about our pricing or need a custom plan?
            </p>
            <Button variant="outline">Contact Our Sales Team</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
