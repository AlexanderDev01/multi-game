import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ to = '/' }) => {
  const navigate = useNavigate();
  return (
    <motion.button
      onClick={() => navigate(to)}
      className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowLeft className="w-5 h-5" />
      Back
    </motion.button>
  );
};

export default BackButton;