import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';

export async function GET(request) {
  try {
    await dbConnect();

    const submissions = await Submission.find({})

    return NextResponse.json({
      success: true,
      data: submissions,
      meta: {
        returned: submissions.length,
      },
    });
  } catch (error) {
    console.error('Leaderboard error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load leaderboard.',
        fallbackData: [], // Returning empty array as fallback
      },
      { status: 500 }
    );
  }
}