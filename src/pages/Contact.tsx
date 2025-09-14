import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send, X } from "lucide-react";

export default function ChatWindow() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const model = state?.model || { name: "Unknown Model" };
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Initialize with a welcome message
    setMessages([{ text: `Welcome to chat with ${model.name}!`, sender: "bot" }]);
  }, [model.name]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      // Simulate bot response (replace with real API call later)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: `Echo from ${model.name}: ${input}`, sender: "bot" },
        ]);
      }, 500);
      setInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark bg-background">
      {/* Header */}
      <section className="bg-card py-6">
        <div className="container-content text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Chat with {model.name}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" /> Close
          </Button>
        </div>
      </section>

      {/* Chat Area */}
      <section className="flex-1 py-6 overflow-y-auto">
        <div className="container-content">
          <Card className="glass-card">
            <CardContent className="p-6 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Input Area */}
      <section className="bg-card py-4 border-t">
        <div className="container-content">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-md border bg-transparent text-sm"
            />
            <Button onClick={handleSend} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}