"use client";

import { useEffect, useState } from 'react';

export default function ThalaCheck({ isThala, onAnimationEnd }) {
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    // Initialize audio object
    const bgm = new Audio('/sounds/thala-bgm.mp3');
    setAudio(bgm);
    
    // Clean up on unmount
    return () => {
      if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
      }
    };
  }, []);
  
  useEffect(() => {
    if (isThala && audio) {
      setIsPlaying(true);
      audio.play();
      
      // Set timeout to match the BGM duration (approximately 7 seconds)
      const timer = setTimeout(() => {
        setIsPlaying(false);
        audio.pause();
        audio.currentTime = 0;
        onAnimationEnd();
      }, 7000);
      
      return () => clearTimeout(timer);
    }
  }, [isThala, audio, onAnimationEnd]);
  
  if (!isThala || !isPlaying) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="text-center">
        <div className="text-7xl font-bold text-yellow-400 animate-bounce mb-4">7️⃣</div>
        <h2 className="text-5xl font-bold text-white mb-6 animate-pulse">THALA FOR A REASON!</h2>
        <img 
          src="/images/ms-dhoni.jpg" 
          alt="MS Dhoni - Thala" 
          className="w-64 h-64 object-cover rounded-full mx-auto animate-spin-slow"
        />
        <div className="mt-4 text-xl text-white">
          {Array(7).fill("🏆").join(" ")}
        </div>
      </div>
    </div>
  );
}