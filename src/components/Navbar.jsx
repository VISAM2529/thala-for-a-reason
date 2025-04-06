import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = ({ toggleSidebar }) => {
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-40 transition-all duration-300 ${
      scrolled ? 'bg-blue-900/95 shadow-lg backdrop-blur-sm' : 'bg-blue-900'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-yellow-400 text-blue-900 p-1 rounded-lg transform transition-transform group-hover:rotate-6">
              <span className="text-2xl font-extrabold">T</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-yellow-400">Thala</span>
              <span className="text-xs text-yellow-200 font-medium">for a reason</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-yellow-400 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all hover:after:w-full">
              Home
            </Link>
            <Link href="/submit" className="text-white hover:text-yellow-400 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all hover:after:w-full">
              Submit
            </Link>
            <Link href="/leaderboard" className="text-white hover:text-yellow-400 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-yellow-400 after:transition-all hover:after:w-full">
              Leaderboard
            </Link>
          </div>

          {/* Right Side - Profile & Mobile Menu */}
          <div className="flex items-center space-x-6">
            <Link href="/profile/guest" className="flex items-center space-x-2 hover:text-yellow-300 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-blue-900 shadow-md">
                <span className="text-sm font-bold">G</span>
              </div>
              <span className="hidden md:inline font-medium">Profile</span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleSidebar} 
              className="md:hidden bg-blue-800 hover:bg-blue-700 text-yellow-400 p-2 rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;