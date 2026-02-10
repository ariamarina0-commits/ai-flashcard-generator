import { useState } from 'react';
import axios from 'axios';
import './App.css';

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
    if (!inputText) return;
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5265/api/Flashcard/generate', 
        { text: inputText }, 
        { headers: { 'Content-Type': 'application/json' } }
      );
    
      setCards(response.data);
      setCurrentIndex(0);
      setFlippedIndex(null);
      setIsStudyMode(false); // Default to grid view when new cards arrive
    } catch (error: any) {
      console.error("Server Error:", error.response?.data || error.message);
      alert("The server didn't like that request. Check the console!");
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
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className='App'>
      <h1>🧠 AI Flashcard Generator</h1>
      
      {/* 1. Input Section: Hide when studying to save space */}
      {!isStudyMode && (
        <div className="input-area">
          <textarea 
            rows={5} 
            style={{ width: '80%', padding: '10px', borderRadius: '8px' }}
            placeholder="Paste your study notes here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <br />
          <button 
            onClick={handleGenerate} 
            disabled={loading} 
            style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}
          >
            {loading ? '🪄 Generating...' : 'Create Flashcards'}
          </button>
        </div>
      )}

      {/* 2. Toggle Button: Only show if we actually have cards */}
      {cards.length > 0 && (
        <div style={{ margin: '20px' }}>
          <button 
            onClick={() => { setIsStudyMode(!isStudyMode); setFlippedIndex(null); }}
            style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {isStudyMode ? "🔙 Back to Grid View" : "📖 Enter Study Mode"}
          </button>
        </div>
      )}

      {/* 3. Display Section */}
      {isStudyMode && cards.length > 0 ? (
        /* --- STUDY MODE VIEW --- */
        <div className="study-container">
          <div className="progress-bar" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Card {currentIndex + 1} of {cards.length}
          </div>

          <div 
            className={`flashcard large ${flippedIndex === currentIndex ? 'flipped' : ''}`}
            onClick={() => setFlippedIndex(flippedIndex === currentIndex ? null : currentIndex)}
          >
            <div className="flashcard-inner">
              <div className="front">{cards[currentIndex].front}</div>
              <div className="back">{cards[currentIndex].back}</div>
            </div>
          </div>

          <div className="navigation" style={{ marginTop: '20px' }}>
            <button onClick={prevCard} style={{ margin: '0 10px' }}>← Previous</button>
            <button onClick={nextCard} style={{ margin: '0 10px' }}>Next →</button>
          </div>
        </div>
      ) : (
        /* --- GRID VIEW --- */
        <div className="card-grid">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className={`flashcard ${flippedIndex === index ? 'flipped' : ''}`}
              onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
            >
              <div className="flashcard-inner">
                <div className="front">{card.front}</div>
                <div className="back">{card.back}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;