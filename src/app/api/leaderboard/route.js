import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';

// Recommended: Ensure these indexes exist in your MongoDB collection:
// 1. Submission.createIndex({ likes: -1 })
// 2. Submission.createIndex({ timestamp: -1 })

export async function GET(request) {
  // Set timeout for the entire operation (in milliseconds)
  const timeoutDuration = 8000; // 8 seconds
  let timeoutHandle;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error('Database operation timed out'));
    }, timeoutDuration);
  });

  try {
    // Get query parameters with validation
    const { searchParams } = new URL(request.url);
    const sort = ['popular', 'newest', 'random'].includes(searchParams.get('sort')) 
      ? searchParams.get('sort') 
      : 'popular';
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100); // Max 100 items

    // Connect to database with timeout
    await Promise.race([dbConnect(), timeoutPromise]);

    let submissions;
    if (sort === 'random') {
      // More efficient random sampling for large collections
      submissions = await Submission.aggregate([
        { $match: { /* any filters you might need */ } },
        { $sample: { size: limit } },
        { $project: { _id: 1, /* other fields you need */ } } // Only select necessary fields
      ]);
    } else {
      // Standard query with optimized sorting
      const sortConfig = sort === 'newest' 
        ? { timestamp: -1 } 
        : { likes: -1 };

      submissions = await Submission.find({})
        .sort(sortConfig)
        .limit(limit)
        .select('-__v') // Exclude unnecessary fields
        .lean()
        .maxTimeMS(5000); // MongoDB query timeout
    }

    // Clear the timeout if we succeeded
    clearTimeout(timeoutHandle);

    return NextResponse.json({ submissions });
    
  } catch (error) {
    // Clear timeout in case of error
    if (timeoutHandle) clearTimeout(timeoutHandle);

    console.error('Leaderboard error:', error.message);
    
    const status = error.message.includes('timed out') ? 504 : 500;
    return NextResponse.json(
      { error: status === 504 
        ? 'Request timeout. Please try again.' 
        : 'Failed to load leaderboard.' 
      },
      { status }
    );
  }
}