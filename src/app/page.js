// pages/index.js
"use client"
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState('');
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  // Set launch date to 7 days from now (keeping with the Thala theme!)
  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 7);
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate - now;
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
      
      if (difference < 0) {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setError(error.message);
      setTimeout(() => setError(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex flex-col justify-center items-center px-4 text-white relative overflow-hidden">
      <Head>
        <title>Thala For A Reason - Coming Soon</title>
        <meta name="description" content="The ultimate Thala For A Reason meme app - coming soon!" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full opacity-10 blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        {/* Cricket ball pattern */}
        <div className="absolute top-1/4 right-10 w-4 h-4 bg-yellow-400 rounded-full opacity-30"></div>
        <div className="absolute top-1/3 left-20 w-6 h-6 bg-yellow-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-1/4 right-32 w-8 h-8 bg-yellow-400 rounded-full opacity-30"></div>
        <div className="absolute top-2/3 left-40 w-5 h-5 bg-yellow-400 rounded-full opacity-20"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:20px_20px] bg-repeat opacity-10"></div>
      </div>

      <div className="absolute top-10 left-0 right-0 flex justify-center z-50">
        <div className="px-6 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg animate-pulse">
          Coming Soon
        </div>
      </div>

      <main className="max-w-4xl mx-auto text-center relative z-10 backdrop-blur-sm rounded-3xl p-8 bg-white/5 shadow-2xl border border-white/10">
        <div className="mb-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-2 tracking-tight"
          >
            <span className="text-yellow-400 drop-shadow-md">THALA</span> FOR A <span className="text-yellow-400 drop-shadow-md">REASON</span>
          </motion.h1>
          
          <motion.div 
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
            className="absolute -top-16 -right-12 md:-right-16 h-32 w-32 rounded-full bg-yellow-400 flex items-center justify-center text-blue-900 text-6xl md:text-8xl font-bold shadow-xl"
          >
            7
          </motion.div>
        </div>
        
        <p className="text-xl md:text-2xl mb-10 text-blue-100 font-light max-w-2xl mx-auto">
          The ultimate meme app celebrating MS Dhoni and the legendary number 7 is coming soon!
        </p>
        
        {/* <div className="flex justify-center items-center space-x-4 md:space-x-6 mb-12">
          {Object.entries(countdown).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl p-3 w-16 md:w-24 h-16 md:h-24 flex items-center justify-center mb-2 shadow-lg border border-white/10">
                <span className="text-2xl md:text-4xl font-bold text-yellow-400">{value}</span>
              </div>
              <span className="text-xs md:text-sm uppercase tracking-wider text-blue-200 font-semibold">{unit}</span>
            </div>
          ))}
        </div>
         */}
        {/* <div className="mb-12 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
  <input
    type="email"
    placeholder="Enter your email for updates"
    className="flex-grow px-6 py-4 rounded-full bg-white/10 backdrop-blur border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-blue-200 shadow-inner"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    disabled={submitting}
    required
  />
  <button 
    type="submit" 
    className={`px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-blue-900 font-bold rounded-full hover:from-yellow-400 hover:to-yellow-300 transition duration-300 shadow-lg transform hover:scale-105 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
    disabled={submitting}
  >
    {submitting ? 'Submitting...' : 'Notify Me'}
  </button>
</form>
{submitted && (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-3 text-green-400 font-medium"
  >
    Thanks! We'll let you know when we launch!
  </motion.div>
)}
{error && (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-3 text-red-400 font-medium"
  >
    Error: {error}
  </motion.div>
)}
          {submitted && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-green-400 font-medium"
            >
              Thanks! We'll let you know when we launch!
            </motion.div>
          )}
        </div> */}
        
        <div className="flex justify-center space-x-6 mb-12">
          <a href="#" className="text-blue-200 hover:text-yellow-400 transition duration-300 transform hover:scale-110">
            <span className="sr-only">Twitter</span>
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" className="text-blue-200 hover:text-yellow-400 transition duration-300 transform hover:scale-110">
            <span className="sr-only">Instagram</span>
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-blue-200 hover:text-yellow-400 transition duration-300 transform hover:scale-110">
            <span className="sr-only">YouTube</span>
            <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent w-full max-w-sm"></div>
          <div className="mx-4">
            <svg className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" />
              <path d="M12 7a1 1 0 011 1v4a1 1 0 01-1 1 1 1 0 010-2V8a1 1 0 011-1z" />
              <circle cx="12" cy="16" r="1" />
            </svg>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent w-full max-w-sm"></div>
        </div>
        
        <p className="text-sm text-blue-300">
          © {new Date().getFullYear()} Thala For A Reason. All rights reserved.
        </p>
      </main>
    </div>
  );
}