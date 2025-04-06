import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // assuming you're using next-auth

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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <Link href={`/profile/${userId}`} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
              {username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-sm font-medium group-hover:text-yellow-600 transition duration-300">
              {username || 'Anonymous'}
            </span>
          </Link>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{input}</h3>
          <p className="text-gray-600">{explanation}</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center space-x-1 transition duration-300 ${
                hasLiked ? 'text-red-500' : 'text-gray-600 hover:text-yellow-600'
              }`}
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
                  strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" 
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 
                    1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 
                    3.75 3 5.765 3 8.25c0 7.22 9 12 9 
                    12s9-4.78 9-12z" />
                </svg>
              )}
              <span className="text-sm">{likes}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Share icons */}
          </div>
        </div>
      </div>

      {isThala && (
        <div className="bg-yellow-100 text-yellow-800 text-center py-1 text-sm font-medium">
          Thala for a reason! 🏏
        </div>
      )}
    </div>
  );
};

export default ThalaCard;
