import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton';
import Timer from '../components/Timer';
import ScoreDisplay from '../components/ScoreDisplay';
import useSound from '../hooks/useSound';

const challengeWords = ["APPLE", "BANANA", "ORANGE", "GRAPE", "KIWI", "LEMON", "MANGO", "PEAR", "PLUM", "BERRY"];
const GAME_DURATION = 60; // 60 seconds

const TimedChallengeGame = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [inputGuess, setInputGuess] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [gameActive, setGameActive] = useState(false);

  const playCorrectSound = useSound('/sounds/correct.mp3');
  const playIncorrectSound = useSound('/sounds/incorrect.mp3');
  const playWinSound = useSound('/sounds/win.mp3');
  const playLoseSound = useSound('/sounds/lose.mp3');

  const getRandomWord = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * challengeWords.length);
    setCurrentWord(challengeWords[randomIndex]);
  }, []);

  useEffect(() => {
    if (gameActive) {
      getRandomWord();
    }
  }, [gameActive, getRandomWord]);

  const startGame = () => {
    setScore(0);
    setMessage('');
    setGameActive(true);
    getRandomWord();
  };

  const handleTimeUp = () => {
    setGameActive(false);
    setMessage(`Time's up! Your final score: ${score}`);
    playLoseSound();
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (!gameActive) return;

    if (inputGuess.toUpperCase() === currentWord) {
      setScore(prev => prev + 10);
      setMessage("Correct!");
      playCorrectSound();
      setInputGuess('');
      getRandomWord();
    } else {
      setScore(prev => Math.max(0, prev - 5));
      setMessage("Incorrect. Try again!");
      playIncorrectSound();
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
        <h1 className="text-4xl font-extrabold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
          Timed Challenge
        </h1>

        <div className="flex justify-between items-center mb-6">
          {gameActive ? (
            <Timer initialTime={GAME_DURATION} onTimeUp={handleTimeUp} key={gameActive} />
          ) : (
            <div className="text-2xl font-bold text-purple-400">Time: {GAME_DURATION}s</div>
          )}
          <ScoreDisplay score={score} />
        </div>

        <motion.div
          className="bg-gray-700/70 border border-gray-600 rounded-2xl p-6 mt-6 text-center shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {gameActive ? (
            <>
              <p className="text-gray-300 text-xl mb-2">Type this word:</p>
              <h2 className="text-5xl font-bold text-white mb-6">{currentWord}</h2>
              <form onSubmit={handleGuess} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={inputGuess}
                  onChange={(e) => setInputGuess(e.target.value)}
                  placeholder="Type here..."
                  className="px-5 py-3 bg-gray-600 border border-gray-500 rounded-xl text-lg font-medium text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  autoFocus
                />
                <motion.button
                  type="submit"
                  disabled={!inputGuess.trim()}
                  className={`px-6 py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300
                    ${!inputGuess.trim() ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-md hover:shadow-lg hover:scale-105'}`}
                  whileHover={!inputGuess.trim() ? {} : { scale: 1.05 }}
                  whileTap={!inputGuess.trim() ? {} : { scale: 0.95 }}
                >
                  <Check className="w-5 h-5" />
                  Submit
                </motion.button>
              </form>
            </>
          ) : (
            <motion.button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Timed Challenge
            </motion.button>
          )}

          <AnimatePresence>
            {message && (
              <motion.p
                className={`mt-4 p-3 rounded-lg font-semibold text-center w-full ${
                  message.includes('Correct') ? 'bg-green-800 text-green-200' :
                  message.includes('Time') ? 'bg-yellow-800 text-yellow-200' :
                  'bg-red-800 text-red-200'
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
        </motion.div>

        <div className="mt-8 flex justify-center">
          <BackButton to="/" />
        </div>
      </motion.div>
    </div>
  );
};

export default TimedChallengeGame;