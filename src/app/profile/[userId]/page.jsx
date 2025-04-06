'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { User, Calendar, FileText, Heart, LogOut, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ThalaCard from '@/components/ThalaCard';
import Image from 'next/image';

export default function UserProfile() {
  const { userId } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  console.log(submissions)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user profile
        const profileResponse = await fetch(`/api/users/${userId}`);
        if (!profileResponse.ok) throw new Error('Failed to fetch user profile');
        const profileData = await profileResponse.json();
        
        // Fetch user submissions
        const submissionsResponse = await fetch(`/api/users/${userId}/submissions`);
        if (!submissionsResponse.ok) throw new Error('Failed to fetch submissions');
        const submissionsData = await submissionsResponse.json();
        
        setProfile(profileData);
        setSubmissions(submissionsData.submissions || []);
        
        // Check if viewing user is profile owner
        const currentSession = await fetch('/api/auth/session');
        const sessionData = await currentSession.json();
        setIsOwner(sessionData?.user?.id === userId);
        
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // User statistics
  const userStats = {
    totalSubmissions: submissions?.length || 0,
    likes: submissions?.reduce((sum, sub) => sum + (sub?.likes || 0), 0) || 0,
    joinedDate: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'
  };

  // Generate gradient colors based on user ID for uniqueness
  const generateGradient = (id) => {
    if (!id) return 'linear-gradient(135deg, #667eea, #764ba2)';
    const hash = String(id).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 80%, 55%), hsl(${hue2}, 80%, 45%))`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-grow">
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="max-w-6xl mx-auto mt-8 px-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-sm">
                <p className="font-medium">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Hero banner with profile info */}
              <div 
                className="w-full text-white py-12 px-4"
                style={{ background: generateGradient(userId) }}
              >
                <div className="max-w-6xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-12">
                    <div className="relative">
                      {profile?.image ? (
                        <Image
                          width={1920}
                          height={1080} 
                          src={profile.image} 
                          alt={profile.name} 
                          className="w-32 h-32 rounded-full shadow-lg border-4 border-white object-cover"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center text-blue-600 text-5xl font-bold border-4 border-white">
                          {profile?.name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <h1 className="text-3xl md:text-4xl font-bold">
                        {profile?.name || 'Anonymous User'}
                      </h1>
                      <div className="flex items-center gap-2 mt-2 text-white/80">
                        <Calendar size={16} />
                        <span>Joined {userStats.joinedDate}</span>
                      </div>
                    </div>
                    
                    {isOwner && (
                      <div className="flex gap-3 mt-4 md:mt-0">
                        <button 
                          onClick={() => router.push('/settings')}
                          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
                        >
                          <Settings size={18} />
                          <span>Edit Profile</span>
                        </button>
                        
                        <button 
                          onClick={handleSignOut}
                          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Stats cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                        <User size={24} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Name</p>
                        <p className="font-semibold text-lg">{profile?.name || 'Anonymous'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                        <FileText size={24} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Submissions</p>
                        <p className="font-semibold text-lg">{userStats.totalSubmissions}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md border-2 border-yellow-400 dark:border-yellow-500 relative">
    <div className="absolute -top-3 -right-3 bg-yellow-400 dark:bg-yellow-500 text-gray-900 font-bold rounded-full w-8 h-8 flex items-center justify-center">
      {userStats.likes}
    </div>
    <div className="flex items-center gap-4">
      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
        <Heart size={24} className="text-yellow-600 dark:text-yellow-400" />
      </div>
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Total Likes</p>
        <p className="font-semibold text-2xl">{userStats.likes}</p>
      </div>
    </div>
  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                        <Calendar size={24} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Member Since</p>
                        <p className="font-semibold text-lg">{userStats.joinedDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Submissions section */}
                <div className="mb-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                      Submissions by {profile?.name || 'this user'}
                    </h2>
                    
                    {isOwner && (
                      <Link 
                        href="/submit" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors font-medium"
                      >
                        New Submission
                      </Link>
                    )}
                  </div>
                  
                  {submissions.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <FileText size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        {isOwner ? (
                          <>
                            You haven't shared any Thala connections yet.
                            <span className="block mt-4">
                              <Link 
                                href="/submit" 
                                className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Create your first submission
                              </Link>
                            </span>
                          </>
                        ) : (
                          'This user hasn\'t shared any Thala connections yet.'
                        )}
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
                
                <div className="flex justify-center py-6">
                  <Link 
                    href="/leaderboard" 
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-3 px-6 rounded-lg shadow-sm transition-colors"
                  >
                    Back to Leaderboard
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}