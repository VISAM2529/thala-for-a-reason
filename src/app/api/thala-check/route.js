// src/app/api/thala-check/route.js
import { NextResponse } from 'next/server';
import { checkThala } from '@/lib/thalaCheck';

export async function POST(request) {
  try {
    const body = await request.json();
    const { input } = body;
    
    // Validate input
    if (!input && input !== 0) {
      return NextResponse.json(
        { error: 'No input provided to check' },
        { status: 400 }
      );
    }
    
    // Use your thalaCheck utility to determine if the value is Thala-worthy
    const result = checkThala(input);
    
    return NextResponse.json({
      success: true,
      input: result.input,
      isThala: result.isThala,
      explanation: result.explanation
    }, { status: 200 });
    
  } catch (error) {
    console.error('Thala check error:', error);
    return NextResponse.json(
      { error: 'Failed to process Thala check' },
      { status: 500 }
    );
  }
}