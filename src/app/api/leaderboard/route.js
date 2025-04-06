import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'popular'; // Default sorting by popularity
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Connect to the database
    const db = await connectToDatabase();
    const submissionsCollection = db.collection('submissions');
    // Create sort configuration
    let sortConfig = {};
    if (sort === 'newest') {
      sortConfig = { timestamp: -1 };
    } else if (sort === 'popular') {
      sortConfig = { likes: -1 };
    } else if (sort === 'random') {
      // For random sorting in MongoDB, we can use $sample aggregation
      const randomSubmissions = await submissionsCollection
        .aggregate([
          { $sample: { size: limit } }
        ])
        .toArray();
        
      return NextResponse.json({
        submissions: randomSubmissions
      });
    }
    
    // Fetch submissions with sorting and limit
    const submissions = await submissionsCollection
      .find({})
      .sort(sortConfig)
      .limit(limit)
      .toArray();
    
    return NextResponse.json({
      submissions
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to load the leaderboard. Please try again later.' },
      { status: 500 }
    );
  }
}