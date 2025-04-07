"use client"
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ShareDialog from '@/components/ShareDialog';
import Head from 'next/head';

const SubmissionDetail = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const loggedInUserId = session?.user?.id;

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await fetch(`/api/submission/${params.id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch submission');
        }
        const data = await res.json();
        setSubmission(data);
        setLikes(data?.stats?.likes || 0);
        
        // Increment view count
        await fetch('/api/submissions/view', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ submissionId: params.id }),
        });
      } catch (error) {
        console.error('Error fetching submission:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchSubmission();
    }
  }, [params.id]);

  useEffect(() => {
    if (submission && loggedInUserId && submission.stats.likedBy.includes(loggedInUserId)) {
      setHasLiked(true);
    }
  }, [loggedInUserId, submission]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-navy-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-4">Submission not found</h1>
        <Link href="/" className="bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-medium px-6 py-2 rounded-lg transition-colors">
          Go back home
        </Link>
      </div>
    );
  }

  const {
    _id: id,
    content: { input, userExplanation, systemExplanation },
    metadata: { createdAt },
    userInfo: { name: username, userId, imageUrl },
    stats: { views },
    verification: { isThala, verificationMethod }
  } = submission;

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleLike = async () => {
    if (isLiking || !loggedInUserId) return;

    setIsLiking(true);
    try {
      const response = await fetch('/api/submissions/like', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: id, userId: loggedInUserId }),
      });

      if (!response.ok) throw new Error('Failed to update like');

      const data = await response.json();
      setLikes(data.likes);
      setHasLiked(data.likedBy.includes(loggedInUserId));
    } catch (error) {
      console.error('Error liking submission:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  return (
    <>
      <Head>
        <title>{`${input} - Thala Submission by ${username}`}</title>
        <meta name="description" content={`${userExplanation} - Thala for a reason!`} />
        <meta property="og:title" content={`${input} - Thala Submission`} />
        <meta property="og:description" content={`${userExplanation} - Thala for a reason!`} />
        <meta property="og:type" content="website" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-yellow-50/50 to-white pt-16 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/" className="inline-flex items-center text-navy-700 hover:text-yellow-600 transition-colors mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to all submissions
          </Link>

          <motion.div
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-yellow-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isThala && (
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-navy-900 py-3 px-6 font-bold flex items-center justify-center space-x-2">
                <span className="text-base uppercase tracking-wider">Thala for a reason!</span>
                <span className="text-xl">🏆</span>
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-6">
                <Link href={`/profile/${userId}`} className="group">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-full flex items-center justify-center text-navy-900 font-bold shadow-md text-lg">
                      {username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-navy-900 group-hover:text-yellow-600 transition duration-300 text-lg">
                        {username || 'Anonymous'}
                      </span>
                      <span className="text-sm text-gray-500">{formattedDate}</span>
                    </div>
                  </div>
                </Link>
                
                {isThala && (
                  <div className="bg-navy-800 text-yellow-400 text-sm px-4 py-1.5 rounded-full font-medium">
                    Verified ✓
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">{input}</h1>
                <p className="text-xl text-gray-700 leading-relaxed">{userExplanation}</p>
                
                {systemExplanation && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
                    <p className="text-navy-800 italic">{systemExplanation}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <motion.button 
                    onClick={handleLike}
                    disabled={isLiking || !session}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-full transition-all duration-300 ${
                      hasLiked 
                        ? 'bg-yellow-100 text-yellow-600' 
                        : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600'
                    } ${!session ? 'opacity-70 cursor-not-allowed' : ''}`}
                    whileHover={session ? { scale: 1.05 } : {}}
                    whileTap={session ? { scale: 0.95 } : {}}
                  >
                    {hasLiked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.41 
                          4.42 3 7.5 3c1.74 0 3.41 1.01 4.22 2.09C12.09 
                          4.01 13.76 3 15.5 3 18.58 3 21 5.41 
                          21 8.5c0 3.78-3.4 6.86-8.55 
                          11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" 
                        strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" 
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 
                          1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 
                          3.75 3 5.765 3 8.25c0 7.22 9 12 9 
                          12s9-4.78 9-12z" />
                      </svg>
                    )}
                    <span className="font-medium">{likes}</span>
                  </motion.button>

                  <div className="flex items-center text-gray-500 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{views} views</span>
                  </div>
                </div>

                <motion.button 
                  onClick={handleShare}
                  className="flex items-center space-x-2 py-2 px-4 bg-navy-800 text-yellow-400 rounded-full font-medium hover:bg-navy-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  <span>Share</span>
                </motion.button>
              </div>
            </div>
            
            {isThala && (
              <motion.div 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-1"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8 }}
              />
            )}
          </motion.div>

          <div className="mt-12">
            <h2 className="text-xl font-bold text-navy-900 mb-6">More submissions you might like</h2>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Loading more submissions...</p>
              <Link href="/" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-navy-900 font-medium px-6 py-2 rounded-lg transition-colors">
                Browse all submissions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isShareOpen && (
          <ShareDialog 
            isOpen={isShareOpen} 
            onClose={() => setIsShareOpen(false)} 
            submission={submission} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SubmissionDetail;