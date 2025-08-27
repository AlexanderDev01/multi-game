import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackButton from '../components/BackButton';
import { wordSearchWords } from '../mock/wordSets';
import useSound from '../hooks/useSound';

const generateWordSearchGrid = (words, gridSize = 15) => {
  let grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(''));

  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal down-right
    [1, -1],  // Diagonal down-left
  ];

  const placedWords = [];

  const canPlaceWord = (word, row, col, dr, dc) => {
    if (word.length === 0) return false;
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return false;

    if (row + (word.length - 1) * dr >= gridSize || col + (word.length - 1) * dc >= gridSize ||
        row + (word.length - 1) * dr < 0 || col + (word.length - 1) * dc < 0) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dr;
      const newCol = col + i * dc;
      if (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (word, row, col, dr, dc) => {
    const cells = [];
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dr;
      const newCol = col + i * dc;
      grid[newRow][newCol] = word[i];
      cells.push({ row: newRow, col: newCol });
    }
    placedWords.push({ word: word, cells: cells });
  };

  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];

      if (canPlaceWord(word, row, col, dr, dc)) {
        placeWord(word, row, col, dr, dc);
        placed = true;
      }
      attempts++;
    }
  }

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return { grid, placedWords };
};

const WordSearchGame = () => {
  const [gridData, setGridData] = useState({ grid: [], placedWords: [] });
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [message, setMessage] = useState('');
  const [wordsToFind, setWordsToFind] = useState(wordSearchWords);

  const playCorrectSound = useSound('/sounds/correct.mp3');
  const playIncorrectSound = useSound('/sounds/incorrect.mp3');
  const playWinSound = useSound('/sounds/win.mp3');

  const initializeGame = useCallback(() => {
    const { grid, placedWords } = generateWordSearchGrid(wordsToFind, 15);
    setGridData({ grid, placedWords });
    setSelectedCells([]);
    setFoundWords([]);
    setMessage('');
  }, [wordsToFind]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCellClick = (row, col) => {
    const newSelectedCells = [...selectedCells, { row, col }];
    setSelectedCells(newSelectedCells);

    if (newSelectedCells.length > 1) {
      checkWord(newSelectedCells);
    }
  };

  const checkWord = (currentSelection) => {
    const selectedWordChars = currentSelection
      .map((cell) => gridData.grid[cell.row][cell.col])
      .join('');

    let found = false;
    for (const placedWord of gridData.placedWords) {
      const originalWord = placedWord.word;
      const reversedWord = originalWord.split('').reverse().join('');

      if ((selectedWordChars === originalWord || selectedWordChars === reversedWord) && !foundWords.includes(originalWord)) {
        // Basic check for now, full path validation would be more complex
        setFoundWords((prev) => [...prev, originalWord]);
        setMessage(`Word Search: Found "${originalWord}"!`);
        playCorrectSound();
        found = true;
        break;
      }
    }

    setSelectedCells([]); // Reset selection after checking
    if (!found && selectedWordChars.length > 1) {
      setMessage('Word Search: Not a valid word. Keep looking!');
      playIncorrectSound();
    }
  };

  useEffect(() => {
    if (foundWords.length === wordsToFind.length && wordsToFind.length > 0) {
      setMessage('Word Search: Congratulations! You found all words!');
      playWinSound();
    }
  }, [foundWords, wordsToFind, playWinSound]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-6xl w-full border border-purple-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
          Word Search Challenge
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center">
            {gridData.grid.length > 0 && (
              <motion.div
                className="grid gap-0.5 p-4 bg-gray-900 rounded-xl shadow-inner"
                style={{
                  gridTemplateColumns: `repeat(${gridData.grid[0].length}, minmax(0, 1fr))`
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {gridData.grid.flat().map((char, index) => {
                  const row = Math.floor(index / gridData.grid[0].length);
                  const col = index % gridData.grid[0].length;
                  const isSelected = selectedCells.some(
                    (cell) => cell.row === row && cell.col === col
                  );
                  const isFound = foundWords.some(word =>
                    gridData.placedWords.find(pw => pw.word === word)?.cells.some(c => c.row === row && c.col === col)
                  );

                  return (
                    <motion.div
                      key={`${row}-${col}`}
                      className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-lg sm:text-xl font-bold uppercase rounded-md cursor-pointer transition-colors duration-200
                        ${isFound ? 'bg-green-600 text-white shadow-md' : isSelected ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                      onClick={() => handleCellClick(row, col)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {char}
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
            <AnimatePresence>
              {message && (
                <motion.p
                  className={`mt-4 p-3 rounded-lg font-semibold text-center w-full ${
                    message.includes('Found') || message.includes('Congratulations') ? 'bg-green-800 text-green-200' :
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
          </div>

          <div className="lg:w-1/3 flex flex-col gap-4">
            <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-green-300 mb-4">Words to Find:</h2>
              <ul className="grid grid-cols-2 gap-2">
                {wordsToFind.map((word, index) => (
                  <motion.li
                    key={word}
                    className={`text-lg font-medium p-2 rounded-md transition-all duration-300
                      ${foundWords.includes(word) ? 'line-through text-gray-500 bg-gray-700' : 'text-gray-100 bg-gray-600'}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                  >
                    {word}
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.button
              onClick={initializeGame}
              className="mt-4 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Word Search
            </motion.button>
            <BackButton to="/" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WordSearchGame;