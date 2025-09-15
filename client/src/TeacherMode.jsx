import React, { useState, useEffect, useRef } from 'react';
import './TeacherMode.css';

const initialTopics = [
  // Science
  'Explain the water cycle',
  'What is photosynthesis?',
  'Describe the solar system',
  'What are the different states of matter?',
  'Explain the concept of gravity',
  'What is the difference between a cell and a battery?',
  'How do vaccines work?',
  'What is climate change?',

  // History
  'Who was Albert Einstein?',
  'What was the Industrial Revolution?',
  'Describe the ancient Roman Empire',
  'Who was Cleopatra?',

  // General Knowledge
  'How does the internet work?',
  'What are the primary colors?',
  'Explain the importance of recycling',
  'What is a democracy?',

  // Conversational
  'How was your day?',
  'What is your favorite hobby?',
  'Tell me about your favorite book',
  'What is a skill you would like to learn?',
  'Describe your dream vacation',
];

const TeacherMode = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [topics, setTopics] = useState(initialTopics);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      const handleResult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript(prevTranscript => prevTranscript + transcriptPart + ' ');
          } else {
            interimTranscript += transcriptPart;
          }
        }
      };

      recognition.addEventListener('result', handleResult);

      return () => {
        recognition.removeEventListener('result', handleResult);
        recognition.stop();
      };
    }
  }, []);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setTranscript('');
    setResult(null);
    setError(null);
  };

  const handleCustomTopicSave = () => {
    if (customTopic.trim()) {
      setTopics([...topics, customTopic]);
      handleTopicSelect(customTopic);
      setShowCustomTopicInput(false);
      setCustomTopic('');
    }
  };

  const handleDeleteTopic = (topicToDelete) => {
    setTopics(topics.filter(topic => topic !== topicToDelete));
    if (selectedTopic === topicToDelete) {
      setSelectedTopic(null);
    }
  };

  const handleRecord = () => {
    const recognition = recognitionRef.current;
    if (recognition) {
      if (isRecording) {
        recognition.stop();
        analyzeText(transcript);
      } else {
        setTranscript('');
        setResult(null);
        setError(null);
        recognition.start();
      }
      setIsRecording(!isRecording);
    }
  };

  const analyzeText = async (text) => {
    try {
      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, topic: selectedTopic }),
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Error analyzing text:', error);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="teacher-mode-container">
      {!selectedTopic ? (
        <div className="topic-selection-container">
          <h1>Select a Topic:</h1>
          <div className="custom-topic-container">
            <button className="add-topic-btn" onClick={() => setShowCustomTopicInput(!showCustomTopicInput)}>
              {showCustomTopicInput ? 'Cancel' : 'Add Your Own Topic'}
            </button>
            {showCustomTopicInput && (
              <div className="custom-topic-input-container">
                <input
                  type="text"
                  className="custom-topic-input"
                  placeholder="Enter your topic"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                />
                <button className="save-topic-btn" onClick={handleCustomTopicSave}>Save Topic</button>
              </div>
            )}
          </div>
          <div className="topic-buttons">
            {topics.map((topic, index) => (
              <div key={index} className="topic-button-wrapper">
                <button className="topic-btn" onClick={() => handleTopicSelect(topic)}>
                  {topic}
                </button>
                <button className="delete-topic-btn" onClick={() => handleDeleteTopic(topic)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="topic-container">
            <h1>Topic:</h1>
            <p>{selectedTopic}</p>
            <button className="change-topic-btn" onClick={() => setSelectedTopic(null)}>Change Topic</button>
          </div>
          <div className="recording-container">
            <button onClick={handleRecord} className={`record-btn ${isRecording ? 'recording' : ''}`}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>
          {transcript && (
            <div className="transcript-container">
              <h2>Your Explanation:</h2>
              <p>{transcript}</p>
            </div>
          )}
          {result && (
            <div className="result-container">
              <h2>Result:</h2>
              <p><strong>Rating:</strong> {result.rating}</p>
              <p><strong>Score:</strong> {result.score}</p>
              <p><strong>Feedback:</strong> {result.feedback}</p>
            </div>
          )}
          {error && (
            <div className="error-container">
              <h2>Error:</h2>
              <p>{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherMode;