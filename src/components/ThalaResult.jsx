import React, { useState } from 'react';
import Image from 'next/image';

const ThalaResult = ({ result, onTryAgain }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitToFeed = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          input: result.input,
          explanation: result.explanation,
          isThala: result.isThala 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit to feed');
      }
      
      setSubmitSuccess(true);
    } catch (error) {
      setError('Failed to submit to community feed. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className={`p-6 text-center ${result.isThala ? 'bg-yellow-100' : 'bg-gray-100'}`}>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
          {result.isThala ? (
            <Image src="/file.svg" alt="Success" width={40} height={40} />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-10 h-10 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          {result.isThala ? 'Thala for a reason! 🏏' : 'Not Thala 😔'}
        </h2>
        
        <p className="text-gray-700 text-lg mb-4">
          <span className="font-semibold">{result.input}</span>: {result.explanation}
        </p>
        
        {result.isThala && (
          <div className="py-4">
            <div className="w-full max-w-md mx-auto mb-4">
              <video 
                src="https://media.tenor.com/Mj-OC3OZi9IAAAAC/dhoni-thala.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        {!submitSuccess ? (
          <>
            {result.isThala && (
              <button
                onClick={handleSubmitToFeed}
                disabled={isSubmitting}
                className={`w-full py-3 mb-3 bg-yellow-500 text-white rounded-md font-medium hover:bg-yellow-600 transition duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Submitting...' : 'Share with community'}
              </button>
            )}

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            
            <button
              onClick={onTryAgain}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition duration-300"
            >
              Try again
            </button>
          </>
        ) : (
          <div className="text-center">
            <div className="mb-4 text-green-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Successfully shared!</span>
            </div>
            
            <button
              onClick={onTryAgain}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition duration-300"
            >
              Check another
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThalaResult;