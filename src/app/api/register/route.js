// src/app/api/register/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

// Recommended indexes:
// User.createIndex({ email: 1 }, { unique: true })

export async function POST(req) {
  const timeoutDuration = 5000; // 5 seconds timeout
  let timeoutHandle;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new Error('Registration process timed out'));
    }, timeoutDuration);
  });

  try {
    // Parse input with timeout protection
    const inputPromise = req.json();
    const { name, email, password } = await Promise.race([inputPromise, timeoutPromise]);

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Database operations with timeout protection
    await Promise.race([dbConnect(), timeoutPromise]);

    // Check existing user with timeout
    const existingUser = await Promise.race([
      User.findOne({ email }).select('_id').maxTimeMS(3000),
      timeoutPromise
    ]);

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 } // 409 Conflict more appropriate for existing resource
      );
    }

    // Create user with timeout
    const user = await Promise.race([
      User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password // Note: Should be hashed before saving in real implementation
      }),
      timeoutPromise
    ]);

    // Clear timeout on success
    clearTimeout(timeoutHandle);

    return NextResponse.json(
      { 
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      },
      { status: 201 }
    );

  } catch (error) {
    if (timeoutHandle) clearTimeout(timeoutHandle);
    
    console.error('Registration error:', error.message);

    const status = error.message.includes('timed out') ? 504 : 500;
    return NextResponse.json(
      { 
        error: status === 504 
          ? 'Registration process timed out. Please try again.' 
          : 'Registration failed. Please try again later.'
      },
      { status }
    );
  }
}