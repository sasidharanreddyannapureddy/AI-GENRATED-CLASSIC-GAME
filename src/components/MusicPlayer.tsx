import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Sunny Day Adventure', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '6:12' },
  { id: 2, title: 'Happy Bounce', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '7:05' },
  { id: 3, title: 'Forest Walk', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '5:44' }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = 0.5;
    }
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleEnded = () => handleNext();
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
      else audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleNext = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setProgress(0); };
  const handlePrev = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setProgress(0); };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/50 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-10 h-10 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center shadow-inner">
          <Music size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{currentTrack.title}</p>
          <p className="text-xs text-gray-500">Game Soundtrack</p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-md flex flex-col gap-2">
        <div className="flex items-center justify-center gap-4">
          <button onClick={handlePrev} className="text-gray-400 hover:text-blue-500 transition-colors">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay} 
            className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button onClick={handleNext} className="text-gray-400 hover:text-blue-500 transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
