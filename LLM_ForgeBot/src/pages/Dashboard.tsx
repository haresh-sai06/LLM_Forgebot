import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Plus, FileText, Activity, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// This is a mock data set. In a real application, you would fetch this from an API.
const mockData = {
  projects: [
    { name: "Customer Support Bot", status: "Active", lastUpdated: "2 hours ago" },
    { name: "Technical Docs Assistant", status: "Training", lastUpdated: "1 day ago" },
    { name: "Marketing Content Writer", status: "Inactive", lastUpdated: "1 week ago" },
  ],
  metrics: {
    totalBots: 5,
    activeModels: 3,
    storageUsed: 75, // in GB
    trainingTime: 12.5, // in hours
  },
};

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen dark">
      {/* Dashboard Header */}
      <div className="container-content py-8 md:py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-heading">
            Dashboard
          </h1>
          <Button size="lg" asChild>
            <Link to="/builder">
              <Plus className="mr-2 h-4 w-4" />
              Create New Bot
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground text-lg">
          Welcome back. Here's a quick overview of your projects and system status.
        </p>
      </div>

      <main className="flex-1 container-content pb-12">
        {/* Analytics & Metrics */}
        <section className="mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card neon-border-blue">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Bots
                </CardTitle>
                <Bot className="h-4 w-4 text-neon-blue" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.metrics.totalBots}</div>
                <p className="text-xs text-muted-foreground">
                  Your complete bot count
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border-green">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Models
                </CardTitle>
                <Activity className="h-4 w-4 text-neon-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.metrics.activeModels}</div>
                <p className="text-xs text-muted-foreground">
                  Currently running
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border-orange">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Storage Used
                </CardTitle>
                <FileText className="h-4 w-4 text-neon-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.metrics.storageUsed} GB</div>
                <Progress value={(mockData.metrics.storageUsed / 100) * 100} className="mt-2" />
                <p className="text-xs text-muted-foreground">
                  Based on local data & models
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border-purple">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Training Time
                </CardTitle>
                <Users className="h-4 w-4 text-neon-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.metrics.trainingTime} hrs</div>
                <p className="text-xs text-muted-foreground">
                  Cumulative training time
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* My Projects List */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">My Projects</h2>
            <Button variant="ghost" className="text-muted-foreground" asChild>
              <Link to="/builder">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </div>

          <div className="space-y-4">
            {mockData.projects.map((project, index) => (
              <Card key={index} className="glass-card hover:bg-card/70 transition-colors">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Bot className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Status: <span className="font-medium text-primary">{project.status}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground hidden sm:block">
                      Last Updated: {project.lastUpdated}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/builder?project=${project.name}`}>Manage</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <Separator className="my-12" />

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="glass-card neon-border-green">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Button variant="outline" className="h-12 w-12 rounded-full mb-4">
                  <Bot className="h-6 w-6" />
                </Button>
                <h3 className="text-lg font-semibold mb-2">Build New Bot</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start from scratch or use a template.
                </p>
                <Button asChild variant="secondary">
                  <Link to="/builder">Start Now <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border-blue">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Button variant="outline" className="h-12 w-12 rounded-full mb-4">
                  <Settings className="h-6 w-6" />
                </Button>
                <h3 className="text-lg font-semibold mb-2">View Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your account, billing, and API keys.
                </p>
                <Button asChild variant="secondary">
                  <Link to="/settings">Go to Settings <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card neon-border-orange">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Button variant="outline" className="h-12 w-12 rounded-full mb-4">
                  <FileText className="h-6 w-6" />
                </Button>
                <h3 className="text-lg font-semibold mb-2">Explore Docs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Find guides, tutorials, and API documentation.
                </p>
                <Button asChild variant="secondary">
                  <Link to="/docs">Read Docs <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}