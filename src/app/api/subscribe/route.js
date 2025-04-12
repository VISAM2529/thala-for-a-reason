import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const tasks = [];

    // Configure Nodemailer
    if (process.env.EMAIL_HOST) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Send notification email to yourself
      tasks.push(
        transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: process.env.EMAIL_TO,
          subject: 'New Thala For A Reason Subscriber',
          text: `New subscriber email: ${email}`,
          html: `<p>New subscriber has joined the waitlist!</p><p>Email: <strong>${email}</strong></p>`,
        })
      );

      // Optional: Send confirmation to subscriber
      if (process.env.SEND_CONFIRMATION === 'true') {
        tasks.push(
          transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to Thala For A Reason Waitlist',
            text: 'Thank you for joining our waitlist! We\'ll notify you when we launch.',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #3B82F6;">Thank you for joining the Thala waitlist!</h2>
                <p>We're excited to have you on board. We'll notify you as soon as we launch.</p>
                <p>Stay tuned for updates about the ultimate meme app celebrating MS Dhoni and the legendary number 7.</p>
                <div style="background-color: #1E40AF; color: #EAB308; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
                  <h3 style="margin: 0;">THALA FOR A REASON</h3>
                </div>
              </div>
            `,
          })
        );
      }
    }

    // Store in MongoDB
    if (process.env.MONGODB_URI) {
      const client = new MongoClient(process.env.MONGODB_URI);

      tasks.push(
        (async () => {
          try {
            await client.connect();
            const db = client.db('thala-app');
            const subscribers = db.collection('thala-subscribers');
            const existing = await subscribers.findOne({ email });

            if (!existing) {
              await subscribers.insertOne({
                email,
                subscribedAt: new Date(),
              });
            }
          } catch (dbError) {
            console.error('Database error:', dbError);
          } finally {
            await client.close();
          }
        })()
      );
    }

    await Promise.allSettled(tasks);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process subscription' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
