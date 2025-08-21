import { useState } from "react";
import axios from "axios";

const ChatWindow = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "You", text: input }]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        prompt: input,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: res.data.response || "No response" },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "⚠️ Error: Could not reach server" },
      ]);
    }

    setInput("");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial" }}>
      <h2>LLM ForgeBot Test</h2>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
