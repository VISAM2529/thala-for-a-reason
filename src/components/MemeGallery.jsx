"use client"
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function MemeGallery({ memes }) {
  const { data: session } = useSession();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memes?.map(meme => (
        <div key={meme._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition">
          <div className="relative">
            <img 
              src={meme?.imageUrl} 
              alt={meme.text} 
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-white font-bold text-lg">{meme.text}</p>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src={meme.userId?.image || '/default-user.png'} 
                  alt={meme.userId?.name} 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-300">{meme.userId?.name || 'Anonymous'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-500 transition"
                  onClick={() => handleLike(meme._id)}
                >
                  <span>❤️</span>
                  <span>{meme.likes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}