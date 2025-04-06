// pages/api/submissions/like/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';

export async function PUT(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { submissionId, userId } = body;

    if (!submissionId || !userId) {
      return NextResponse.json({ error: 'Submission ID and User ID are required' }, { status: 400 });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const hasLiked = submission.stats.likedBy?.includes(userId);

    if (hasLiked) {
      // If already liked, remove the like (toggle off)
      submission.stats.likes -= 1;
      submission.stats.likedBy = submission.stats.likedBy.filter(id => id !== userId);
    } else {
      // If not yet liked, add like
      submission.stats.likes += 1;
      submission.stats.likedBy = [...(submission.stats.likedBy || []), userId];
    }

    await submission.save();

    return NextResponse.json({
      likes: submission.stats.likes,
      likedBy: submission.stats.likedBy,
    });
  } catch (error) {
    console.error('Error updating like count:', error);
    return NextResponse.json({ error: 'Failed to update like count', details: error.message }, { status: 500 });
  }
}
