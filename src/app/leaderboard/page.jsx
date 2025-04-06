'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ThalaCard from '@/components/ThalaCard';

export default function Leaderboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('newest'); // newest, popular, random

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/leaderboard?sort=${filter}`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        
        const data = await response.json();
        setSubmissions(data.submissions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load the leaderboard. Please try again later.');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [filter]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center sm:text-left"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Thala Leaderboard 🏆
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Discover the most creative Thala connections shared by our community!
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8"
      >
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              Browse Submissions
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Filter by newest, most popular, or find random submissions
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('newest')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'newest' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setFilter('popular')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'popular' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Most Popular
            </button>
            <button
              onClick={() => setFilter('random')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === 'random' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Random
            </button>
          </div>
        </div>
      </motion.div>
      
      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center min-h-[300px]"
        >
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading awesome Thala connections...</p>
          </div>
        </motion.div>
      ) : error ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 px-6 py-4 rounded-xl shadow-md"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </motion.div>
      ) : submissions?.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
        >
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">No submissions yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Be the first to share your Thala connection and start the leaderboard!
          </p>
          <Link 
            href="/submit" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-colors shadow-md"
          >
            Submit Now
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              <span className="font-semibold">{submissions?.length}</span> Thala connections found
            </p>
            <Link 
              href="/submit" 
              className="inline-flex items-center px-5 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium text-sm transition-colors shadow-md"
            >
              Submit Yours
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions?.map((submission, index) => (
              <motion.div
                key={submission._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ThalaCard submission={submission} />
              </motion.div>
            ))}
          </div>
        </>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-16 text-center"
      >
        <Link 
          href="/" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
        <Link 
          href="/submit" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Create Your Own
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}