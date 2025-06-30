
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bot, Menu, X } from "lucide-react";

const routes = [
  { name: "Home", path: "/" },
  { name: "Models", path: "/models" },
  { name: "Builder", path: "/builder" },
  { name: "Pricing", path: "/pricing" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" }
];

export function MainNav() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container-content flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">BotForge</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === route.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {route.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
          <div className="flex md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container-content py-4 space-y-4">
            <div className="flex flex-col space-y-3">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                    location.pathname === route.path ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {route.name}
                </Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-4">
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
