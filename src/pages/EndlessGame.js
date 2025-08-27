import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CrosswordGrid from '../components/CrosswordGrid';
import AnagramInput from '../components/AnagramInput';
import ScoreDisplay from '../components/ScoreDisplay';
import HintButton from '../components/HintButton';
import BackButton from '../components/BackButton';
import generateCrossword from '../utils/crosswordGenerator';
import { defaultWordSets } from '../mock/wordSets';
import { Shuffle } from 'lucide-react';
import useSound from '../hooks/useSound';

const HINT_COST = 30; // Cheaper hints for endless
const GRID_SIZE = 15;

const EndlessGame = () => {
  const [wordSets, setWordSets] = useState(defaultWordSets);
  const [crosswordData, setCrosswordData] = useState({ grid: [], placedWords: [], availableLetters: [] });
  const [revealedWords, setRevealedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [hintsAvailable, setHintsAvailable] = useState(5); // More hints for endless
  const [currentWordSetIndex, setCurrentWordSetIndex] = useState(0);

  const playCorrectSound = useSound('/sounds/correct.mp3');
  const playIncorrectSound = useSound('/sounds/incorrect.mp3');
  const playHintSound = useSound('/sounds/hint.mp3');
  const playWinSound = useSound('/sounds/win.mp3'); // For completing a set

  const initializeGame = useCallback(() => {
    const currentSet = wordSets[currentWordSetIndex % wordSets.length]; // Loop through word sets
    const { grid, placedWords, availableLetters } = generateCrossword([currentSet], GRID_SIZE);
    setCrosswordData({ grid, placedWords, availableLetters });
    setRevealedWords([]);
    setMessage('');
  }, [wordSets, currentWordSetIndex]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleGuess = (guess) => {
    const foundWord = crosswordData.placedWords.find(
      (pw) => pw.word === guess && !revealedWords.some(rw => rw.id === pw.id)
    );

    if (foundWord) {
      setRevealedWords((prev) => [...prev, foundWord]);
      setScore((prev) => prev + guess.length * 15); // Slightly higher score
      setMessage(`Endless Mode: Correct! You found "${guess}"`);
      playCorrectSound();
      if (revealedWords.length + 1 === crosswordData.placedWords.length) {
        setMessage(`Endless Mode: All words found in this set! Moving to next...`);
        playWinSound();
        setTimeout(() => {
          setCurrentWordSetIndex((prev) => prev + 1);
        }, 1500);
      }
    } else {
      setScore((prev) => Math.max(0, prev - 3)); // Smaller penalty
      setMessage(`Endless Mode: "${guess}" is not a valid word or already found. Try again!`);
      playIncorrectSound();
    }
  };

  const handleHint = () => {
    if (hintsAvailable <= 0 || score < HINT_COST) {
      setMessage("Not enough hints or points for a hint.");
      return;
    }

    const unrevealedWords = crosswordData.placedWords.filter(
      (pw) => !revealedWords.some(rw => rw.id === pw.id)
    );

    if (unrevealedWords.length > 0) {
      const wordToReveal = unrevealedWords[Math.floor(Math.random() * unrevealedWords.length)];
      setRevealedWords((prev) => [...prev, wordToReveal]);
      setScore((prev) => Math.max(0, prev - HINT_COST));
      setHintsAvailable((prev) => prev - 1);
      setMessage(`Endless Mode: Hint used! Revealed word: "${wordToReveal.word}".`);
      playHintSound();
    } else {
      setMessage("No more words to reveal. You're too good!");
    }
  };

  const shuffleLetters = () => {
    const shuffled = [...crosswordData.availableLetters].sort(() => Math.random() - 0.5);
    setCrosswordData(prev => ({ ...prev, availableLetters: shuffled }));
    setMessage("Endless Mode: Letters shuffled! Maybe this helps.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-6xl w-full border border-purple-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
          Endless Anagram Challenge
        </h1>

        <div className="flex justify-end items-center mb-6">
          <ScoreDisplay score={score} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            {crosswordData.grid.length > 0 && (
              <CrosswordGrid grid={crosswordData.grid} revealedWords={revealedWords} />
            )}
            <AnimatePresence>
              {message && (
                <motion.p
                  className={`mt-4 p-3 rounded-lg font-semibold text-center w-full ${
                    message.includes('Correct') ? 'bg-green-800 text-green-200' :
                    message.includes('not a valid word') ? 'bg-red-800 text-red-200' :
                    'bg-blue-800 text-blue-200'
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
          </div>

          <div className="lg:w-1/3 flex flex-col gap-4">
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-blue-300 mb-4">Available Letters:</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {crosswordData.availableLetters.map((letter, index) => (
                  <motion.span
                    key={index}
                    className="px-4 py-2 bg-gray-700 text-gray-100 font-bold rounded-lg text-xl shadow-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
              <motion.button
                onClick={shuffleLetters}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shuffle className="w-5 h-5" />
                Shuffle Letters
              </motion.button>
            </div>

            <AnagramInput onGuess={handleGuess} availableLetters={crosswordData.availableLetters} />
            <HintButton onHint={handleHint} hintsAvailable={hintsAvailable} cost={HINT_COST} />

            <motion.button
              onClick={() => {
                setScore(0);
                setCurrentWordSetIndex(0);
                setHintsAvailable(5);
                initializeGame();
              }}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Restart Endless Game
            </motion.button>
            <BackButton to="/" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EndlessGame;