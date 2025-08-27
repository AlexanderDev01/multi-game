import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameModeSelection from './pages/GameModeSelection';
// import ClassicGame from './pages/ClassicGame'; // Removed ClassicGame import
import EndlessGame from './pages/EndlessGame';
import DailyPuzzleGame from './pages/DailyPuzzleGame';
import WordSearchGame from './pages/WordSearchGame';
import RiddlesGame from './pages/RiddlesGame';
import KaraokeGame from './pages/KaraokeGame';
import TimedChallengeGame from './pages/TimedChallengeGame';
import PronunciationPractice from './pages/PronunciationPractice';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GameModeSelection />} />
        {/* <Route path="/game/classic" element={<ClassicGame />} /> Removed ClassicGame route */}
        <Route path="/game/endless" element={<EndlessGame />} />
        <Route path="/game/daily" element={<DailyPuzzleGame />} />
        <Route path="/game/wordsearch" element={<WordSearchGame />} />
        <Route path="/game/riddles" element={<RiddlesGame />} />
        <Route path="/game/karaoke" element={<KaraokeGame />} />
        <Route path="/game/timedchallenge" element={<TimedChallengeGame />} />
        <Route path="/game/pronunciation" element={<PronunciationPractice />} />
        {/* Custom Game Mode will be more complex, so leaving as placeholder for now */}
        <Route path="/game/custom" element={<div>Custom Game Mode Coming Soon!</div>} />
      </Routes>
    </Router>
  );
};

export default App;