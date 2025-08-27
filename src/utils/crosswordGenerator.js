const generateCrossword = (wordSets, gridSize = 15) => { // Increased grid size
  let grid = Array(gridSize)
    .fill(null)
    .map(() => Array(gridSize).fill({ char: '', wordId: null }));

  const placedWords = [];
  const availableLetters = new Set();

  const directions = [
    [0, 1],   // Horizontal
    [1, 0]    // Vertical
  ];

  const canPlaceWord = (word, row, col, dr, dc) => {
    if (word.length === 0) return false;
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return false;

    // Check if word fits within grid boundaries
    if (row + (word.length - 1) * dr >= gridSize || col + (word.length - 1) * dc >= gridSize ||
        row + (word.length - 1) * dr < 0 || col + (word.length - 1) * dc < 0) {
      return false;
    }

    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dr;
      const newCol = col + i * dc;

      // Check for conflicts with existing letters
      if (grid[newRow][newCol].char !== '' && grid[newRow][newCol].char !== word[i]) {
        return false;
      }

      // Ensure no adjacent words unless they cross
      // Check cells perpendicular to the word's direction
      if (dr === 0) { // Horizontal word
        // Check above and below
        if (newRow > 0 && grid[newRow - 1][newCol].char !== '' && grid[newRow - 1][newCol].wordId !== grid[newRow][newCol].wordId) return false;
        if (newRow < gridSize - 1 && grid[newRow + 1][newCol].char !== '' && grid[newRow + 1][newCol].wordId !== grid[newRow][newCol].wordId) return false;
      } else { // Vertical word
        // Check left and right
        if (newCol > 0 && grid[newRow][newCol - 1].char !== '' && grid[newRow][newCol - 1].wordId !== grid[newRow][newCol].wordId) return false;
        if (newCol < gridSize - 1 && grid[newRow][newCol + 1].char !== '' && grid[newRow][newCol + 1].wordId !== grid[newRow][newCol].wordId) return false;
      }
    }
    return true;
  };

  const placeWord = (word, row, col, dr, dc, wordId) => {
    const cells = [];
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dr;
      const newCol = col + i * dc;
      grid[newRow][newCol] = { char: word[i], wordId: wordId };
      cells.push({ row: newRow, col: newCol });
    }
    placedWords.push({ word: word, cells: cells, id: wordId });
  };

  let wordIdCounter = 0;
  for (const wordSet of wordSets) {
    const mainWord = wordSet.main.toUpperCase();
    const anagrams = wordSet.anagrams.map(a => a.toUpperCase());
    
    // Add letters of the main word to available letters
    mainWord.split('').forEach(char => availableLetters.add(char));

    let placedMain = false;
    let attempts = 0;
    while (!placedMain && attempts < 200) { // Increased attempts for better placement
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];

      if (canPlaceWord(mainWord, row, col, dr, dc)) {
        placeWord(mainWord, row, col, dr, dc, wordIdCounter++);
        placedMain = true;
      }
      attempts++;
    }

    // Try to place anagrams, prioritizing crossing with existing words
    for (const anagram of anagrams) {
      let placedAnagram = false;
      let anagramAttempts = 0;
      while (!placedAnagram && anagramAttempts < 200) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];

        let intersectionCount = 0;
        let tempGrid = JSON.parse(JSON.stringify(grid)); // Deep copy for testing placement

        if (canPlaceWord(anagram, row, col, dr, dc)) {
          // Check for intersections
          for (let i = 0; i < anagram.length; i++) {
            const newRow = row + i * dr;
            const newCol = col + i * dc;
            if (tempGrid[newRow][newCol].char === anagram[i]) {
              intersectionCount++;
            }
          }

          // Only place if there's at least one intersection or if it's the first word in the set
          if (intersectionCount >= 1 || placedWords.length === 0) {
            placeWord(anagram, row, col, dr, dc, wordIdCounter++);
            placedAnagram = true;
          }
        }
        anagramAttempts++;
      }
    }
  }

  return { grid, placedWords, availableLetters: Array.from(availableLetters).sort() };
};

export default generateCrossword;