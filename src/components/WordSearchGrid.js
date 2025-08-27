import React from 'react';
import { motion } from 'framer-motion';

const WordSearchGrid = ({ grid, selectedCells, onCellClick }) => {
  return (
    <motion.div
      className="grid gap-0.5 p-4 bg-blue-100 rounded-xl shadow-inner"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {grid.flat().map((char, index) => {
        const row = Math.floor(index / grid[0].length);
        const col = index % grid[0].length;
        const isSelected = selectedCells.some(
          (cell) => cell.row === row && cell.col === col
        );

        return (
          <motion.div
            key={`${row}-${col}`}
            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-lg sm:text-xl font-bold uppercase rounded-md cursor-pointer transition-colors duration-200
              ${isSelected ? 'bg-blue-400 text-white shadow-md' : 'bg-blue-200 text-blue-800 hover:bg-blue-300'}`}
            onClick={() => onCellClick(row, col)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {char}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default WordSearchGrid;