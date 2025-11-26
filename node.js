// Node/Express example (very short sketch)
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/warmbridge", async (req, res) => {
  const { message, history } = req.body;
  try {
    const chat = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are WarmBridge, a gentle assistant for illiterate and digitally-limited users. Use simple language, short sentences, and step-by-step guidance."
        },
        ...(history || []),
        { role: "user", content: message }
      ]
    });
    const reply = chat.choices[0].message.content;
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ reply: "Backend error while calling LLM." });
  }
});

app.listen(3000, () => console.log("WarmBridge backend listening on 3000"));
