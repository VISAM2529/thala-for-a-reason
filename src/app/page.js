'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MESSAGES, PLACEHOLDERS } from '@/constants/message';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      setResult(data);
    } catch (error) {
      console.error('Error checking Thala:', error);
      setResult({ error: 'Failed to check. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail) return;

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail })
      });
      
      const data = await response.json();
      setSubscribeStatus(data.success ? 'success' : 'error');
      if (data.success) {
        setSubscribeEmail('');
        setTimeout(() => setSubscribeStatus(null), 3000);
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      setSubscribeStatus('error');
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* Navigation */}
      {/* <nav className="sticky top-0 z-10 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Thala
                </span>
                <span className="ml-1 text-sm px-2 py-1 bg-yellow-400 text-gray-900 rounded-md">7</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/leaderboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Leaderboard
              </Link>
              <Link href="/submit" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                Submit
              </Link>
              <Link 
                href="/about" 
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
              >
                About Thala
              </Link>
            </div>
          </div>
        </div>
      </nav> */}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            Thala for a Reason! 🏏
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Find your connection to Thala's magical number 7
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8">
              <form onSubmit={checkThala} className="relative">
                <div className="flex">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full px-5 py-4 text-lg rounded-l-xl border-2 border-r-0 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                    placeholder={PLACEHOLDERS.SEARCH_THALA}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 md:px-12 rounded-r-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg transition-all hover:opacity-90 disabled:opacity-50"
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
                      'Check'
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Try a name, number, word, or phrase to find its Thala connection!
                </p>
              </form>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto mt-8"
            >
              <div className={`p-6 rounded-xl shadow-lg ${
                result.isThala 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : 'bg-white dark:bg-gray-800'
              }`}>
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">
                    {result.isThala ? 'Thala Confirmed! 🎉' : 'Not a Thala Connection'}
                  </h2>
                  <p className="text-lg mb-4">{result.reason}</p>
                  
                  {result.isThala && (
                    <div className="mt-6 flex justify-center">
                      <Link 
                        href="/submit" 
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-gray-900 bg-yellow-400 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                      >
                        Share your Thala reason!
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Instant Results</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get immediate feedback on your Thala connection with our advanced algorithm
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Join the Community</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Share your unique Thala connections with fans worldwide
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Compete & Win</h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your submissions on the leaderboard and earn Thala points
              </p>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-16"
        >
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12">
                <h3 className="text-2xl font-bold text-white mb-2">Stay in the loop</h3>
                <p className="text-blue-100 mb-6">
                  Subscribe to get weekly updates on the latest Thala connections and cricket news
                </p>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <input
                      type="email"
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-700 dark:text-white"
                      placeholder={PLACEHOLDERS.EMAIL}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 rounded-lg shadow-sm bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium transition-colors"
                  >
                    Subscribe Now
                  </button>
                  
                  {subscribeStatus === 'success' && (
                    <p className="mt-2 text-green-300 text-center">
                      {MESSAGES.SUBSCRIPTION_SUCCESS}
                    </p>
                  )}
                  
                  {subscribeStatus === 'error' && (
                    <p className="mt-2 text-red-300 text-center">
                      {MESSAGES.SUBSCRIPTION_ERROR}
                    </p>
                  )}
                </form>
              </div>
              <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-700 to-purple-700 p-12">
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white mb-2">7</div>
                    <div className="text-blue-100">The magical number</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <Link 
            href="/leaderboard" 
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            View Thala Leaderboard
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      {/* <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Thala
              </span>
              <span className="ml-1 text-xs px-1.5 py-0.5 bg-yellow-400 text-gray-900 rounded-md">7</span>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex justify-center md:justify-end space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 md:flex md:items-center md:justify-between">
            <div className="text-sm text-gray-500 text-center md:text-left">
              &copy; {new Date().getFullYear()} Thala for a Reason. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-600">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-600">
                Terms
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-600">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}