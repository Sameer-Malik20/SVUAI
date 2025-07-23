const fs = require("fs");
const path = require("path");
const express = require("express");
const venom = require("venom-bot");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Load university data once
const coursesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "/courses_info.json"), "utf-8")
);

// 🔁 Convert to plain context string
const universityContext = coursesData
  .map((item) =>
    Object.entries(item)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" | ")
  )
  .join("\n");

// 🔌 Create bot
venom
  .create({
    session: "svu-ai-bot",
    headless: "new",
    useChrome: true,
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  })
  .then((client) => startBot(client))
  .catch((err) => console.error("❌ Venom Init Error:", err));

function startBot(client) {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg && message.body) {
      const question = message.body.trim();

      const prompt = `You are SVU AI Assistant. Use the following university data to answer user questions accurately and briefly.

UNIVERSITY DATA:
${universityContext}

USER QUESTION: ${question}
ANSWER:`; // 👈 Gemini को clear instruction

      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const reply =
          response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Sorry, I couldn't understand that.";

        client.sendText(message.from, reply);
      } catch (error) {
        console.error("Gemini Error:", error.response?.data || error.message);
        client.sendText(message.from, "❌ Gemini API error.");
      }
    }
  });
}

app.listen(PORT, () =>
  console.log(`✅ SVU AI WhatsApp Bot running at http://localhost:${PORT}`)
);
