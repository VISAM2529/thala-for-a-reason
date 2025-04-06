import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';

export async function GET(request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'popular';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Connect to the database
    await dbConnect();

    // Create sort configuration
    let sortConfig = {};
    if (sort === 'newest') {
      sortConfig = { timestamp: -1 };
    } else if (sort === 'popular') {
      sortConfig = { likes: -1 };
    } else if (sort === 'random') {
      // Random using MongoDB aggregation
      const randomSubmissions = await Submission.aggregate([
        { $sample: { size: limit } }
      ]);

      return NextResponse.json({
        submissions: randomSubmissions,
      });
    }

    // Fetch submissions with sorting and limit
    const submissions = await Submission.find({})
      .sort(sortConfig)
      .limit(limit)
      .lean(); // .lean() for plain JS objects (faster)

    return NextResponse.json({
      submissions,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Failed to load the leaderboard. Please try again later.' },
      { status: 500 }
    );
  }
}
