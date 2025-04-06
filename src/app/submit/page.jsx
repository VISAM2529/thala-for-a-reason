'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ThalaResult from '@/components/ThalaResult';
import { MESSAGES, PLACEHOLDERS } from '@/constants/message';

// Enhanced SubmitForm component
const SubmitForm = ({ name, setName, input, explanation, setExplanation, onSubmit, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mt-6"
    >
      <h2 className="text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
        Share your Thala connection with the community
      </h2>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div>
          <label htmlFor="thala-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Thala Connection
          </label>
          <input
            id="thala-input"
            type="text"
            value={input}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 transition-all"
            readOnly
          />
          <p className="mt-1 text-sm text-green-600 dark:text-green-400">
            ✓ Verified Thala connection
          </p>
        </div>
        
        <div>
          <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Share Your Story
          </label>
          <textarea
            id="explanation"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all"
            placeholder="Tell us why this Thala connection is special to you..."
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 shadow-md"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Your Thala Connection'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default function Submit() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [explanation, setExplanation] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Check if there's a thala result in local storage from the homepage check
  useEffect(() => {
    const savedResult = localStorage.getItem('thalaResult');
    if (savedResult) {
      try {
        const parsedResult = JSON.parse(savedResult);
        setCheckResult(parsedResult);
        setInput(parsedResult.input || '');
      } catch (e) {
        console.error('Error parsing saved result:', e);
        localStorage.removeItem('thalaResult');
      }
    }
  }, []);

  const checkThala = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/thala-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      
      const data = await response.json();
      setCheckResult(data);
      
      // If not Thala, show message
      if (!data.isThala) {
        setSubmitStatus({
          success: false,
          message: 'This is not Thala for a reason. Try something else!'
        });
        setTimeout(() => setSubmitStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error checking Thala:', error);
      setSubmitStatus({
        success: false,
        message: 'Failed to check. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !name.trim() || !explanation.trim() || !checkResult?.isThala) return;

    setLoading(true);
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          input,
          explanation
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus({
          success: true,
          message: 'Your Thala reason has been submitted successfully!'
        });
        
        // Clear form and redirect to leaderboard after delay
        setTimeout(() => {
          localStorage.removeItem('thalaResult');
          router.push('/leaderboard');
        }, 2000);
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setSubmitStatus({
        success: false,
        message: error.message || 'Failed to submit. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center sm:text-left"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Submit your Thala Reason
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          Share your unique connection between your input and the magical number 7 with the Thala community!
        </p>
      </motion.div>
      
      {!checkResult?.isThala ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-8"
        >
          <div className="md:flex md:items-center md:space-x-8">
            <div className="md:w-1/3 mb-6 md:mb-0 text-center">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">Step 1</h2>
              <p className="text-gray-500 dark:text-gray-400">Verify your Thala connection</p>
            </div>
            
            <div className="md:w-2/3">
              <form onSubmit={checkThala} className="space-y-4">
                <div>
                  <label htmlFor="thala-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter something to check
                  </label>
                  <div className="flex">
                    <input
                      id="thala-input"
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-grow px-4 py-3 rounded-l-lg border-2 border-r-0 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder={PLACEHOLDERS.SEARCH_THALA}
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 md:px-12 rounded-r-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold transition-all hover:opacity-90 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking
                        </span>
                      ) : (
                        'Verify'
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Try a name, number, word, or phrase to find its Thala connection!
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mb-6">
            <ThalaResult result={checkResult} />
          </div>
          
          {checkResult.isThala && (
            <>
              <div className="flex items-center justify-center space-x-6 py-6">
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
              </div>
              
              <SubmitForm
                name={name}
                setName={setName}
                input={input}
                explanation={explanation}
                setExplanation={setExplanation}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </>
          )}
        </motion.div>
      )}
      
      {submitStatus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mt-6 p-4 rounded-xl shadow-md ${
            submitStatus.success 
              ? 'bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' 
              : 'bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
          }`}
        >
          <div className="flex items-center">
            {submitStatus.success ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {submitStatus.message}
          </div>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 text-center"
      >
        <Link 
          href="/leaderboard" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          View Leaderboard
          <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}