import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

const ShareDialog = ({ isOpen, onClose, submission }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/submission/${submission._id}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareOptions = [
    { 
      name: 'Twitter', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=Check out this Thala submission!&url=${encodeURIComponent(shareUrl)}`
    },
    { 
      name: 'Facebook', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    { 
      name: 'WhatsApp', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(`Check out this Thala submission! ${shareUrl}`)}`
    }
  ];
  
  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-yellow-100"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-navy-900 py-3 px-6 flex justify-between items-center">
          <h3 className="font-bold">Share this submission</h3>
          <button 
            onClick={onClose}
            className="text-navy-800 hover:text-navy-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-5">
            <p className="text-sm text-gray-600 mb-2 font-medium">Share direct link</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 border border-yellow-200 rounded-lg px-3 py-2 text-sm bg-yellow-50 text-navy-900"
              />
              <motion.button 
                onClick={copyToClipboard}
                className="bg-navy-800 text-yellow-400 rounded-lg px-3 py-2 text-sm font-medium hover:bg-navy-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-3 font-medium">Share on social media</p>
            <div className="flex gap-3">
              {shareOptions.map((option) => (
                <motion.a 
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-navy-800">{option.icon}</div>
                  <span className="text-xs font-medium text-navy-900">{option.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
        
        <motion.div 
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
        />
      </motion.div>
    </motion.div>
  );
};

const ThalaCard = ({ submission }) => {
  const { data: session } = useSession();
  const loggedInUserId = session?.user?.id;

  const {
    _id: id,
    content: { input, userExplanation: explanation },
    metadata: { createdAt: timestamp },
    userInfo: { name: username, userId },
    stats: { likes: initialLikes, likedBy = [] },
    verification: { isThala }
  } = submission;

  const [likes, setLikes] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (loggedInUserId && likedBy.includes(loggedInUserId)) {
      setHasLiked(true);
    }
  }, [loggedInUserId, likedBy]);

  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const handleLike = async () => {
    if (isLiking || !loggedInUserId) return;

    setIsLiking(true);
    try {
      const response = await fetch('/api/submissions/like', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id, userId: loggedInUserId }),
      });

      if (!response.ok) throw new Error('Failed to update like');

      const data = await response.json();
      setLikes(data.likes);
      setHasLiked(data.likedBy.includes(loggedInUserId));
    } catch (error) {
      console.error('Error liking submission:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  return (
    <>
      <motion.div
        className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-lg overflow-hidden border border-yellow-100"
        whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        {isThala && (
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-navy-900 text-center py-2 font-bold flex items-center justify-center space-x-2">
            <span className="text-sm uppercase tracking-wider">Thala for a reason!</span>
            <span className="text-lg">🏆</span>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Link href={`/profile/${userId}`} className="group">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center text-navy-900 font-bold shadow-md">
                  {username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-navy-900 group-hover:text-yellow-600 transition duration-300">
                    {username || 'Anonymous'}
                  </span>
                  <span className="text-xs text-gray-500">{formattedDate}</span>
                </div>
              </div>
            </Link>
            
            {isThala && (
              <div className="bg-navy-800 text-yellow-400 text-xs px-3 py-1 rounded-full font-medium">
                Verified ✓
              </div>
            )}
          </div>

          <div className="mb-5">
            <h3 className="text-xl font-bold text-navy-900 mb-2">{input}</h3>
            <p className="text-gray-700 leading-relaxed">{explanation}</p>
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
            <motion.button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-2 py-2 px-4 rounded-full transition-all duration-300 ${
                hasLiked 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {hasLiked ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.41 
                    4.42 3 7.5 3c1.74 0 3.41 1.01 4.22 2.09C12.09 
                    4.01 13.76 3 15.5 3 18.58 3 21 5.41 
                    21 8.5c0 3.78-3.4 6.86-8.55 
                    11.54L12 21.35z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                  strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 
                    1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 
                    3.75 3 5.765 3 8.25c0 7.22 9 12 9 
                    12s9-4.78 9-12z" />
                </svg>
              )}
              <span className="font-medium">{likes}</span>
            </motion.button>

            <div className="flex items-center space-x-3">
              <motion.button 
                onClick={handleShare}
                className="text-gray-600 hover:text-yellow-600 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Share"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
              </motion.button>
              
              <motion.button 
                className="text-gray-600 hover:text-yellow-600 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
        
        {isHovering && isThala && (
          <motion.div 
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {isShareOpen && (
          <ShareDialog 
            isOpen={isShareOpen} 
            onClose={() => setIsShareOpen(false)} 
            submission={submission} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ThalaCard;