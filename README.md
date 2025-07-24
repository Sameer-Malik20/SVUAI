# 🤖 SVUAI - Smart Virtual University AI Assistant

**SVUAI** is a comprehensive, AI-powered virtual assistant designed specifically for university students. It helps users get quick answers, extract data from documents, and interact seamlessly via WhatsApp. The backend is built using **Node.js**, while AI functionalities are powered by **Python (Flask)** with robust libraries like **sentence-transformers**, **torch**, and **pandas**. The project also features an integrated **WhatsApp bot** developed using the **Alias** framework, enabling smooth AI interactions over chat.

---

## ✨ Features

- 🔍 **Question Answering System**
  - Students can ask university-related questions.
  - The AI retrieves relevant information from documents or context and responds promptly.

- 📄 **Document Extraction**
  - Upload PDFs or CSV files to extract structured data.
  - Utilizes `pandas` for efficient and clean data processing.

- 🤖 **AI-Based Answer Logic**
  - Uses `sentence-transformers` and `torch` to generate sentence embeddings.
  - Finds the most relevant answers by similarity matching.

- 💬 **WhatsApp Bot Integration**
  - Built with the [Alias](https://github.com/alias/bot) framework for WhatsApp automation.
  - Automatically responds to student queries with AI-generated answers, enabling real-time interaction.

- 📦 **Docker-Ready**
  - Fully containerized for easy deployment using Docker.

---

## 🛠️ Tech Stack

| Layer             | Technology                                    |
|------------------|----------------------------------------------|
| Backend           | Node.js, Express.js                         |
| AI Engine         | Python (Flask)                              |
| Messaging         | WhatsApp via Alias                          |
| Data Management   | Pandas, CSV/Excel, JSON                      |
| ML/AI             | Sentence Transformers, Torch                  |
| Deployment        | Docker + DockerHub                          |

---

## 🧰 Python Libraries Used

| Library                | Purpose                                              |
|-----------------------|------------------------------------------------------|
| `flask`               | Lightweight server to run AI APIs                     |
| `pandas`              | Reading, cleaning, and managing tabular data        |
| `sentence-transformers` | Generating sentence embeddings and similarity matching |
| `torch`               | Backend engine for sentence-transformers             |

---

## 📱 WhatsApp Bot

- Built using the [Alias](https://github.com/alias/bot) framework.
- Handles WhatsApp messages automatically.
- Example:
  
  **Student:** What is the last date for admission?  
  **Bot:** The last date for admission is July 30, 2025.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/svuai.git
cd svuai
```

### 2. Build and Run with Docker

```bash
docker build -t sameer264/svu-backend .
docker run -p 3000:3000 sameer264/svu-backend
```

### 3. Start the Python AI Server (Flask)

```bash
cd python-ai/
pip install -r requirements.txt
python app.py
```

### 4. Start the WhatsApp Bot (Alias)

```bash
cd alias-bot/
# Follow Alias setup instructions
npm install
npm start
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---------|------------|--------------|
| GET     | `/ask?query=` | Ask a question to the AI |
| POST    | `/upload`      | Upload a CSV or PDF document |
| GET     | `/answer/:id`   | Retrieve AI answer by ID |

---

## 📦 Deployment

The Docker image is available on DockerHub:

```bash
docker pull sameer264/svu-backend
```

---

## 👨‍💻 Author

**Sameer Malik**  
BCA Student | Full Stack Developer | AI Enthusiast

---

## 📜 License

This project is licensed under the MIT License.

---
