const directions = [
  [0, 1],   // Horizontal
  [1, 0],   // Vertical
  [1, 1],   // Diagonal abajo-derecha
  [1, -1],  // Diagonal abajo-izquierda
  [0, -1],  // Horizontal inversa
  [-1, 0],  // Vertical inversa
  [-1, -1], // Diagonal arriba-izquierda
  [-1, 1]   // Diagonal arriba-derecha
];

const generateWordSearch = (words, gridSize = 10) => {
  let grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill(''));

  const placedWords = [];

  const canPlaceWord = (word, row, col, dr, dc) => {
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dr;
      const newCol = col + i * dc;

      if (
        newRow < 0 || newRow >= gridSize ||
        newCol < 0 || newCol >= gridSize ||
        (grid[newRow][newCol] !== '' && grid[newRow][newCol] !== word[i])
      ) {
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
    placedWords.push({ word, cells });
  };

  // Sort words by length descending to place longer words first
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) { // Limit attempts to prevent infinite loops
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

  // Fill empty cells with random letters
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random uppercase letter
      }
    }
  }

  return { grid, placedWords };
};

export default generateWordSearch;