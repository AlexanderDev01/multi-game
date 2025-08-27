import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Clock, Award, Settings, Search, Lightbulb, Mic, Timer } from 'lucide-react';

const GameModeSelection = () => {
  const gameModes = [
    // {
    //   id: 'classic',
    //   name: 'Classic Anagram',
    //   description: 'Solve anagrams in a hidden crossword. Timed challenge!',
    //   icon: Brain,
    //   link: '/game/classic'
    // },
    {
      id: 'endless',
      name: 'Endless Challenge',
      description: 'No time limit, just pure anagram solving fun. How many can you find?',
      icon: Clock,
      link: '/game/endless'
    },
    {
      id: 'daily',
      name: 'Daily Puzzle',
      description: 'A new unique puzzle every day. Test your daily brain power!',
      icon: Award,
      link: '/game/daily'
    },
    {
      id: 'wordsearch',
      name: 'Word Search',
      description: 'Find hidden words in a grid. A classic brain teaser!',
      icon: Search,
      link: '/game/wordsearch'
    },
    {
      id: 'riddles',
      name: 'Riddle Me This',
      description: 'Sharpen your wit with challenging riddles. Can you guess them all?',
      icon: Lightbulb,
      link: '/game/riddles'
    },
    {
      id: 'karaoke',
      name: 'Karaoke Fun',
      description: 'Sing along to your favorite tunes and practice pronunciation!',
      icon: Mic,
      link: '/game/karaoke'
    },
    {
      id: 'timedchallenge',
      name: 'Timed Challenge',
      description: 'A rapid-fire word game against the clock. Speed and accuracy are key!',
      icon: Timer,
      link: '/game/timedchallenge'
    },
    {
      id: 'pronunciation',
      name: 'Pronunciation Practice',
      description: 'Improve your English pronunciation with interactive exercises.',
      icon: Mic, // Reusing icon, could be a different one
      link: '/game/pronunciation'
    },
    {
      id: 'custom',
      name: 'Custom Game',
      description: 'Configure your own game: grid size, word list, and more!',
      icon: Settings,
      link: '/game/custom'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-6xl w-full border border-purple-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-center text-white mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Choose Your Challenge, Mortal
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameModes.map((mode, index) => (
            <motion.div
              key={mode.id}
              className="bg-gray-700/70 border border-gray-600 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.03, borderColor: 'rgba(192, 132, 252, 0.5)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 + 0.3, duration: 0.5 }}
            >
              <mode.icon className="w-16 h-16 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">{mode.name}</h2>
              <p className="text-gray-300 mb-6">{mode.description}</p>
              <Link
                to={mode.link}
                className="mt-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Start Game
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default GameModeSelection;