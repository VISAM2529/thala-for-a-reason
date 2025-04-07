import { NextResponse } from 'next/server';
import Meme from '@/models/Meme';
import dbConnect from "@/lib/dbConnect";
import mongoose from 'mongoose'; // Add this import

export async function GET() {
  try {
    await dbConnect();
    const memes = await Meme.find().populate('userId', 'name image').sort({ createdAt: -1 });
    return NextResponse.json({ memes });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch memes' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    console.log('Database connected');
    
    const { imageUrl, text, userId } = await request.json();
    console.log('Received data:', { imageUrl, text, userId });

    // Validate required fields
    if (!imageUrl || !text || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const newMeme = new Meme({
      imageUrl,
      text,
      userId: new mongoose.Types.ObjectId(userId)
    });
    
    await newMeme.save();
    console.log('Meme saved successfully:', newMeme);
    
    return NextResponse.json({ 
      success: true,
      meme: newMeme 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error saving meme:', error);
    return NextResponse.json(
      { 
        error: 'Failed to share meme',
        details: error.message 
      },
      { status: 500 }
    );
  }
}