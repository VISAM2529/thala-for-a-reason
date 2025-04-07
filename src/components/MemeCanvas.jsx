"use client";

export default function MemeCanvas({ memeUrl, text }) {
  return (
    <div className="flex flex-col items-center w-full">
      <img 
        src={memeUrl} 
        alt={`Thala meme: ${text}`}
        className="max-w-full border-4 border-yellow-500 rounded-lg shadow-lg"
      />
    </div>
  );
}