"use client"
import { useState } from 'react';

export default function MemeForm({ memeText, onTextChange, onSubmit, isThala }) {
  const [isChecking, setIsChecking] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsChecking(true);
    
    // Simulate checking process
    setTimeout(() => {
      setIsChecking(false);
      onSubmit();
    }, 1000);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="memeText">
            Enter text or number to check if it&apos;s Thala worthy:
          </label>
          <input
            id="memeText"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={memeText}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Try '1234567' or 'MS Dhoni'"
          />
          <p className="text-sm text-gray-500 mt-1">
            Hint: 7 letters or digits that sum to 7 are Thala worthy!
          </p>
        </div>
        
        {memeText && (
          <div className="mb-4">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${isThala ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>
                {isThala 
                  ? "Thala for a reason! 🏆" 
                  : "Not Thala worthy yet... Try something else"}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={!isThala || isChecking}
            className={`${
              isThala && !isChecking 
                ? 'bg-blue-500 hover:bg-blue-700' 
                : 'bg-gray-400 cursor-not-allowed'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            {isChecking ? 'Checking...' : 'Generate Thala Meme'}
          </button>
        </div>
      </form>
    </div>
  );
}