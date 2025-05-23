import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';

const HF_API_KEY = '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';
const PRIMARY_MODEL = 'mistralai/Mistral-7B-Instruct-v0.1';
const FALLBACK_MODEL = 'HuggingFaceH4/zephyr-7b-beta'; // Backup model

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelUsed, setModelUsed] = useState('');

  const exampleQuestions = [
    "Explain quantum computing in simple terms",
    "How do neural networks learn?",
    "What is blockchain technology?",
    "Describe photosynthesis like I'm 10"
  ];

  const fetchAIResponse = async (model) => {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `<s>[INST] Explain in simple terms: ${question} [/INST]`,
          parameters: {
            max_new_tokens: 400,
            temperature: 0.7,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API request failed");
    }

    const data = await response.json();
    if (!data || !data[0]?.generated_text) {
      throw new Error("No response from model");
    }

    return data[0].generated_text;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setAnswer('');

    try {
      // Try primary model first (Mistral-7B)
      try {
        const result = await fetchAIResponse(PRIMARY_MODEL);
        setAnswer(result);
        setModelUsed(PRIMARY_MODEL);
      } catch (primaryError) {
        console.log("Primary model failed, trying fallback...");
        const result = await fetchAIResponse(FALLBACK_MODEL);
        setAnswer(result);
        setModelUsed(FALLBACK_MODEL);
      }
    } catch (err) {
      setError(
        err.message.includes("loading") 
          ? "Model is loading. Please wait 20 seconds and try again."
          : `Error: ${err.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <h1 className="app-title">AI Knowledge Assistant</h1>
        <p className="app-subtitle">
          Powered by {modelUsed.includes('mistral') ? 'Mistral-7B' : 'Zephyr-7B'}
        </p>
        
        <form onSubmit={handleSubmit} className="app-form">
          <textarea
            className="app-input"
            rows="4"
            placeholder="Ask anything (e.g., 'Explain quantum physics simply')"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="app-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Processing...
              </>
            ) : 'Get Answer'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="retry-button"
            >
              Try Again
            </button>
          </div>
        )}

        {answer && (
          <div className="answer-container">
            <div className="answer-header">
              <h2>Answer</h2>
              <button 
                onClick={() => navigator.clipboard.writeText(answer)}
                className="copy-button"
              >
                Copy
              </button>
            </div>
            <div className="answer-content">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )}

        {!answer && !isLoading && (
          <div className="examples-container">
            <p>Try these examples:</p>
            <div className="examples-grid">
              {exampleQuestions.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(example)}
                  className="example-button"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;