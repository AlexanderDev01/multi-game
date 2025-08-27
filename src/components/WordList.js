import React from 'react';
import { motion } from 'framer-motion';

const WordList = ({ words, foundWords }) => {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-blue-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Palabras a Encontrar:</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {words.map((word, index) => (
          <motion.li
            key={word}
            className={`text-lg font-medium p-2 rounded-md transition-all duration-300
              ${foundWords.includes(word) ? 'line-through text-gray-500 bg-green-100' : 'text-blue-900 bg-blue-50'}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
          >
            {word.toUpperCase()}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default WordList;