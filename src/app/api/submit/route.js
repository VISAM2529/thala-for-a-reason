// src/app/api/submit/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import { checkThala } from '@/lib/thalaCheck';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, input, explanation } = body;
    
    // Validate inputs
    if (!name || (!input && input !== 0) || !explanation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if the input is Thala-worthy
    const thalaResult = checkThala(input);
    
    // If not Thala, reject the submission
    if (!thalaResult.isThala) {
      return NextResponse.json(
        { error: 'Submission is not Thala for a reason!', thalaResult },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const db = await connectToDatabase()
    
    // Create submission document
    const submission = {
      name,
      input: thalaResult.input,
      userExplanation: explanation,
      systemExplanation: thalaResult.explanation,
      isThala: thalaResult.isThala,
      createdAt: new Date()
    };
    
    // Store the submission in the database
    const result = await db.collection('submissions').insertOne(submission);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thala submission received successfully!',
      id: result.insertedId,
      thalaResult
    }, { status: 200 });
    
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}