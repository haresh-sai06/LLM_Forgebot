import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // 👈 add this line

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    res.json({ response: data.response });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ error: "Failed to connect to Ollama" });
  }
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
