import React from 'react';
import Link from 'next/link';

const ThalaCard = ({ submission }) => {
  const { id, input, explanation, timestamp, username, likes, userId } = submission;
  
  // Format date
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <Link href={`/profile/${userId}`} className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold">
              {username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-sm font-medium group-hover:text-yellow-600 transition duration-300">{username || 'Anonymous'}</span>
          </Link>
          <span className="text-xs text-gray-500">{formattedDate}</span>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{input}</h3>
          <p className="text-gray-600">{explanation}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-yellow-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="text-sm">{likes || 0}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="text-gray-600 hover:text-yellow-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 0m-3.935 0l-9.566-5.314m0 0a2.25 2.25 0 10-3.935 0" />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-blue-600 transition duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-100 text-yellow-800 text-center py-1 text-sm font-medium">
        Thala for a reason! 🏏
      </div>
    </div>
  );
};

export default ThalaCard;