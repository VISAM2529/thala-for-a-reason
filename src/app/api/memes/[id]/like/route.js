import { NextResponse } from 'next/server';
import Meme from '@/models/Meme';
import dbConnect from "@/lib/dbConnect"

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const { userId } = await request.json();
    const memeId = await params.id;
    
    const meme = await Meme.findById(memeId);
    console.log(meme)
    if (!meme) {
      return NextResponse.json(
        { error: 'Meme not found' },
        { status: 404 }
      );
    }
    
    // Check if user already liked
    const alreadyLiked = meme.likedBy.includes(userId);
    
    if (alreadyLiked) {
      // Unlike
      meme.likes -= 1;
      meme.likedBy = meme.likedBy.filter(id => id.toString() !== userId);
    } else {
      // Like
      meme.likes += 1;
      meme.likedBy.push(userId);
    }
    
    await meme.save();
    
    return NextResponse.json({ meme });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to like meme' },
      { status: 500 }
    );
  }
}