import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { checkThala } from '@/lib/thalaCheck';
import { z } from 'zod';
import Submission from '@/models/Submission';
import mongoose from 'mongoose'; // Import mongoose directly

// Define schema for submission validation
const submissionSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9_ ]*$/, "Name can only contain letters, numbers, and spaces"),
  input: z.string().min(1, "Input cannot be empty"),
  explanation: z.string()
    .min(10, "Explanation must be at least 10 characters")
    .max(500, "Explanation cannot exceed 500 characters"),
  userId: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable()
});

export async function POST(request) {
  try {
    const body = await request.json();

    // Log request body for debugging
    console.log('Submission request body:', body);

    // Ensure input is always a string
    const processedBody = {
      ...body,
      input: String(body.input)
    };

    // Validate inputs against schema
    const validation = submissionSchema.safeParse(processedBody);
    if (!validation.success) {
      console.error('Validation failed:', validation.error.issues);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues
        },
        { status: 400 }
      );
    }

    const { name, input, explanation, userId, imageUrl } = validation.data;

    // Check if the input is Thala-worthy
    const thalaResult = checkThala(input);

    // If not Thala, reject the submission
    if (!thalaResult.isThala) {
      return NextResponse.json(
        {
          error: 'Submission is not Thala for a reason!',
          thalaResult,
          suggestion: "Try a combination that adds up to 7 or has 7 letters/numbers"
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB using Mongoose
    await dbConnect();

    // Create submission using Mongoose model
    const submissionData = {
      userInfo: {
        name,
        imageUrl: imageUrl || null,
        userId: userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null, // Validate and conditionally add userId
      },
      content: {
        input: input,
        userExplanation: explanation,
        systemExplanation: thalaResult.explanation
      },
      verification: {
        isThala: thalaResult.isThala,
        verificationMethod: thalaResult.method || 'unknown',
        verifiedAt: new Date()
      },
      stats: {
        likes: 0,
        views: 0,
        shares: 0
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'published'
      }
    };

    const submission = new Submission(submissionData);

    // Save the submission to the database
    const savedSubmission = await submission.save();

    return NextResponse.json({
      success: true,
      message: 'Thala submission received successfully!',
      submissionId: savedSubmission._id,
      thalaResult,
      preview: {
        name,
        explanation,
        input: input
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process submission',
        systemError: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}