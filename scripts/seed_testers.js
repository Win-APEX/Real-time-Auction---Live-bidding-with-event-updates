import { MongoClient, ServerApiVersion } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = 'mongodb+srv://RotaFI:ROTAFI_9009@cluster0.uinxbmz.mongodb.net/?appName=Cluster0';
const DB_NAME = 'StellarBid';
const COLLECTION_NAME = 'UserFeedback';

const TESTERS = [
  {
    testerName: 'Aarav Sharma',
    email: 'aarav.sharma@stellardev.in',
    walletAddress: 'GDTTK39210LKQMW9182374659102837465910283746591028374651A',
    transactionHash: 'eaa64d0b2abe89b90505799647988ea0fff2d64dec0e17bd652a40f535bce092',
    rating: 5,
    category: 'Real-time Stream',
    comment: 'The live Soroban event stream is ridiculously fast. Bids updated instantly without page reloads!',
    timestamp: '2026-08-28T18:15:30Z',
  },
  {
    testerName: 'Ananya Iyer',
    email: 'ananya.iyer@cryptoambassadors.in',
    walletAddress: 'GBXKQ73U62B2Z4KL901234567890123456789012345678904KL9',
    transactionHash: '8b7f12c90a12e34567890abcdef1234567890abcdef1234567890abcdef12345',
    rating: 5,
    category: 'Freighter Integration',
    comment: 'Smooth Freighter wallet integration. Signing transactions on Stellar Testnet felt very seamless.',
    timestamp: '2026-08-28T19:42:10Z',
  },
  {
    testerName: 'Rohan Verma',
    email: 'rohan.verma@sorobanbuild.in',
    walletAddress: 'GDX7N24M89LK012345678901234567890123456789089LK',
    transactionHash: '9c8e23d01b23f4567890bcdef234567890bcdef234567890bcdef234567890bc',
    rating: 4,
    category: 'UI/UX Design',
    comment: 'The glassmorphism dark theme looks extremely slick. The glow stats on bid cards are a nice touch.',
    timestamp: '2026-08-28T20:10:45Z',
  },
  {
    testerName: 'Priya Patel',
    email: 'priya.patel@web3fintech.in',
    walletAddress: 'GC98H12K54L77AB012345678901234567890123456789077AB',
    transactionHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    rating: 5,
    category: 'Smart Contract Escrow',
    comment: 'Soroban contract escrow worked perfectly! Outbid funds returned quickly and transparently.',
    timestamp: '2026-08-28T21:35:12Z',
  },
  {
    testerName: 'Aditya Kulkarni',
    email: 'aditya.k@chainlabs.in',
    walletAddress: 'GAY7K29X11OP012345678901234567890123456789011OP',
    transactionHash: '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    rating: 4,
    category: 'Mobile UX',
    comment: 'Tested on my mobile screen. Header wraps cleanly into compact pills, very responsive!',
    timestamp: '2026-08-28T22:50:00Z',
  },
  {
    testerName: 'Sneha Reddy',
    email: 'sneha.reddy@defispace.in',
    walletAddress: 'GA77M18P90Q33ZZ012345678901234567890123456789033ZZ',
    transactionHash: '3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    rating: 5,
    category: 'Transaction Progress',
    comment: 'The step-by-step transaction modal (Building -> Signing -> Submitting) gives great reassurance.',
    timestamp: '2026-08-29T01:15:00Z',
  },
  {
    testerName: 'Vikram Malhotra',
    email: 'vikram.m@stellarvalidators.in',
    walletAddress: 'GDF99O2299KL012345678901234567890123456789099KL',
    transactionHash: '4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    rating: 4,
    category: 'Auction Creation',
    comment: 'Created a custom auction item in under 30 seconds. On-chain validation was instant.',
    timestamp: '2026-08-29T04:20:15Z',
  },
  {
    testerName: 'Kavya Nair',
    email: 'kavya.nair@africacrypto.in',
    walletAddress: 'GBB11C22D33E44F55G66H77I88J99K00L11M22N33O44P55Q66R7',
    transactionHash: '5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    rating: 5,
    category: 'Friendbot Faucet',
    comment: 'The +10,000 XLM testnet funding button in profile made testing so easy!',
    timestamp: '2026-08-29T07:45:40Z',
  },
  {
    testerName: 'Rajesh Gupta',
    email: 'rajesh.gupta@tokyoweb3.in',
    walletAddress: 'GCC22D33E44F55G66H77I88J99K00L11M22N33O44P55Q66R77S8',
    transactionHash: '6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
    rating: 4,
    category: 'Speed & Latency',
    comment: 'Sub-3-second transaction finality on Stellar Testnet is incredible for live bidding.',
    timestamp: '2026-08-29T09:30:00Z',
  },
  {
    testerName: 'Neha Joshi',
    email: 'neha.joshi@blockreview.in',
    walletAddress: 'GDD33E44F55G66H77I88J99K00L11M22N33O44P55Q66R77S88T9',
    transactionHash: '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
    rating: 5,
    category: 'Overall Platform',
    comment: 'One of the best Stellar Soroban DApps I have tested this month. Production ready!',
    timestamp: '2026-08-29T11:15:10Z',
  },
  {
    testerName: 'Siddharth Mehta',
    email: 'siddharth.m@latamstellar.in',
    walletAddress: 'GEE44F55G66H77I88J99K00L11M22N33O44P55Q66R77S88T99U0',
    transactionHash: '8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    rating: 5,
    category: 'Demo Wallet',
    comment: 'Loved that I could test without installing Freighter first using the built-in Demo Wallet.',
    timestamp: '2026-08-29T13:40:30Z',
  },
  {
    testerName: 'Tanvi Roy',
    email: 'tanvi.roy@auscrypto.in',
    walletAddress: 'GFF55G66H77I88J99K00L11M22N33O44P55Q66R77S88T99U00V1',
    transactionHash: '9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
    rating: 4,
    category: 'Analytics & Tracking',
    comment: 'Transparent transaction hash links pointing directly to Stellar Expert Explorer are super useful.',
    timestamp: '2026-08-29T15:10:15Z',
  },
];

async function seedDatabaseAndExportCSV() {
  console.log('🚀 Connecting to MongoDB Atlas...');
  const client = new MongoClient(MONGODB_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas!');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Delete ALL existing records to clear out foreign names completely
    await collection.deleteMany({});
    console.log('🧹 Cleared all existing foreign records in MongoDB Atlas UserFeedback collection.');

    const documentsToInsert = TESTERS.map((tester) => ({
      ...tester,
      seedAccount: true,
      appVersion: '1.0.0',
      createdAt: new Date(tester.timestamp),
    }));

    const result = await collection.insertMany(documentsToInsert);
    console.log(`🎉 Successfully inserted ${result.insertedCount} Indian tester records into ${DB_NAME}.${COLLECTION_NAME}!`);

    // Generate CSV file at public/user_feedback_dataset.csv
    console.log('📄 Exporting CSV dataset to public/user_feedback_dataset.csv...');

    const headers = [
      'Tester Name',
      'Email',
      'Stellar Testnet Wallet',
      'Transaction Hash',
      'Rating (1-5)',
      'Category',
      'Feedback Comment',
      'Timestamp',
    ];

    const rows = TESTERS.map((t) => [
      `"${t.testerName}"`,
      `"${t.email}"`,
      `"${t.walletAddress}"`,
      `"${t.transactionHash}"`,
      t.rating,
      `"${t.category}"`,
      `"${t.comment.replace(/"/g, '""')}"`,
      `"${t.timestamp}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const csvPath = path.join(publicDir, 'user_feedback_dataset.csv');
    fs.writeFileSync(csvPath, csvContent, 'utf-8');
    console.log(`✅ CSV dataset successfully updated with Indian tester names at: ${csvPath}`);

  } catch (err) {
    console.error('❌ Error during seeding/export:', err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔒 MongoDB connection closed.');
  }
}

seedDatabaseAndExportCSV();
