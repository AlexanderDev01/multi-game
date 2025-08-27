import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const AnagramInput = ({ onGuess, availableLetters }) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim()) {
      onGuess(guess.trim().toUpperCase());
      setGuess('');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex gap-3 mt-6 p-4 bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder={`Use these letters: ${availableLetters.join(', ')}`}
        className="flex-1 px-5 py-3 bg-gray-700 border border-gray-600 rounded-xl text-lg font-medium text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
      />
      <motion.button
        type="submit"
        disabled={!guess.trim()}
        className={`px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-all duration-300
          ${guess.trim() ? 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-md hover:shadow-lg hover:scale-105' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
        whileHover={guess.trim() ? { scale: 1.05 } : {}}
        whileTap={guess.trim() ? { scale: 0.95 } : {}}
      >
        <Send className="w-5 h-5" />
        Guess
      </motion.button>
    </motion.form>
  );
};

export default AnagramInput;