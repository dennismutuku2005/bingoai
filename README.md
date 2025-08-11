# 🎯 Bingo – AI Chat Web App (Gemini API + Tailwind CSS)

Bingo is a **modern, minimal, and responsive** AI chat interface inspired by the GPT-5 design style — but powered by **Google's Gemini API** (free version).  
It has a **clean architecture**, **dark/light themes**, and a **native-like feel** across devices.

---

## ✨ Features

### 🖥 UI & UX
- **Clean GPT-style interface** with smooth animations
- **Sidebar**:
  - Chat history list
  - "New Chat" button
- **Top bar**:
  - BG logo
  - User avatar
  - Free/Paid plan badge
  - Theme toggle (dark/light)
- **Welcome template** before starting chat
- **Fully responsive** for phones, tablets, and desktops
- **Loading skeletons** with shimmering effect for AI responses

### 💡 AI Functionality
- Uses **Gemini 2.0 Flash API** for AI responses
- Free trial: **5 chats** before login/upgrade
- After limit reached:
  - Prompt to log in or upgrade to Paid plan
- Stores chat history locally (no backend required initially)

---


---

## 🛠 Tech Stack

| Technology      | Purpose                        |
|-----------------|--------------------------------|
| **React**       | UI components and state logic  |
| **Tailwind CSS** | Styling & responsive layout    |
| **Gemini API**  | AI content generation           |
| **Vite**        | Dev server & build tool        |
| **LocalStorage**| Store chat history locally     |

---

## 🔑 API Usage

We use **Gemini 2.0 Flash API** for text generation.

**Endpoint:**

