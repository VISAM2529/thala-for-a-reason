"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemeForm from '@/components/MemeForm';
import MemeCanvas from '@/components/MemeCanvas';
import ThalaCheck from '@/components/ThalaCheck';
import { useSession } from 'next-auth/react';

export default function Home() {
  const [memeText, setMemeText] = useState('');
  const [generatedMeme, setGeneratedMeme] = useState(null);
  const [isThala, setIsThala] = useState(false);
  const [showThalaAnimation, setShowThalaAnimation] = useState(false);
  const [memes, setMemes] = useState([]);
  const [view, setView] = useState('gallery'); // 'gallery' or 'generator'
  const [isSharing, setIsSharing] = useState(false);
  const [selectedMeme, setSelectedMeme] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const { data: session } = useSession();
  console.log(memes)
  // Fetch memes from the community
  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await fetch('/api/memes');
        const data = await response.json();
        setMemes(data.memes);
      } catch (error) {
        console.error('Error fetching memes:', error);
      }
    };
    
    fetchMemes();
  }, []);

  // Add ESC key listener for closing popup
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && selectedMeme) {
        setSelectedMeme(null);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [selectedMeme]);

  const checkIfThala = (text) => {
    // Check if sum of digits is 7
    if (/^\d+$/.test(text)) {
      const sum = text.split('').reduce((a, b) => a + parseInt(b), 0);
      return sum === 7;
    }
    
    // Check if number of letters is 7
    if (isNaN(text)) {
      return text.replace(/\s/g, '').length === 7;
    }
    
    return false;
  };
  
  const handleTextChange = (text) => {
    setMemeText(text);
    setIsThala(checkIfThala(text));
  };
  
  const generateMeme = async () => {
    if (isThala) {
      setShowThalaAnimation(true);
      
      try {
        const response = await fetch('/api/generate-meme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: memeText }),
        });
        
        const data = await response.json();
        if (data.success) {
          setGeneratedMeme(data.memeUrl);
          setView('generator');
        } else {
          alert('Failed to generate meme');
        }
      } catch (error) {
        console.error('Error generating meme:', error);
      }
    }
  };

  const shareToCommunity = async () => {
    if (!session) {
      alert('Please sign in to share memes');
      return;
    }

    setIsSharing(true);
    try {
      const response = await fetch('/api/memes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          imageUrl: generatedMeme,
          text: memeText,
          userId: session.user.id 
        }),
      });
      
      const data = await response.json();
      setMemes([data.meme, ...(memes || [])]);
      setView('gallery');
      alert('Meme shared to community!');
    } catch (error) {
      console.error('Error sharing meme:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleMemeClick = (meme) => {
    setSelectedMeme(meme);
  };

  const handleLikeMeme = async (e, meme) => {
    e.stopPropagation();
    
    if (!session) {
      alert('Please sign in to like memes');
      return;
    }
    
    if (isLiking) return;
    setIsLiking(true);
    
    // Optimistic update - immediately update UI before API response
    const isAlreadyLiked = meme.likedBy?.includes(session?.user?.id);
    const newLikeCount = isAlreadyLiked ? (meme.likes - 1) : (meme.likes + 1);
    const newLikedBy = isAlreadyLiked 
      ? meme.likedBy.filter(id => id !== session?.user?.id)
      : [...(meme.likedBy || []), session?.user?.id];
    
    // Update the memes state immediately for better UX
    const updatedMemes = memes.map(m => {
      if (m._id === meme._id) {
        return { 
          ...m, 
          likes: newLikeCount,
          likedBy: newLikedBy
        };
      }
      return m;
    });
    
    setMemes(updatedMemes);
    
    // Also update selectedMeme if it's the one being liked
    if (selectedMeme && selectedMeme._id === meme._id) {
      setSelectedMeme({
        ...selectedMeme,
        likes: newLikeCount,
        likedBy: newLikedBy
      });
    }
    
    try {
      const response = await fetch(`/api/memes/${meme._id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });
      
      const data = await response.json();
      
      // If API returns different data than expected, sync back with server
      if (data.success && (data.likes !== newLikeCount || JSON.stringify(data.likedBy) !== JSON.stringify(newLikedBy))) {
        const serverUpdatedMemes = memes.map(m => {
          if (m._id === meme._id) {
            return { 
              ...m, 
              likes: data.likes,
              likedBy: data.likedBy 
            };
          }
          return m;
        });
        
        setMemes(serverUpdatedMemes);
        
        if (selectedMeme && selectedMeme._id === meme._id) {
          setSelectedMeme({
            ...selectedMeme,
            likes: data.likes,
            likedBy: data.likedBy
          });
        }
      }
    } catch (error) {
      console.error('Error liking meme:', error);
      // Revert optimistic update on error
      setMemes(prevMemes => prevMemes.map(m => {
        if (m._id === meme._id) {
          const originalLikes = isAlreadyLiked ? meme.likes : (meme.likes || 0);
          return { 
            ...m, 
            likes: originalLikes,
            likedBy: meme.likedBy || []
          };
        }
        return m;
      }));
      
      if (selectedMeme && selectedMeme._id === meme._id) {
        setSelectedMeme({
          ...selectedMeme,
          likes: meme.likes,
          likedBy: meme.likedBy
        });
      }
      
      alert('Failed to update like status. Please try again.');
    } finally {
      setIsLiking(false);
    }
  };

  // Format date for displaying
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-900 to-navy-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Thala for a Reason
        </motion.h1>
        
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex space-x-4 bg-navy-700 p-1.5 rounded-full shadow-xl">
            <motion.button
              onClick={() => setView('gallery')}
              className={`px-8 py-3 rounded-full transition font-medium ${
                view === 'gallery' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-navy-900' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
              whileHover={{ scale: view === 'gallery' ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Community Memes
            </motion.button>
            <motion.button
              onClick={() => setView('generator')}
              className={`px-8 py-3 rounded-full transition font-medium ${
                view === 'generator' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-navy-900' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
              whileHover={{ scale: view === 'generator' ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Meme
            </motion.button>
          </div>
        </motion.div>

        {view === 'gallery' ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {memes.map((meme, index) => (
              <motion.div
                key={meme.id || index}
                className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-lg overflow-hidden border border-yellow-100 cursor-pointer"
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                onClick={() => handleMemeClick(meme)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-navy-900 text-center py-2 font-bold flex items-center justify-center space-x-2">
                  <span className="text-sm uppercase tracking-wider">Thala for a reason!</span>
                  <span className="text-lg">🏆</span>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center text-navy-900 font-bold shadow-md">
                        {meme.userId?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-yellow-500">
                          {meme.userId?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-500">{meme.createdAt ? formatDate(meme.createdAt) : 'Recently'}</span>
                      </div>
                    </div>
                    
                    <div className="bg-navy-800 text-yellow-400 text-xs px-3 py-1 rounded-full font-medium">
                      Verified ✓
                    </div>
                  </div>

                  <div className="rounded-lg overflow-hidden mb-4 aspect-video bg-gray-200">
                    <img 
                      src={meme.imageUrl} 
                      alt={meme.text || "Thala meme"} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-navy-900 mb-2">{meme.text}</h3>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <button 
                      className="flex items-center space-x-2 py-2 px-4 rounded-full bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-600 transition-colors duration-200"
                      onClick={(e) => handleLikeMeme(e, meme)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        className={`w-5 h-5 ${meme.likedBy?.includes(session?.user?.id) ? 'fill-red-500 text-red-500' : 'fill-none text-current'}`}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" 
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 
                          1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 
                          3.75 3 5.765 3 8.25c0 7.22 9 12 9 
                          12s9-4.78 9-12z" />
                      </svg>
                      <span className="font-medium">{meme.likes || 0}</span>
                    </button>

                    <div className="flex items-center space-x-3">
                      <button 
                        className="text-gray-600 hover:text-yellow-600 transition-colors duration-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Share functionality can be added here
                          navigator.clipboard.writeText(window.location.origin + '/meme/' + meme.id);
                          alert('Meme link copied to clipboard!');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {!generatedMeme ? (
              <motion.div 
                className="bg-gradient-to-br from-navy-800 to-navy-700 p-8 rounded-xl shadow-2xl border border-navy-600"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <MemeForm 
                  memeText={memeText} 
                  onTextChange={handleTextChange} 
                  onSubmit={generateMeme} 
                  isThala={isThala}
                />
              </motion.div>
            ) : (
              <motion.div 
                className="bg-gradient-to-br from-navy-800 to-navy-700 p-8 rounded-xl shadow-2xl border border-navy-600"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Your Thala Meme
                </h2>
                <div className="rounded-lg overflow-hidden mb-6 border-4 border-yellow-400">
                  <MemeCanvas memeUrl={generatedMeme} text={memeText} />
                </div>
                
                <div className="mt-8 flex flex-wrap justify-center gap-6">
                  <motion.button
                    onClick={() => setGeneratedMeme(null)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Another
                  </motion.button>
                  <motion.a 
                    href={generatedMeme} 
                    download="thala-meme.png"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download Meme
                  </motion.a>
                  <motion.button
                    onClick={shareToCommunity}
                    disabled={isSharing}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-navy-900 px-8 py-3 rounded-lg font-medium shadow-lg disabled:opacity-50"
                    whileHover={{ scale: isSharing ? 1 : 1.05, boxShadow: isSharing ? "none" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: isSharing ? 1 : 0.95 }}
                  >
                    {isSharing ? 'Sharing...' : 'Share to Community'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {showThalaAnimation && (
          <ThalaCheck isThala={isThala} onAnimationEnd={() => setShowThalaAnimation(false)} />
        )}
      </div>

      {/* Improved Full-screen meme popup */}
      <AnimatePresence>
        {selectedMeme && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMeme(null)}
          >
            <motion.div 
              className="relative bg-navy-800 bg-opacity-50 rounded-xl p-6 max-w-5xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                className="absolute top-2 right-2 text-white hover:text-yellow-400 transition-colors bg-navy-900 bg-opacity-60 rounded-full p-2 z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedMeme(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="md:flex-1 w-full">
                  <img 
                    src={selectedMeme.imageUrl} 
                    alt={selectedMeme.text || "Thala meme"} 
                    className="w-full h-auto max-h-[60vh] object-contain rounded-lg shadow-2xl"
                  />
                </div>
                
                <motion.div 
                  className="md:flex-1 w-full bg-navy-800 bg-opacity-70 p-4 rounded-lg max-h-[60vh] overflow-y-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">{selectedMeme.text}</h3>
                  
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center text-navy-900 font-bold shadow-md">
                      {selectedMeme.userId?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">
                        {selectedMeme.userId?.name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-300">{selectedMeme.createdAt ? formatDate(selectedMeme.createdAt) : 'Recently'}</span>
                    </div>
                  </div>
                  
                  <div className="bg-navy-700 p-4 rounded-lg mb-4">
                    <div className="text-yellow-400 text-lg font-medium mb-2 flex items-center">
                      <span className="mr-2">Thala for a reason!</span>
                      <span className="text-xl">🏆</span>
                    </div>
                    <p className="text-gray-300">
                      This meme follows the sacred "Thala" rule - either the sum of digits equals 7 or the number of characters equals 7!
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 border-t border-navy-600 pt-4">
                    <button 
                      className="flex items-center space-x-2 py-2 px-6 rounded-full bg-navy-700 hover:bg-navy-600 text-white transition-colors duration-200"
                      onClick={(e) => handleLikeMeme(e, selectedMeme)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        strokeWidth={2} 
                        className={`w-6 h-6 ${selectedMeme.likedBy?.includes(session?.user?.id) ? 'fill-red-500 text-red-500' : 'fill-none text-current'}`}
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" 
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 
                          1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 
                          3.75 3 5.765 3 8.25c0 7.22 9 12 9 
                          12s9-4.78 9-12z" />
                      </svg>
                      <span className="font-medium">{selectedMeme.likes || 0} Likes</span>
                    </button>

                    <button 
                      className="flex items-center space-x-2 py-2 px-6 rounded-full bg-navy-700 hover:bg-navy-600 text-white transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(window.location.origin + '/meme/' + selectedMeme._id);
                        alert('Meme link copied to clipboard!');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                      </svg>
                      <span className="font-medium">Share</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}