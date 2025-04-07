import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createCanvas, loadImage } from 'canvas';
import sharp from 'sharp';
import path from "path"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const { text } = await request.json();
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' }, 
        { status: 400 }
      );
    }

    // Create canvas
    const canvas = createCanvas(600, 700);
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Method 1: Load image from URL (recommended)
    // const imageUrl = 'https://res-console.cloudinary.com/dqfum2awz/media_explorer_thumbnails/186f8d1755d4f2fa8ef3194b9ee0481e/detailed';
    // const dhoniImage = await loadImage(imageUrl);

    // Method 2: If you must use local file (see troubleshooting below)
    const imagePath = path.join(process.cwd(), 'public', 'images', 'ms-dhoni.jpg');
    const imageBuffer = await sharp(imagePath).toFormat('jpg').toBuffer();
    const dhoniImage = await loadImage(imageBuffer);

    // Draw image centered
    const imgWidth = Math.min(400, dhoniImage.width);
    const imgHeight = (imgWidth / dhoniImage.width) * dhoniImage.height;
    const imgX = (canvas.width - imgWidth) / 2;
    const imgY = (canvas.height - imgHeight) / 2 - 50;
    
    ctx.drawImage(dhoniImage, imgX, imgY, imgWidth, imgHeight);
    
    // Add text styling
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 6;
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px Impact';
    
    // Draw "THALA FOR A REASON"
    ctx.strokeText("THALA FOR A REASON", canvas.width / 2, 70);
    ctx.fillStyle = '#FFD700';
    ctx.fillText("THALA FOR A REASON", canvas.width / 2, 70);
    
    // Draw user text
    ctx.font = 'bold 36px Impact';
    ctx.strokeText(`"${text}"`, canvas.width / 2, canvas.height - 100);
    ctx.fillStyle = 'white';
    ctx.fillText(`"${text}"`, canvas.width / 2, canvas.height - 100);
    
    // Draw explanation
    const reason = calculateThalaReason(text);
    ctx.font = 'bold 32px Arial';
    ctx.strokeText(reason, canvas.width / 2, canvas.height - 50);
    ctx.fillStyle = '#FFD700';
    ctx.fillText(reason, canvas.width / 2, canvas.height - 50);
    
    // Convert canvas to buffer and compress
    const buffer = canvas.toBuffer('image/png');
    const optimizedBuffer = await sharp(buffer)
      .png({ quality: 80 })
      .toBuffer();
    
    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: 'image',
          folder: 'thala-memes'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(optimizedBuffer);
    });
    
    return NextResponse.json({ 
      success: true,
      memeUrl: result.secure_url
    });
    
  } catch (error) {
    console.error('Error generating meme:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate meme',
        details: error.message,
        suggestion: 'Try again with different text'
      }, 
      { status: 500 }
    );
  }
}

function calculateThalaReason(input) {
  if (!input) return "";
  if (input === "7") return "It's literally 7!";
  if (input.length === 7) return "Has 7 letters!";
  
  if (input.match(/^\d+$/)) {
    const sum = input.split('').reduce((a, b) => a + parseInt(b), 0);
    if (sum === 7) return `Digits sum to 7 (${input.split('').join('+')}=${sum})`;
  }
  
  const wordCount = input.trim().split(/\s+/).length;
  if (wordCount === 7) return "Has 7 words!";
  
  return "7 is everywhere!";
}