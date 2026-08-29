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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const client = await getMongoClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Fetch latest 50 feedback entries sorted by creation time descending
    const feedbacks = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const formattedFeedbacks = feedbacks.map((item) => ({
      id: item._id.toString(),
      testerName: item.testerName || 'Anonymous Community Member',
      email: item.email || '',
      walletAddress: item.walletAddress || 'anonymous',
      transactionHash: item.transactionHash || item.txHash || '',
      rating: item.rating || 5,
      category: item.category || 'General Feedback',
      comment: item.comment || item.message || '',
      timestamp: item.timestamp || item.createdAt || new Date().toISOString(),
    }));

    return res.status(200).json({
      success: true,
      count: formattedFeedbacks.length,
      feedbacks: formattedFeedbacks,
    });

  } catch (err: any) {
    console.error('[StellarBid Get Feedbacks API Error]', err.message);
    return res.status(500).json({
      error: 'Failed to fetch feedback entries.',
    });
  }
}
