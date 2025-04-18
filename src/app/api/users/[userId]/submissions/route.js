import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { userId } = params;

    if (!userId) {
      return new Response(JSON.stringify({
        error: 'User ID is required'
      }), {
        status: 400
      });
    }

    // Find all submissions by this user using the nested userId field
    const submissions = await Submission.find({ 'userInfo.userId': userId })
      .sort({ 'metadata.createdAt': -1 }) // Sort by the correct nested field
      .lean();

    return new Response(JSON.stringify({
      submissions
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching user submissions:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch user submissions',
      details: error.message
    }), {
      status: 500
    });
  }
}