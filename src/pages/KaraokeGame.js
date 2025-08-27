import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { motion } from 'framer-motion';
import BackButton from '../components/BackButton';
import { karaokeSongs } from '../mock/wordSets';
import useSound from '../hooks/useSound';
import { Play, Pause, SkipForward, Volume2, VolumeX } from 'lucide-react';

// Dummy audio files for demonstration
// In a real app, these would be actual song files
const songAudioFiles = {
  "Bohemian Rhapsody": "/sounds/bohemian_rhapsody.mp3", // You need to provide these files
  "Imagine": "/sounds/imagine.mp3"
};

const KaraokeGame = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7); // Default volume
  const audioRef = useRef(null); // Use useRef for audio element

  const playCorrectSound = useSound('/sounds/correct.mp3'); // Placeholder for pronunciation feedback
  const playIncorrectSound = useSound('/sounds/incorrect.mp3'); // Placeholder

  const currentSong = karaokeSongs[currentSongIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const songSrc = songAudioFiles[currentSong.title];
    if (songSrc) {
      audioRef.current = new Audio(songSrc);
      audioRef.current.volume = volume;
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentLineIndex(0);
        // Optionally move to next song or show score
      };
    } else {
      audioRef.current = null; // No audio for this song
      console.warn(`No audio file found for ${currentSong.title}. Karaoke will only show lyrics.`);
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
    }

    // Simulate lyric progression if no actual audio
    let lyricTimer;
    if (isPlaying && !songSrc) {
      lyricTimer = setInterval(() => {
        setCurrentLineIndex(prev => {
          if (prev < currentSong.lyrics.length - 1) {
            return prev + 1;
          } else {
            clearInterval(lyricTimer);
            setIsPlaying(false);
            return 0; // Reset to first line
          }
        });
      }, 3000); // Simulate 3 seconds per line
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (lyricTimer) clearInterval(lyricTimer);
    };
  }, [currentSongIndex, currentSong.title, currentSong.lyrics, isPlaying, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    setIsPlaying(prev => {
      if (audioRef.current) {
        if (prev) {
          audioRef.current.pause();
        } else {
          audioRef.current.play().catch(e => console.error("Error playing audio:", e));
        }
      }
      return !prev;
    });
  };

  const nextSong = () => {
    if (audioRef.current) audioRef.current.pause();
    setCurrentSongIndex(prev => (prev + 1) % karaokeSongs.length);
    setCurrentLineIndex(0);
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setVolume(prev => (prev === 0 ? 0.7 : 0)); // Toggle between 0.7 and 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black flex items-center justify-center p-4">
      <motion.div
        className="bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-4xl w-full border border-purple-800"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-center text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-red-500">
          Karaoke Fun!
        </h1>

        <motion.div
          className="bg-gray-700/70 border border-gray-600 rounded-2xl p-6 mt-6 text-center shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">{currentSong.title}</h2>
          <p className="text-gray-300 text-xl mb-6">{currentSong.artist}</p>

          <div className="h-32 overflow-hidden mb-6">
            {currentSong.lyrics.map((line, index) => (
              <motion.p
                key={index}
                className={`text-2xl font-semibold ${index === currentLineIndex ? 'text-pink-400' : 'text-gray-400'} ${index < currentLineIndex ? 'opacity-50' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {line}
              </motion.p>
            ))}
          </div>

          <div className="flex justify-center items-center gap-4 mb-6">
            <motion.button
              onClick={togglePlayPause}
              className="p-4 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </motion.button>
            <motion.button
              onClick={nextSong}
              className="p-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SkipForward className="w-8 h-8" />
            </motion.button>
            <motion.button
              onClick={toggleMute}
              className="p-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {volume === 0 ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
            </motion.button>
          </div>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </motion.div>

        <div className="mt-8 flex justify-center">
          <BackButton to="/" />
        </div>
      </motion.div>
    </div>
  );
};

export default KaraokeGame;