import { useState, useRef, useEffect } from "react";

export default function SvuAiChat() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [coursesData, setCoursesData] = useState([]);
  const messagesEndRef = useRef(null);

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  // "AIzaSyCg5-pUEUsjyIs4ddElOD41E0DNFyfpKJg";
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("/courses_info.json");
      const data = await res.json();
      setCoursesData(data);
    };
    fetchCourses();
  }, []);

  const askQuestion = async () => {
    if (!question.trim() || loading) return;
    setLoading(true);

    const userMessage = { type: "user", text: question };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      // Convert JSON to plain text (like backend was doing)
      const dataContext = coursesData
        .map((item) => Object.values(item).filter(Boolean).join(" | "))
        .join("\n");

      const prompt = `You are a helpful university admission assistant. Based on the following university data, answer the user's question briefly, clearly and accurately:

UNIVERSITY DATA:
${dataContext}

USER QUESTION: ${question}
ANSWER:`;

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        const json = await res.json();
        console.log(json);

        if (json.error?.status === "RESOURCE_EXHAUSTED") {
          setChatHistory((prev) => [
            ...prev,
            {
              type: "ai",
              text: "⚠️ You've exceeded the API quota. Please try again later or check billing settings at https://ai.google.dev/gemini-api/docs/rate-limits.",
            },
          ]);
        } else {
          const aiText =
            json?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Sorry, I couldn't find that. Please contact SVU or visit svu.edu.in";

          const aiMessage = { type: "ai", text: aiText };
          setChatHistory((prev) => [...prev, aiMessage]);
        }
      } catch (error) {
        console.error(error);
        setChatHistory((prev) => [
          ...prev,
          { type: "ai", text: "⚠️ Error connecting to Gemini API." },
        ]);
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { type: "ai", text: "⚠️ Error connecting to Gemini API." },
      ]);
    }

    setLoading(false);
    setQuestion("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-lg p-6 rounded-b-3xl flex items-center justify-center space-x-4 mb-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-2">
          <img
            src="https://res.cloudinary.com/dsragxpo0/image/upload/v1753069833/svu_logo_gg1di7.png"
            alt="University Logo"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span>SVU AI Assistant</span>
        </h1>
      </header>

      {/* Chat area */}
      <main className="flex-1 p-6 bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50 rounded-xl mx-4 shadow-lg overflow-y-auto max-h-[70vh]">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`max-w-xl px-4 py-3 rounded-xl shadow-md text-sm whitespace-pre-line transition-transform ${
                msg.type === "user"
                  ? "bg-blue-600 text-white rounded-br-none hover:scale-105"
                  : "bg-white text-gray-800 rounded-bl-none hover:scale-105"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xl px-4 py-3 rounded-xl bg-white shadow-md text-sm text-gray-500 animate-pulse border-2 border-dashed border-gray-300">
              Typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Input area */}
      <div className="p-6 bg-white shadow-inner rounded-t-3xl mt-4 mx-4 mb-6">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Ask something about Shri Venkateshwara University..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && askQuestion()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-shadow duration-200 shadow-sm"
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-semibold transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}
