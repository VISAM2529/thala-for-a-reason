// src/app/profile/[userId]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ThalaCard from '@/components/ThalaCard';

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch(`/api/users/${userId}`);
        if (!profileResponse.ok) throw new Error('Failed to fetch user profile');
        const profileData = await profileResponse.json();
        
        // Fetch user submissions
        const submissionsResponse = await fetch(`/api/users/${userId}/submissions`);
        if (!submissionsResponse.ok) throw new Error('Failed to fetch submissions');
        const submissionsData = await submissionsResponse.json();
        
        setProfile(profileData.user);
        setSubmissions(submissionsData.submissions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user profile. Please try again later.');
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  // Simulate user profile for now - this would be replaced by actual data
  const userStats = {
    totalSubmissions: submissions.length,
    likes: submissions.reduce((sum, sub) => sum + (sub.likes || 0), 0),
    joinedDate: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-grow">
        <Sidebar />
        
        <div className="flex-grow p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 md:mb-0 md:mr-6">
                      {profile?.name?.charAt(0) || '?'}
                    </div>
                    
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{profile?.name || 'Anonymous User'}</h1>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Joined: {userStats.joinedDate}
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-lg">
                          <span className="block text-sm text-gray-600 dark:text-gray-300">Submissions</span>
                          <span className="block text-xl font-bold">{userStats.totalSubmissions}</span>
                        </div>
                        
                        <div className="bg-red-100 dark:bg-red-900 px-4 py-2 rounded-lg">
                          <span className="block text-sm text-gray-600 dark:text-gray-300">Likes Received</span>
                          <span className="block text-xl font-bold">{userStats.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">Submissions by {profile?.name || 'this user'}</h2>
                  
                  {submissions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This user hasn't shared any Thala connections yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {submissions.map((submission) => (
                        <ThalaCard key={submission._id} submission={submission} />
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            
            <div className="mt-8 text-center">
              <Link 
                href="/leaderboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Back to Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}