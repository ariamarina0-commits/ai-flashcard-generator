import { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5265';

interface Flashcard {
  front: string;
  back: string;
}

function App() {
  const [inputText, setInputText] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [isStudyMode, setIsStudyMode] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/Flashcard/generate`,
        { text: inputText },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setCards(response.data);
      setCurrentIndex(0);
      setFlippedIndex(null);
      setIsStudyMode(false);
    } catch (error: any) {
      console.error(
        'Server Error:',
        error.response?.data || error.message
      );

      alert(
        "The server didn't like that request. Check the console!"
      );
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    setFlippedIndex(null);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setFlippedIndex(null);
    setCurrentIndex(
      (prev) => (prev - 1 + cards.length) % cards.length
    );
  };

  const toggleStudyMode = () => {
    setIsStudyMode((prev) => !prev);
    setFlippedIndex(null);
    setCurrentIndex(0);
  };

  return (
    <main className="app">
      <div className="app-shell">
        <header className="hero">
          <div className="brand-badge">
            <span className="brand-icon">✦</span>
            AI FLASHCARDS
          </div>

          <h1>
            Study smarter with <span>AI.</span>
          </h1>

          <p>
            Turn your notes into interactive flashcards
            and start studying in seconds.
          </p>
        </header>

        {!isStudyMode && (
          <section className="generator-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR STUDY NOTES</span>
                <h2>What are you learning today?</h2>
              </div>

              <span className="character-count">
                {inputText.length} characters
              </span>
            </div>

            <textarea
              className="notes-input"
              rows={8}
              placeholder="Paste your lecture notes, textbook summary, or study material here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />

            <div className="generator-actions">
              <p className="input-hint">
                AI will turn your notes into question-and-answer
                flashcards.
              </p>

              <button
                className="primary-button"
                onClick={handleGenerate}
                disabled={loading || !inputText.trim()}
              >
                <span>{loading ? '✦' : '✦'}</span>
                {loading ? 'Generating...' : 'Generate Flashcards'}
              </button>
            </div>
          </section>
        )}

        {cards.length > 0 && !isStudyMode && (
          <section className="flashcards-section">
            <div className="flashcards-header">
              <div>
                <span className="eyebrow">YOUR FLASHCARDS</span>
                <h2>Ready to study</h2>
                <p>
                  {cards.length} {cards.length === 1 ? 'card' : 'cards'} generated
                  from your notes.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={toggleStudyMode}
              >
                Enter Study Mode
                <span>→</span>
              </button>
            </div>

            <div className="card-grid">
              {cards.map((card, index) => (
                <button
                  type="button"
                  key={index}
                  className={`flashcard ${
                    flippedIndex === index ? 'flipped' : ''
                  }`}
                  onClick={() =>
                    setFlippedIndex(
                      flippedIndex === index ? null : index
                    )
                  }
                  aria-label={`Flashcard ${index + 1}`}
                >
                  <div className="flashcard-inner">
                    <div className="front">
                      <div className="card-topline">
                        <span>QUESTION</span>
                        <span>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <p>{card.front}</p>

                      <span className="reveal-hint">
                        Click to reveal answer
                      </span>
                    </div>

                    <div className="back">
                      <div className="card-topline">
                        <span>ANSWER</span>
                        <span>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      <p>{card.back}</p>

                      <span className="reveal-hint">
                        Click to see question
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {isStudyMode && cards.length > 0 && (
          <section className="study-section">
            <div className="study-header">
              <button
                className="back-button"
                onClick={toggleStudyMode}
              >
                ← Back to all cards
              </button>

              <span className="eyebrow">STUDY MODE</span>

              <h2>Focus on one card at a time.</h2>
            </div>

            <div className="study-progress">
              <div className="progress-info">
                <span>
                  Card {currentIndex + 1} of {cards.length}
                </span>

                <span>
                  {Math.round(
                    ((currentIndex + 1) / cards.length) * 100
                  )}
                  %
                </span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      ((currentIndex + 1) / cards.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              className={`flashcard study-card ${
                flippedIndex === currentIndex ? 'flipped' : ''
              }`}
              onClick={() =>
                setFlippedIndex(
                  flippedIndex === currentIndex
                    ? null
                    : currentIndex
                )
              }
            >
              <div className="flashcard-inner">
                <div className="front">
                  <div className="card-topline">
                    <span>QUESTION</span>
                    <span>
                      {String(currentIndex + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p>{cards[currentIndex].front}</p>

                  <span className="reveal-hint">
                    Click to reveal answer
                  </span>
                </div>

                <div className="back">
                  <div className="card-topline">
                    <span>ANSWER</span>
                    <span>
                      {String(currentIndex + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <p>{cards[currentIndex].back}</p>

                  <span className="reveal-hint">
                    Click to see question
                  </span>
                </div>
              </div>
            </button>

            <div className="navigation">
              <button
                className="navigation-button"
                onClick={prevCard}
              >
                ← Previous
              </button>

              <button
                className="navigation-button next"
                onClick={nextCard}
              >
                Next →
              </button>
            </div>
          </section>
        )}

        <footer className="app-footer">
          <span>AI Flashcard Generator</span>
          <span>Built for focused learning.</span>
        </footer>
      </div>
    </main>
  );
}

export default App;