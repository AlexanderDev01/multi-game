import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import BackButton from '../components/BackButton';
import useSound from '../hooks/useSound';
import { Volume2, Mic, Check, X } from 'lucide-react';

// Placeholder for words to practice
const practiceWords = [
  { word: "Hello", ipa: "/həˈloʊ/" },
  { word: "World", ipa: "/wɜːrld/" },
  { word: "Developer", ipa: "/dɪˈveləpər/" },
  { word: "React", ipa: "/riːˈækt/" },
  { word: "Tailwind", ipa: "/ˈteɪlwɪnd/" },
];

const PronunciationPractice = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  const playCorrectSound = useSound('/sounds/correct.mp3');
  const playIncorrectSound = useSound('/sounds/incorrect.mp3');

  const currentWord = practiceWords[currentWordIndex];

  // Text-to-Speech
  const speakWord = () => {
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  // Speech Recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("You said:", transcript);
        if (transcript.toLowerCase() === currentWord.word.toLowerCase()) {
          setMessage("Great job! Your pronunciation is spot on!");
          playCorrectSound();
        } else {
          setMessage(`Not quite. You said "${transcript}". Try again!`);
          playIncorrectSound();
        }
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        setMessage(`Speech recognition error: ${event.error}. Please try again.`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      setMessage("Speech Recognition is not supported in your browser. Please use Chrome.");
    }
  }, [currentWord, playCorrectSound, playIncorrectSound]);

  const startListening = () => {
    if (recognition) {
      setMessage("Listening...");
      setIsListening(true);
      recognition.start();
    }
  };

  const nextWord = () => {
    setMessage('');
    if (currentWordIndex < practiceWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setMessage("You've completed all practice words! Great work!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-3xl w-full border border-purple-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500">
          Pronunciation Practice
        </h1>

        <motion.div
          className="bg-gray-700/70 border border-gray-600 rounded-2xl p-6 mt-6 text-center shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-300 text-xl mb-2">Practice this word:</p>
          <h2 className="text-5xl font-bold text-white mb-2">{currentWord.word}</h2>
          <p className="text-gray-400 text-lg mb-6">{currentWord.ipa}</p>

          <div className="flex justify-center items-center gap-4 mb-6">
            <motion.button
              onClick={speakWord}
              className="p-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Volume2 className="w-8 h-8" />
            </motion.button>
            <motion.button
              onClick={startListening}
              disabled={isListening || !recognition}
              className={`p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                isListening ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-green-600 to-emerald-700 text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-8 h-8" />
            </motion.button>
          </div>

          <AnimatePresence>
            {message && (
              <motion.p
                className={`mt-4 p-3 rounded-lg font-semibold text-center w-full ${
                  message.includes('Great job') ? 'bg-green-800 text-green-200' :
                  message.includes('error') ? 'bg-red-800 text-red-200' :
                  'bg-gray-600 text-gray-200'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="mt-6 flex justify-center">
            <motion.button
              onClick={nextWord}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next Word
            </motion.button>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <BackButton to="/" />
        </div>
      </motion.div>
    </div>
  );
};

export default PronunciationPractice;