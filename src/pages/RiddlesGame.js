import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton';
import { riddles } from '../mock/wordSets';
import useSound from '../hooks/useSound';
import { Lightbulb, Check, X } from 'lucide-react';
import ScoreDisplay from '../components/ScoreDisplay'; // Import ScoreDisplay

const RiddlesGame = () => {
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);

  const playCorrectSound = useSound('/sounds/correct.mp3');
  const playIncorrectSound = useSound('/sounds/incorrect.mp3');
  const playWinSound = useSound('/sounds/win.mp3');

  // Ensure currentRiddle is always valid
  const currentRiddle = riddles[currentRiddleIndex] || { question: "No more riddles!", answer: "" };

  const handleGuess = (e) => {
    e.preventDefault();
    if (guess.trim().toUpperCase() === currentRiddle.answer.toUpperCase()) {
      setMessage("Correct! You're a true riddle master!");
      setScore(prev => prev + 100);
      playCorrectSound();
      setShowAnswer(true);
    } else {
      setMessage("Nope, that's not it. Try again!");
      setScore(prev => Math.max(0, prev - 20));
      playIncorrectSound();
    }
  };

  const nextRiddle = useCallback(() => {
    setGuess('');
    setMessage('');
    setShowAnswer(false);
    if (currentRiddleIndex < riddles.length - 1) {
      setCurrentRiddleIndex(prev => prev + 1);
    } else {
      setMessage(`You've completed all riddles! Your final score: ${score}.`);
      playWinSound();
      // Optionally, you could reset the game or navigate away here
      // For now, it will just stay on the last riddle with the completion message.
    }
  }, [currentRiddleIndex, riddles.length, score, playWinSound]);

  const revealAnswer = () => {
    setShowAnswer(true);
    setMessage(`The answer was: ${currentRiddle.answer}`);
    setScore(prev => Math.max(0, prev - 50)); // Penalty for revealing
  };

  // Reset game state when component mounts or riddles change (e.g., if new riddles were loaded)
  useEffect(() => {
    setCurrentRiddleIndex(0);
    setScore(0);
    setGuess('');
    setMessage('');
    setShowAnswer(false);
  }, [riddles]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-3xl w-full border border-purple-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
          Riddle Me This!
        </h1>

        <ScoreDisplay score={score} />

        <motion.div
          className="bg-gray-700/70 border border-gray-600 rounded-2xl p-6 mt-6 text-center shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gray-200 text-xl mb-6">{currentRiddle.question}</p>

          <form onSubmit={handleGuess} className="flex flex-col gap-4">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Your answer..."
              className="px-5 py-3 bg-gray-600 border border-gray-500 rounded-xl text-lg font-medium text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-300"
              disabled={showAnswer || currentRiddleIndex >= riddles.length} // Disable if all riddles completed
            />
            <motion.button
              type="submit"
              disabled={!guess.trim() || showAnswer || currentRiddleIndex >= riddles.length}
              className={`px-6 py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300
                ${(!guess.trim() || showAnswer || currentRiddleIndex >= riddles.length) ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105'}`}
              whileHover={(!guess.trim() || showAnswer || currentRiddleIndex >= riddles.length) ? {} : { scale: 1.05 }}
              whileTap={(!guess.trim() || showAnswer || currentRiddleIndex >= riddles.length) ? {} : { scale: 0.95 }}
            >
              <Check className="w-5 h-5" />
              Submit Answer
            </motion.button>
          </form>

          <AnimatePresence>
            {message && (
              <motion.p
                className={`mt-4 p-3 rounded-lg font-semibold text-center w-full ${
                  message.includes('Correct') ? 'bg-green-800 text-green-200' :
                  message.includes('answer was') ? 'bg-yellow-800 text-yellow-200' :
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

          <div className="flex justify-center gap-4 mt-6">
            {!showAnswer && currentRiddleIndex < riddles.length && (
              <motion.button
                onClick={revealAnswer}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Lightbulb className="w-5 h-5" />
                Reveal Answer (-50 pts)
              </motion.button>
            )}
            {(showAnswer || currentRiddleIndex >= riddles.length) && (
              <motion.button
                onClick={nextRiddle}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentRiddleIndex < riddles.length ? "Next Riddle" : "Restart Riddles"}
              </motion.button>
            )}
          </div>
        </motion.div>
        <div className="mt-8 flex justify-center">
          <BackButton to="/" />
        </div>
      </motion.div>
    </div>
  );
};

export default RiddlesGame;