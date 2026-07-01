# 📖 Study Assistant

An AI-powered study tool that instantly generates summaries, flashcards, and quizzes from any text. Paste your notes, articles, or textbook excerpts and get personalized study materials in seconds.

**Live Site:** https://study-assistant-seven-sooty.vercel.app
**Backend API:** https://github.com/Lunaris47/study-assistant-api

---

## Features

- **Summary** — concise overview of the key concepts from your text
- **Flashcards** — auto-generated question/answer pairs with a flip animation
- **Quiz** — multiple choice questions with instant correct/incorrect feedback
- **All three generated in parallel** — no waiting between tabs
- **Character counter** — shows how much text you've pasted

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite) |
| Styling | CSS with responsive layout |
| API Calls | Fetch API (calls FastAPI backend) |
| Hosting | Vercel |

---

## How It Works

1. Paste any text into the textarea
2. Click **"✨ Generate Study Materials"**
3. The frontend sends the text to the FastAPI backend
4. The backend proxies the request to OpenAI's API (keeping the key server-side)
5. Results are returned and displayed across three tabs — Summary, Flashcards, and Quiz

---

## Backend

The frontend connects to a live REST API built with Python and FastAPI, deployed on Railway. The OpenAI API key is stored securely as a server-side environment variable — never exposed in the frontend.

→ **Backend repo:** https://github.com/Lunaris47/study-assistant-api

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/Lunaris47/study-assistant.git
cd study-assistant

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Make sure the backend is also running locally at `http://127.0.0.1:8000` — see the backend repo for setup instructions.

---

## Author

Jesse Sciamanna — [GitHub](https://github.com/Lunaris47) | [LinkedIn](https://www.linkedin.com/in/JesseSciam)
