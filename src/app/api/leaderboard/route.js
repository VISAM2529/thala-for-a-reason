import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';
import { unstable_cache } from 'next/cache';

// Cached data fetcher with 60-second revalidation
const getCachedLeaderboardData = unstable_cache(
  async (sort, limit) => {
    await dbConnect();
    
    if (sort === 'random') {
      return await Submission.aggregate([
        { $match: { approved: true } }, // Only show approved submissions
        { $sample: { size: limit } },
        { $project: { _id: 1, title: 1, author: 1, likes: 1, timestamp: 1 } }
      ]).maxTimeMS(5000);
    }

    const sortConfig = sort === 'newest' 
      ? { timestamp: -1 } 
      : { likes: -1, timestamp: -1 }; // Secondary sort for consistency

    return await Submission.find({ approved: true })
      .sort(sortConfig)
      .limit(limit)
      .select('_id title author likes timestamp')
      .lean()
      .maxTimeMS(5000);
  },
  ['leaderboard-data'],
  { revalidate: 60 }
);

export async function GET(request) {
  const timeoutDuration = 8000; // 8 seconds total timeout
  let timeoutHandle;

  try {
    // Parse and validate parameters
    const { searchParams } = new URL(request.url);
    const sort = ['popular', 'newest', 'random'].includes(searchParams.get('sort')) 
      ? searchParams.get('sort') 
      : 'popular';
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100);

    // Set timeout
    const timeoutPromise = new Promise((_, reject) => {
      timeoutHandle = setTimeout(() => {
        reject(new Error('Database operation timed out'));
      }, timeoutDuration);
    });

    // Get data with timeout protection
    const submissions = await Promise.race([
      getCachedLeaderboardData(sort, limit),
      timeoutPromise
    ]);

    clearTimeout(timeoutHandle);

    return NextResponse.json({ 
      success: true,
      data: submissions,
      meta: {
        sort,
        limit,
        returned: submissions.length,
        cached: true // Indicates if coming from cache
      }
    });

  } catch (error) {
    if (timeoutHandle) clearTimeout(timeoutHandle);

    console.error('Leaderboard error:', error.message);
    
    const status = error.message.includes('timed out') ? 504 : 500;
    return NextResponse.json(
      { 
        success: false,
        error: status === 504 
          ? 'Request timeout. Please try again.' 
          : 'Failed to load leaderboard.',
        fallbackData: await getFallbackData() // Implement this function
      },
      { status }
    );
  }
}

// Fallback data in case of failures
async function getFallbackData() {
  try {
    // Try to get cached data even if DB is down
    const cache = await caches.default;
    const response = await cache.match('leaderboard-fallback');
    if (response) return await response.json();
    
    // Default empty data
    return [];
  } catch {
    return [];
  }
}