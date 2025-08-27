import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const HintButton = ({ onHint, hintsAvailable, cost }) => {
  return (
    <motion.button
      onClick={onHint}
      disabled={hintsAvailable <= 0}
      className={`px-6 py-3 rounded-xl font-bold text-lg flex items-center gap-2 transition-all duration-300
        ${hintsAvailable > 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
      whileHover={hintsAvailable > 0 ? { scale: 1.05 } : {}}
      whileTap={hintsAvailable > 0 ? { scale: 0.95 } : {}}
    >
      <Lightbulb className="w-5 h-5" />
      Hint ({hintsAvailable} left, -{cost} pts)
    </motion.button>
  );
};

export default HintButton;