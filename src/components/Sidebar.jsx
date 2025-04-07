import React from 'react';
import Link from 'next/link';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  // Create a wrapper for Link that closes the sidebar when clicked
  const NavigationLink = ({ href, children }) => {
    return (
      <Link 
        href={href} 
        className="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-blue-800/50 transition-all duration-200 relative overflow-hidden"
        onClick={toggleSidebar} // Close sidebar when link is clicked
      >
        <div className="absolute left-0 top-0 h-full w-1 bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {children}
      </Link>
    );
  };

  return (
    <>
      {/* Backdrop overlay with subtle blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}
      
      {/* Sidebar with CSK theme */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-blue-900 to-blue-950 text-white shadow-2xl transform transition-all duration-500 ease-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } rounded-r-2xl overflow-hidden`}
      >
        {/* Decorative element - yellow stripe at top */}
        <div className="absolute top-0 w-full h-1 bg-yellow-400"></div>
        
        {/* Main content */}
        <div className="p-6 h-full flex flex-col">
          {/* Header with CSK branding */}
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-yellow-400 font-sans tracking-tight">THALA</span>
              <div className="bg-yellow-400 text-blue-900 text-xs font-bold px-2 py-1 rounded-md">
                FOR A REASON
              </div>
            </div>
            <button 
              onClick={toggleSidebar} 
              className="text-gray-400 hover:text-yellow-400 transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation with elegant hover effects */}
          <nav className="space-y-1 flex-1">
            <NavigationLink href="/">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-yellow-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Home</span>
            </NavigationLink>
            
            <NavigationLink href="/submit">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-yellow-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Submit</span>
            </NavigationLink>
            
            <NavigationLink href="/leaderboard">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-yellow-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="font-medium">Leaderboard</span>
            </NavigationLink>
            <NavigationLink href="/meme-generator">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-yellow-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Memes</span>
            </NavigationLink>
            <NavigationLink href="/profile/guest">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 text-yellow-400">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium">Profile</span>
            </NavigationLink>
          </nav>
          
          {/* Bottom CTA button with CSK branding */}
          <div className="pt-4 mt-6 border-t border-blue-800">
            <button className="w-full py-3 bg-yellow-400 text-blue-900 rounded-xl font-bold hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span>SUBSCRIBE NOW</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;