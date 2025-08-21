
import { Bot } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card text-card-foreground">
      <div className="container-content py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">BotForge</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Build custom chatbots using local LLMs. Your data. Your control.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/models" className="text-muted-foreground hover:text-foreground">
                  Models
                </Link>
              </li>
              <li>
                <Link to="/builder" className="text-muted-foreground hover:text-foreground">
                  Bot Builder
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  GitHub
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  Discord
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground">
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BotForge. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
