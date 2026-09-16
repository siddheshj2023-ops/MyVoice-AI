# 🎙️ MyVoice AI — Intelligent Voice Personal Assistant

> A full-stack voice assistant that understands natural voice/text commands and performs browser actions such as opening websites, searching Google, checking time/date, and providing an interactive AI-style dashboard.

🌐 **Live Demo:** https://siddheshj2023-ops.github.io/MyVoice-AI/
💻 **GitHub:** https://github.com/siddheshj2023-ops/MyVoice-AI

---

## 🚀 Overview

**MyVoice AI** is a browser-based voice personal assistant designed to provide a modern assistant experience through voice recognition, text input, command processing, browser automation, and text-to-speech.

The project combines a responsive frontend with a Node.js/Express backend to process commands and return structured actions to the client.

The application supports both:

* 🎙️ Voice commands
* ⌨️ Text commands

---

## ✨ Features

### 🎙️ Voice Assistant

* Browser-based speech recognition
* Natural voice command input
* Text-to-speech responses
* Start/Stop voice controls
* Language selection support

### 🧠 Command Processing

MyVoice AI recognizes commands such as:

```text
"Open YouTube"
"Open ChatGPT"
"Open Google"
"Weather"
"What is the time?"
"What is today's date?"
"Search artificial intelligence"
```

### 🌐 Browser Automation

The assistant can trigger browser actions including:

* Open Google
* Open YouTube
* Open ChatGPT
* Open weather search
* Perform Google searches

### 💬 Conversation Interface

* User/assistant conversation bubbles
* Conversation timestamps
* Clear conversation functionality
* Assistant activity history

### 📊 Dashboard

* Command counter
* Message counter
* Success-rate statistics
* Live activity feed
* Assistant state indicators

### ⚡ Real-Time Assistant States

The UI provides visual feedback for:

```text
READY
LISTENING
THINKING
SPEAKING
```

---

## 🏗️ System Architecture

```text
                 ┌───────────────────────┐
                 │       User            │
                 │ Voice / Text Command  │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │   MyVoice AI Frontend │
                 │ HTML / CSS / JavaScript│
                 └───────────┬───────────┘
                             │
                         HTTP API
                             │
                             ▼
                 ┌───────────────────────┐
                 │   Express Backend     │
                 │   Command Router      │
                 └───────────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Google Search     Browser       Time/Date
                          Actions
```

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Web Speech API
* SpeechSynthesis API
* LocalStorage

### Backend

* Node.js
* Express.js
* CORS
* REST API

### Deployment

* **GitHub Pages** — Frontend
* **Render** — Backend

---

## 📁 Project Structure

```text
MyVoice-AI/
│
├── index.html
├── script.js
├── style.css
│
├── assets/
│   └── myvoice-ai.png
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── data/
│       ├── memory.json
│       ├── notes.json
│       └── tasks.json
│
└── README.md
```

---

## 🔌 API

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "service": "MyVoice AI Backend"
}
```

### Message API

```http
POST /api/message
```

Request:

```json
{
  "message": "open chat GPT"
}
```

Response:

```json
{
  "reply": "OPEN_CHATGPT"
}
```

Other command responses include:

```text
OPEN_GOOGLE
OPEN_YOUTUBE
OPEN_CHATGPT
OPEN_WEATHER
CURRENT_TIME
CURRENT_DATE
SEARCH_GOOGLE:<query>
```

---

## 🎯 Example Commands

| User Command            | MyVoice AI Action    |
| ----------------------- | -------------------- |
| Hello                   | Returns greeting     |
| What is the time?       | Returns current time |
| What is today's date?   | Returns current date |
| Open Google             | Opens Google         |
| Open YouTube            | Opens YouTube        |
| Open ChatGPT            | Opens ChatGPT        |
| Weather                 | Opens weather search |
| Search machine learning | Opens Google search  |

---

## ▶️ Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/siddheshj2023-ops/MyVoice-AI.git
cd MyVoice-AI
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Start backend

```bash
node server.js
```

Backend:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

### 4. Start frontend

Open the project frontend using a local development server such as VS Code Live Server, or serve the static files through your preferred local server.

---

## 🌍 Deployment

### Frontend

The frontend is deployed using **GitHub Pages**:

```text
https://siddheshj2023-ops.github.io/MyVoice-AI/
```

### Backend

The Node.js backend is deployed using **Render**.

The frontend communicates with the deployed backend through the configured API URL.

---

## 🔐 Security Notes

* Do not commit `.env` files or API keys.
* Do not store production credentials inside frontend JavaScript.
* Use environment variables for sensitive backend configuration.
* Restrict CORS appropriately for production deployments.

---

## 📸 Project Highlights

The dashboard provides:

* Modern AI-assistant interface
* Animated assistant states
* Voice interaction
* Command activity tracking
* Conversation history
* Browser automation
* Responsive layout

---

## 📚 What I Learned

Through this project, I worked with:

* Frontend and backend integration
* REST API development
* Browser Speech Recognition
* Text-to-Speech
* Command routing
* JavaScript asynchronous requests
* LocalStorage
* CORS
* Git and GitHub
* GitHub Pages deployment
* Node.js backend deployment with Render

---

## 🔮 Future Improvements

Planned improvements include:

* AI/LLM-powered natural conversation
* User authentication
* Persistent cloud conversation history
* Personalized assistant memory
* Weather API integration
* Reminder and task management
* More browser automation commands
* Multi-language voice support
* Voice wake-word detection
* Mobile-focused PWA experience

---

## 👨‍💻 Author

**Siddhesh**

Computer Science & Engineering Student

GitHub:
https://github.com/siddheshj2023-ops

---

## ⭐ Support

If you find the project useful, consider giving the repository a ⭐ on GitHub.

---

### 📌 Live Project

**MyVoice AI:**
https://siddheshj2023-ops.github.io/MyVoice-AI/
