import React, { useState } from 'react';
import ThalaResult from './ThalaResult';

const SubmitForm = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('Please enter something to check');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/thala-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputText }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check input');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setInputText('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {!result ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Thala Check</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="thalaInput" className="block text-sm font-medium text-gray-700 mb-1">
                Enter name, number, or anything
              </label>
              <input
                id="thalaInput"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition"
                placeholder="MS Dhoni, 7, Seven, etc."
              />
            </div>
            
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded-md font-medium text-white bg-yellow-500 hover:bg-yellow-600 transition duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Checking...' : 'Check'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Check if your input equals 7 in any way!</p>
            <p>Thala for a reason 🏏</p>
          </div>
        </div>
      ) : (
        <ThalaResult result={result} onTryAgain={handleTryAgain} />
      )}
    </div>
  );
};

export default SubmitForm;