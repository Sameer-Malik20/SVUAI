from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import requests
import json

app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = "AIzaSyC--QnxvB3oS5JrAyvN1HOGnJE-sGDb0zg"

# Load CSV
df = pd.read_csv("courses_info.csv", sep="\t")  # Add sep='\t'


# Convert each row to a search-ready text chunk
def row_to_text_general(row):
    return " | ".join([str(v) for v in row.values if pd.notna(v)])

text_chunks = df.apply(row_to_text_general, axis=1).tolist()
data_context = "\n".join(text_chunks)

@app.route("/ai/chat", methods=["POST"])
def chat():
    user_question = request.json.get("question", "").strip()
    if not user_question:
        return jsonify({"error": "Missing question"}), 400

    prompt = f"""You are a helpful university admission assistant. Based on the following university data, answer the user's question briefly, clearly and accurately:

UNIVERSITY DATA:
{data_context}

USER QUESTION: {user_question}
ANSWER:"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        response.raise_for_status()
        data = response.json()
        text_response = data['candidates'][0]['content']['parts'][0]['text']

        # fallback check (optional)
        if not text_response or "I don't know" in text_response.lower():
            text_response = "Sorry, I couldn't find that. Please contact SVU or visit svu.edu.in"

        return jsonify({"answer": text_response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
