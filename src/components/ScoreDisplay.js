import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const ScoreDisplay = ({ score }) => {
  return (
    <motion.div
      className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-md p-3 rounded-xl shadow-md border border-gray-700"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
      <span className="text-2xl font-bold text-purple-400">
        Score: {score}
      </span>
    </motion.div>
  );
};

export default ScoreDisplay;