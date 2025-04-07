"use client";

import { useState, useEffect } from 'react';
import { generateThalaReason, isThalaWorthy } from '@/lib/thala-utils';

export default function ThalaPage() {
  const [examples, setExamples] = useState([
    { input: "1234567", reason: "1 + 2 + 3 + 4 + 5 + 6 + 7 = 28, not Thala worthy" },
    { input: "1132", reason: "1 + 1 + 3 + 2 = 7, Thala for a reason! 🏆" },
    { input: "MS Dhoni", reason: "MS Dhoni is THE original Thala! 🏆" },
    { input: "Rohit", reason: "Rohit has 5 letters, not Thala worthy" }
  ]);
  
  const [customInput, setCustomInput] = useState('');
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ checked: 0, thalaCount: 0 });
  
  const checkThala = () => {
    if (!customInput.trim()) return;
    
    const isThala = isThalaWorthy(customInput);
    const reason = generateThalaReason(customInput);
    
    setResult({
      input: customInput,
      isThala,
      reason: isThala ? reason : `${customInput} is not Thala worthy`
    });
    
    setStats(prev => ({
      checked: prev.checked + 1,
      thalaCount: prev.thalaCount + (isThala ? 1 : 0)
    }));
    
    setCustomInput('');
  };
  
  const thalaFacts = [
    "MS Dhoni wore jersey number 7 throughout his career",
    "Dhoni won 7 major ICC trophies as captain",
    "There are 7 letters in 'M S DHONI' without spaces",
    "Dhoni's ODI average was close to 50, 5+0=5, 5+2=7 (2 is for match winning shots)",
    "CSK won IPL in 2023, 2+0+2+3=7",
    "Cricket has 7 letters",
    "Mahi has 4 letters, Dhoni has 5, 4+5-2=7 (2 is for two names)"
  ];
  
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex(prev => (prev + 1) % thalaFacts.length);
    }, 7000); // Change fact every 7 seconds for Thala reason
    
    return () => clearInterval(interval);
  }, [thalaFacts.length]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">Thala For A Reason: Explained</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">What is "Thala for a Reason"?</h2>
          <p className="mb-4">
            "Thala for a Reason" is a popular meme in cricket culture that celebrates MS Dhoni (nicknamed "Thala", 
            which means leader in Tamil). Fans connect anything and everything to the number 7 (Dhoni's jersey number),
            often in humorous and far-fetched ways.
          </p>
          
          <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-300">
            <h3 className="font-semibold mb-2">Thala Fact #7:</h3>
            <p>{thalaFacts[currentFactIndex]}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Try It Yourself</h2>
          
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Type anything..."
              className="flex-grow p-2 border rounded"
            />
            <button
              onClick={checkThala}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Check
            </button>
          </div>
          
          {result && (
            <div className={`p-4 rounded-lg mb-4 ${result.isThala ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
              <p className="font-semibold">{result.input}</p>
              <p>{result.reason}</p>
              {result.isThala && <p className="text-xl mt-2">🏆 THALA FOR A REASON! 🏆</p>}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            Checked: {stats.checked} | Thala worthy: {stats.thalaCount}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Examples</h2>
          
          <div className="grid gap-4">
            {examples.map((example, index) => (
              <div key={index} className="p-3 border rounded">
                <p className="font-semibold">{example.input}</p>
                <p className="text-sm">{example.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}