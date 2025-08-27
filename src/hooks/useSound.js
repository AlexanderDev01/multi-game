import { useEffect, useState } from 'react';

const useSound = (src) => {
  const [audio, setAudio] = useState(null);

  useEffect(() => {
    const newAudio = new Audio(src);
    newAudio.volume = 0.7; // Default volume
    setAudio(newAudio);

    return () => {
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, [src]);

  const play = () => {
    if (audio) {
      audio.currentTime = 0; // Rewind to start
      audio.play().catch(error => console.error("Error playing sound:", error));
    }
  };

  return play;
};

export default useSound;