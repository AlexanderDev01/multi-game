import React from 'react';
import { motion } from 'framer-motion';

const CrosswordGrid = ({ grid, revealedWords }) => {
  return (
    <div // Cambiado de motion.div a div para eliminar animaciones de movimiento del contenedor
      className="grid gap-0.5 p-4 bg-gray-900 rounded-xl shadow-inner"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`
      }}
    >
      {grid.flat().map((cell, index) => {
        const row = Math.floor(index / grid[0].length);
        const col = index % grid[0].length;
        const isRevealed = revealedWords.some(word =>
          word.cells.some(c => c.row === row && c.col === col)
        );

        let cellBgColor = 'bg-gray-700';
        let cellTextColor = 'text-gray-200';

        if (cell.char === '') {
          cellBgColor = 'bg-transparent';
          cellTextColor = '';
        } else if (isRevealed) {
          cellBgColor = 'bg-green-600';
          cellTextColor = 'text-white';
        } else {
          cellBgColor = 'bg-gradient-to-br from-gray-700 to-gray-800';
          cellTextColor = 'text-purple-300';
        }

        return (
          <div // Cambiado de motion.div a div para eliminar animaciones de movimiento de las celdas
            key={`${row}-${col}`}
            className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-lg sm:text-xl font-bold uppercase rounded-md transition-colors duration-200 ${cellBgColor} ${cellTextColor}`}
          >
            {isRevealed ? cell.char : (cell.char !== '' ? '?' : '')}
          </div>
        );
      })}
    </div>
  );
};

export default CrosswordGrid;