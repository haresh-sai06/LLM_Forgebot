import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send, X, Bot } from "lucide-react";

export default function ChatWindow() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const model = { name: "llama3" }; // Default to LiteBot 3B
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with a welcome message
    setMessages([{ text: `Hello! I'm ${model.name}, ready to assist you.`, sender: "bot" }]);
  }, [model.name]);

  useEffect(() => {
    // Scroll to top whenever messages change
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = 0;
    }
  }, [messages]);

const handleSend = async () => {
  if (!input.trim()) return;

  setMessages((prev) => [...prev, { text: input, sender: "user" }]);
  setInput("");
  setIsTyping(true);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1000000); // 10s timeout

  try {
    const response = await fetch("http://localhost:11436/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model.name, // e.g., "LiteBot 3B" or "llama3:8b"
        messages: [{ role: "user", content: input }], // Ollama expects messages array
        stream: false,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const botResponse = data.message?.content || "Sorry, I couldn't process that.";

    setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Error with Ollama API:", error);
    setMessages((prev) => [
      ...prev,
      { text: "Error: Could not get a response. Check the console.", sender: "bot" },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  return (
    <div className="min-h-screen flex flex-col dark bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <section className="bg-card/80 backdrop-blur-sm py-6 border-b border-gray-800">
        <div className="container-content text-center relative">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Bot className="h-8 w-8 mr-2 text-blue-400" />
            Chat with {model.name}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="absolute right-4 top-4 text-white hover:text-gray-300"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Chat Area */}
      <section className="flex-1 py-6 overflow-y-auto">
        <div className="container-content">
          <Card className="glass-card bg-gray-900/50 border-gray-800 shadow-lg">
            <CardContent
              ref={chatContentRef}
              className="p-6 space-y-4 max-h-[60vh] overflow-y-auto"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[70%] ${
                      msg.sender === "user"
                        ? "bg-blue-600/80 text-white"
                        : "bg-gray-700/60 text-gray-200"
                    } shadow-md`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-lg bg-gray-700/60 text-gray-200 text-sm">
                    Typing...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Input Area */}
      <section className="bg-card/80 backdrop-blur-sm py-4 border-t border-gray-800">
        <div className="container-content">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="flex-1 p-3 rounded-md border border-gray-700 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleSend}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}