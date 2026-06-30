import { useState } from "react";
import "./App.css";

// ===============================
// CONSTANTS
// ===============================

const API_BASE = "https://study-assistant-api-production.up.railway.app";

// ===============================
// APP COMPONENT
// ===============================

export default function App() {
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [summary, setSummary] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});

  // ===============================
  // API CALLS
  // ===============================

  async function handleGenerate() {
    if (!text.trim()) {
      setError("Please paste some text before generating.");
      return;
    }

    setError("");
    setLoading(true);
    setSummary("");
    setFlashcards([]);
    setQuiz([]);
    setFlippedCards({});
    setSelectedAnswers({});

    try {
      // Fetch all three in parallel
      const [summaryRes, flashcardsRes, quizRes] = await Promise.all([
        fetch(`${API_BASE}/api/summarize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }),
        fetch(`${API_BASE}/api/flashcards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }),
        fetch(`${API_BASE}/api/quiz`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }),
      ]);

      const summaryData = await summaryRes.json();
      const flashcardsData = await flashcardsRes.json();
      const quizData = await quizRes.json();

      setSummary(summaryData.summary || "");
      setFlashcards(flashcardsData.flashcards || []);
      setQuiz(quizData.quiz || []);
      setActiveTab("summary");

    } catch (err) {
      setError("Could not connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  // ===============================
  // FLASHCARD FLIP
  // ===============================

  function toggleFlip(index) {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  // ===============================
  // QUIZ ANSWER SELECTION
  // ===============================

  function selectAnswer(questionIndex, option) {
    if (selectedAnswers[questionIndex] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  }

  const hasResults = summary || flashcards.length > 0 || quiz.length > 0;

  // ===============================
  // RENDER
  // ===============================

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h1>📖 Study Assistant</h1>
        <p>Paste your notes or any text and instantly generate a summary, flashcards, and a quiz.</p>
      </header>

      {/* TEXT INPUT */}
      <div className="input-section">
        <textarea
          className="text-input"
          placeholder="Paste your notes, article, or textbook excerpt here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
        />
        <div className="input-footer">
          <span className="char-count">{text.length} characters</span>
          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "✨ Generate Study Materials"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      {/* RESULTS */}
      {hasResults && (
        <div className="results-section">

          {/* TABS */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "summary" ? "active" : ""}`}
              onClick={() => setActiveTab("summary")}
            >
              📝 Summary
            </button>
            <button
              className={`tab ${activeTab === "flashcards" ? "active" : ""}`}
              onClick={() => setActiveTab("flashcards")}
            >
              🃏 Flashcards ({flashcards.length})
            </button>
            <button
              className={`tab ${activeTab === "quiz" ? "active" : ""}`}
              onClick={() => setActiveTab("quiz")}
            >
              🧠 Quiz ({quiz.length})
            </button>
          </div>

          {/* SUMMARY TAB */}
          {activeTab === "summary" && (
            <div className="tab-content">
              <h2>Summary</h2>
              <p className="summary-text">{summary}</p>
            </div>
          )}

          {/* FLASHCARDS TAB */}
          {activeTab === "flashcards" && (
            <div className="tab-content">
              <h2>Flashcards</h2>
              <p className="hint">Click a card to reveal the answer.</p>
              <div className="flashcard-grid">
                {flashcards.map((card, index) => (
                  <div
                    key={index}
                    className={`flashcard ${flippedCards[index] ? "flipped" : ""}`}
                    onClick={() => toggleFlip(index)}
                  >
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <span className="card-label">Question</span>
                        <p>{card.question}</p>
                      </div>
                      <div className="flashcard-back">
                        <span className="card-label">Answer</span>
                        <p>{card.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUIZ TAB */}
          {activeTab === "quiz" && (
            <div className="tab-content">
              <h2>Quiz</h2>
              <p className="hint">Select an answer to see if you're correct.</p>
              <div className="quiz-list">
                {quiz.map((q, qIndex) => (
                  <div key={qIndex} className="quiz-question">
                    <p className="question-text">
                      <strong>{qIndex + 1}.</strong> {q.question}
                    </p>
                    <div className="options">
                      {q.options.map((option, oIndex) => {
                        const selected = selectedAnswers[qIndex];
                        const isSelected = selected === option;
                        const isCorrect = option === q.answer;
                        const isAnswered = selected !== undefined;

                        let optionClass = "option";
                        if (isAnswered && isCorrect) optionClass += " correct";
                        else if (isAnswered && isSelected) optionClass += " incorrect";

                        return (
                          <button
                            key={oIndex}
                            className={optionClass}
                            onClick={() => selectAnswer(qIndex, option)}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {selectedAnswers[qIndex] !== undefined && (
                      <p className="answer-feedback">
                        {selectedAnswers[qIndex] === q.answer
                          ? "✅ Correct!"
                          : `❌ Incorrect. The answer is: ${q.answer}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}