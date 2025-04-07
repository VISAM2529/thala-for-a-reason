// app/api/submissions/[id]/route.js

import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid submission ID' }, { status: 400 });
  }

  try {
    await dbConnect();

    const submission = await Submission.findById(id);

    if (!submission) {
      return NextResponse.json({ message: 'Submission not found' }, { status: 404 });
    }

    // Increment view count (non-blocking)
    Submission.updateOne(
      { _id: submission._id },
      { $inc: { 'stats.views': 1 } }
    ).catch(console.error);

    // Convert Mongoose document to plain object and stringify ObjectIds
    const result = submission.toObject();
    result._id = result._id.toString();
    result.userInfo.userId = result.userInfo.userId.toString();

    if (result.stats?.likedBy) {
      result.stats.likedBy = result.stats.likedBy.map(id => id.toString());
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
