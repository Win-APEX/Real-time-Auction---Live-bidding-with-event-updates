import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, ServerApiVersion } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://RotaFI:ROTAFI_9009@cluster0.uinxbmz.mongodb.net/?appName=Cluster0';
const DB_NAME = 'StellarBid';
const COLLECTION_NAME = 'UserFeedback';

let cachedClient: MongoClient | null = null;

async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;

  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      testerName,
      email,
      walletAddress,
      transactionHash,
      rating,
      category,
      comment,
      message,
      timestamp,
      appVersion,
    } = req.body;

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid rating. Must be a number between 1 and 5.' });
    }

    const feedbackDoc = {
      testerName: (testerName || 'Community Member').trim(),
      email: (email || '').trim(),
      walletAddress: walletAddress || 'anonymous',
      transactionHash: transactionHash || '',
      rating: Number(rating),
      category: (category || 'General Feedback').trim(),
      comment: (comment || message || '').trim().substring(0, 500),
      timestamp: timestamp || new Date().toISOString(),
      appVersion: appVersion || '1.0.0',
      createdAt: new Date(),
      ip: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown',
    };

    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.insertOne(feedbackDoc);

    console.log(`[StellarBid Feedback] Saved: ${result.insertedId} | Rating: ${rating}/5 | Tester: ${feedbackDoc.testerName}`);

    return res.status(200).json({
      success: true,
      id: result.insertedId.toString(),
      feedback: feedbackDoc,
      message: 'Feedback submitted successfully.',
    });

  } catch (err: any) {
    console.error('[StellarBid Feedback API Error]', err.message);
    return res.status(500).json({
      error: 'Failed to save feedback. Please try again.',
    });
  }
}
