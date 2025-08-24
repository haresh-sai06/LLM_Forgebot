import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Globe, Lock, Code } from "lucide-react";
import { Link } from "react-router-dom";
import ProfilePic from "C:/Users/share/Pictures/Photo/mypic.jpeg";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen dark">
      {/* Hero Section - About */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background to-background/50 z-0"></div>
        <div className="grid-pattern absolute inset-0 opacity-[0.03] z-0"></div>
        
        <div className="container-content relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight gradient-heading animate-slide-up">
              About BotForge
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up [animation-delay:200ms]">
              We believe in a future where AI is accessible, secure, and fully under your control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up [animation-delay:400ms]">
              <Button size="lg" asChild>
                <Link to="/builder">
                  Start Building
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group" asChild>
                <Link to="#mission">
                  Our Mission
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission Section */}
      <section id="mission" className="section bg-card">
        <div className="container-content">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission: Redefining AI Development</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              BotForge was born from a simple idea: that you should own your data and your creations. In an era of cloud-first AI, we offer a powerful alternative.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Data Sovereignty",
                description: "Your information never leaves your server. We provide the tools; you maintain full control.",
                icon: Lock,
                color: "neon-blue"
              },
              {
                title: "Local-First Philosophy",
                description: "Run and train models on your own hardware, ensuring maximum privacy and minimal latency.",
                icon: Code,
                color: "neon-green"
              },
              {
                title: "Empowering Builders",
                description: "We make advanced AI development accessible to everyone, from hobbyists to enterprises.",
                icon: Globe,
                color: "neon-orange"
              }
            ].map((item, index) => (
              <Card key={index} className={`neon-border-${item.color} overflow-hidden glass-card`}>
                <CardContent className="p-6">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${item.color}/10 mb-4`}>
                    <item.icon className={`h-6 w-6 text-neon-${item.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Team Section */}
<section className="section">
  <div className="container-content">
    <div className="text-center mb-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Meet the Team</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        A small team of dedicated developers and designers building the future of private AI.
      </p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
      {[
        { name: "Haresh Sainaath", role: "Founder / CEO", shape: "rounded-2xl", image: ProfilePic }
        // later you can add more: { name, role, shape, image: "/images/jasmine.jpg" }
      ].map((member, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center p-6 glass-card neon-border-blue rounded-2xl hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          <div className={`w-40 h-40 mb-6 ${member.shape} overflow-hidden border-4 border-primary/40 shadow-md`}>
            <img 
              src={member.image} 
              alt={member.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h3 className="text-xl font-semibold">{member.name}</h3>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      
      {/* CTA Section */}
      <section className="section bg-card">
        <div className="container-content max-w-5xl">
          <div className="glass-card neon-border-green overflow-hidden">
            <div className="p-8 md:p-12 bg-gradient-to-br from-transparent to-primary/5">
              <div className="text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">Join the Privacy Revolution</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Ready to build with complete control? Start your journey with BotForge today.
                </p>
                <div className="pt-4">
                  <Button size="lg" asChild>
                    <Link to="/builder">Start Building Now</Link>
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