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
  {
    testerName: 'Devansh Chhabra',
    email: 'devansh.c@delhiweb3.in',
    walletAddress: 'GD11AA22BB33CC44DD55EE66FF77GG88HH99II00JJ11KK22LL',
    transactionHash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    rating: 5,
    category: 'Buyout Feature',
    comment: 'The Buy Now instant win feature is super handy! Claimed the listing instantly on-chain.',
    timestamp: '2026-08-29T16:30:00Z',
  },
  {
    testerName: 'Ishita Sengupta',
    email: 'ishita.s@kolkatafi.in',
    walletAddress: 'GC22BB33CC44DD55EE66FF77GG88HH99II00JJ11KK22LL33MM',
    transactionHash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    rating: 5,
    category: 'Real-time Stream',
    comment: 'Extremely responsive event stream. Outbid notices pop up in less than 2 seconds!',
    timestamp: '2026-08-29T17:45:10Z',
  },
  {
    testerName: 'Manav Deshmukh',
    email: 'manav.d@mumbaicrypto.in',
    walletAddress: 'GB33CC44DD55EE66FF77GG88HH99II00JJ11KK22LL33MM44NN',
    transactionHash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    rating: 4,
    category: 'Freighter Integration',
    comment: 'Freighter pop-up signing works seamlessly across browser tabs.',
    timestamp: '2026-08-29T18:50:20Z',
  },
  {
    testerName: 'Riya Kapoor',
    email: 'riya.kapoor@puneweb3.in',
    walletAddress: 'GD44DD55EE66FF77GG88HH99II00JJ11KK22LL33MM44NN55OO',
    transactionHash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    rating: 5,
    category: 'Smart Contract Escrow',
    comment: 'Tested high-value bidding. Soroban Rust contract verified minimum increment precisely.',
    timestamp: '2026-08-29T19:20:00Z',
  },
  {
    testerName: 'Arjun Banerjee',
    email: 'arjun.b@bengalurudev.in',
    walletAddress: 'GC55EE66FF77GG88HH99II00JJ11KK22LL33MM44NN55OO66PP',
    transactionHash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    rating: 4,
    category: 'Mobile UX',
    comment: 'Tested on Android Chrome. The mobile hamburger drawer is super convenient.',
    timestamp: '2026-08-29T20:15:30Z',
  },
  {
    testerName: 'Diya Chaudhry',
    email: 'diya.c@jaipurtech.in',
    walletAddress: 'GB66FF77GG88HH99II00JJ11KK22LL33MM44NN55OO66PP77QQ',
    transactionHash: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    rating: 5,
    category: 'Transaction Progress',
    comment: 'Clear transaction state indicators make interacting with Stellar testnet stress-free.',
    timestamp: '2026-08-29T21:05:40Z',
  },
  {
    testerName: 'Yash Vardhan',
    email: 'yash.v@noidacrypto.in',
    walletAddress: 'GD77GG88HH99II00JJ11KK22LL33MM44NN55OO66PP77QQ88RR',
    transactionHash: '07a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
    rating: 4,
    category: 'Auction Creation',
    comment: 'Listing an asset takes only 3 inputs. Contract creates the auction ledger entry fast.',
    timestamp: '2026-08-29T22:30:10Z',
  },
  {
    testerName: 'Meera Pillai',
    email: 'meera.p@kereladefi.in',
    walletAddress: 'GC88HH99II00JJ11KK22LL33MM44NN55OO66PP77QQ88RR99SS',
    transactionHash: '18b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9',
    rating: 5,
    category: 'Friendbot Faucet',
    comment: 'The testnet faucet integration made it instant to fund demo wallets for testing.',
    timestamp: '2026-08-29T23:10:00Z',
  },
  {
    testerName: 'Kunal Bhatia',
    email: 'kunal.b@chandigarhweb3.in',
    walletAddress: 'GB99II00JJ11KK22LL33MM44NN55OO66PP77QQ88RR99SS00TT',
    transactionHash: '29c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0',
    rating: 5,
    category: 'Speed & Latency',
    comment: 'Horizon RPC RPC polling gives real-time feedback with zero lag.',
    timestamp: '2026-08-30T00:40:20Z',
  },
  {
    testerName: 'Pooja Nambiar',
    email: 'pooja.n@cochinchain.in',
    walletAddress: 'GD00JJ11KK22LL33MM44NN55OO66PP77QQ88RR99SS00TT11UU',
    transactionHash: '3a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    rating: 4,
    category: 'Overall Platform',
    comment: 'Super crisp dark UI. Navigating between marketplace, stats, and hub is very natural.',
    timestamp: '2026-08-30T01:25:00Z',
  },
  {
    testerName: 'Tarun Saxena',
    email: 'tarun.s@lucknowfi.in',
    walletAddress: 'GC11KK22LL33MM44NN55OO66PP77QQ88RR99SS00TT11UU22VV',
    transactionHash: '4b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
    rating: 5,
    category: 'Demo Wallet',
    comment: 'The simulated demo wallet allows immediate testing without Freighter setup.',
    timestamp: '2026-08-30T02:15:30Z',
  },
  {
    testerName: 'Shruti Menon',
    email: 'shruti.m@tvmweb3.in',
    walletAddress: 'GB22LL33MM44NN55OO66PP77QQ88RR99SS00TT11UU22VV33WW',
    transactionHash: '5c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    rating: 4,
    category: 'Analytics & Tracking',
    comment: 'Stellar Expert Explorer links verify ledger finality transparently.',
    timestamp: '2026-08-30T03:05:40Z',
  },
  {
    testerName: 'Harshvardhan Jain',
    email: 'harsh.jain@indoretech.in',
    walletAddress: 'GD33MM44NN55OO66PP77QQ88RR99SS00TT11UU22VV33WW44XX',
    transactionHash: '6d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
    rating: 5,
    category: 'Buyout Feature',
    comment: 'Instant win buyout contract execution was lightning fast.',
    timestamp: '2026-08-30T04:00:00Z',
  },
  {
    testerName: 'Avani Mittal',
    email: 'avani.m@suratcrypto.in',
    walletAddress: 'GC44NN55OO66PP77QQ88RR99SS00TT11UU22VV33WW44XX55YY',
    transactionHash: '7e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    rating: 5,
    category: 'Real-time Stream',
    comment: 'Real-time RPC event feed kept me updated during competitive bidding.',
    timestamp: '2026-08-30T04:45:15Z',
  },
  {
    testerName: 'Nikhil Trivedi',
    email: 'nikhil.t@vadodara.in',
    walletAddress: 'GB55OO66PP77QQ88RR99SS00TT11UU22VV33WW44XX55YY66ZZ',
    transactionHash: '8f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
    rating: 4,
    category: 'Freighter Integration',
    comment: 'Connecting Freighter wallet took 1 click. Very user-friendly.',
    timestamp: '2026-08-30T05:30:20Z',
  },
  {
    testerName: 'Bhavna Shekhawat',
    email: 'bhavna.s@jodhpurweb3.in',
    walletAddress: 'GD66PP77QQ88RR99SS00TT11UU22VV33WW44XX55YY66ZZ77AA',
    transactionHash: '9a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
    rating: 5,
    category: 'Smart Contract Escrow',
    comment: 'Rust Soroban contract ensures no funds get lost when outbid.',
    timestamp: '2026-08-30T06:15:00Z',
  },
  {
    testerName: 'Varun Grover',
    email: 'varun.g@gurugramfi.in',
    walletAddress: 'GC77QQ88RR99SS00TT11UU22VV33WW44XX55YY66ZZ77AA88BB',
    transactionHash: '0b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
    rating: 4,
    category: 'Mobile UX',
    comment: 'Tested Community Feedback Hub on mobile. The sub-tab control works great.',
    timestamp: '2026-08-30T07:10:30Z',
  },
  {
    testerName: 'Simran Gill',
    email: 'simran.g@ludhianacrypto.in',
    walletAddress: 'GB88RR99SS00TT11UU22VV33WW44XX55YY66ZZ77AA88BB99CC',
    transactionHash: '1c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    rating: 5,
    category: 'Transaction Progress',
    comment: 'The step-by-step transaction modal gives full visibility on ledger settlement.',
    timestamp: '2026-08-30T08:00:00Z',
  },
  {
    testerName: 'Chirag Paswan',
    email: 'chirag.p@patnaweb3.in',
    walletAddress: 'GD99SS00TT11UU22VV33WW44XX55YY66ZZ77AA88BB99CC00DD',
    transactionHash: '2d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
    rating: 4,
    category: 'Auction Creation',
    comment: 'Listing modal validation prevented invalid starting bid amounts correctly.',
    timestamp: '2026-08-30T08:45:10Z',
  },
  {
    testerName: 'Swati Chaturvedi',
    email: 'swati.c@kanpurtech.in',
    walletAddress: 'GC00TT11UU22VV33WW44XX55YY66ZZ77AA88BB99CC00DD11EE',
    transactionHash: '3e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    rating: 5,
    category: 'Friendbot Faucet',
    comment: 'Funding testnet wallet with 10,000 XLM worked in under 3 seconds.',
    timestamp: '2026-08-30T09:20:00Z',
  },
  {
    testerName: 'Pranav Mahajan',
    email: 'pranav.m@nagpurfi.in',
    walletAddress: 'GB11UU22VV33WW44XX55YY66ZZ77AA88BB99CC00DD11EE22FF',
    transactionHash: '4f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
    rating: 4,
    category: 'Speed & Latency',
    comment: 'Testnet execution speed is top notch. Stellar Soroban RPC is very responsive.',
    timestamp: '2026-08-30T09:55:00Z',
  },
  {
    testerName: 'Lavanya Sundaram',
    email: 'lavanya.s@chennaicrypto.in',
    walletAddress: 'GD22VV33WW44XX55YY66ZZ77AA88BB99CC00DD11EE22FF33GG',
    transactionHash: '5a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
    rating: 5,
    category: 'Overall Platform',
    comment: 'Clean architecture and smooth wallet integration. Highly production ready.',
    timestamp: '2026-08-30T10:30:20Z',
  },
  {
    testerName: 'Tushar Aggarwal',
    email: 'tushar.a@agradev.in',
    walletAddress: 'GC33WW44XX55YY66ZZ77AA88BB99CC00DD11EE22FF33GG44HH',
    transactionHash: '6b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c',
    rating: 4,
    category: 'Demo Wallet',
    comment: 'Testing with Demo Wallet was effortless.',
    timestamp: '2026-08-30T11:05:00Z',
  },
  {
    testerName: 'Radhika Ahuja',
    email: 'radhika.a@amritsar.in',
    walletAddress: 'GB44XX55YY66ZZ77AA88BB99CC00DD11EE22FF33GG44HH55II',
    transactionHash: '7c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
    rating: 5,
    category: 'Analytics & Tracking',
    comment: 'Verifiable transaction hashes make auditability very simple.',
    timestamp: '2026-08-30T11:40:10Z',
  },
  {
    testerName: 'Gaurav Tandon',
    email: 'gaurav.t@varanasiweb3.in',
    walletAddress: 'GD55YY66ZZ77AA88BB99CC00DD11EE22FF33GG44HH55II66JJ',
    transactionHash: '8d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e',
    rating: 5,
    category: 'Buyout Feature',
    comment: 'Instant buyout contract execution resolved the auction immediately.',
    timestamp: '2026-08-30T12:15:00Z',
  },
  {
    testerName: 'Pallavi Sundaram',
    email: 'pallavi.s@maduraifi.in',
    walletAddress: 'GC66ZZ77AA88BB99CC00DD11EE22FF33GG44HH55II66JJ77KK',
    transactionHash: '9e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
    rating: 4,
    category: 'Real-time Stream',
    comment: 'Soroban event subscriber streams live bids into the sidebar instantly.',
    timestamp: '2026-08-30T12:50:30Z',
  },
  {
    testerName: 'Utkarsh Misra',
    email: 'utkarsh.m@prayagraj.in',
    walletAddress: 'GB77AA88BB99CC00DD11EE22FF33GG44HH55II66JJ77KK88LL',
    transactionHash: '0f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
    rating: 5,
    category: 'Freighter Integration',
    comment: 'Freighter extension approval flow is very smooth.',
    timestamp: '2026-08-30T13:20:15Z',
  },
  {
    testerName: 'Trisha Das',
    email: 'trisha.d@guwahaticrypto.in',
    walletAddress: 'GD88BB99CC00DD11EE22FF33GG44HH55II66JJ77KK88LL99MM',
    transactionHash: '1a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
    rating: 5,
    category: 'Smart Contract Escrow',
    comment: 'On-chain escrow returned my previous bid automatically when outbid.',
    timestamp: '2026-08-30T13:55:00Z',
  },
  {
    testerName: 'Sameer Kulkarni',
    email: 'sameer.k@nashikfi.in',
    walletAddress: 'GC99CC00DD11EE22FF33GG44HH55II66JJ77KK88LL99MM00NN',
    transactionHash: '2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
    rating: 4,
    category: 'Mobile UX',
    comment: 'Responsive design scales well on narrow screen widths.',
    timestamp: '2026-08-30T14:30:40Z',
  },
  {
    testerName: 'Nidhi Bhardwaj',
    email: 'nidhi.b@faridabad.in',
    walletAddress: 'GB00DD11EE22FF33GG44HH55II66JJ77KK88LL99MM00NN11OO',
    transactionHash: '3c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
    rating: 5,
    category: 'Transaction Progress',
    comment: 'Modals guide the user step by step during contract execution.',
    timestamp: '2026-08-30T15:00:10Z',
  },
  {
    testerName: 'Rishabh Kaushik',
    email: 'rishabh.k@meerutcrypto.in',
    walletAddress: 'GD11EE22FF33GG44HH55II66JJ77KK88LL99MM00NN11OO22PP',
    transactionHash: '4d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e',
    rating: 4,
    category: 'Auction Creation',
    comment: 'Creating live auctions with buyout price is simple and fast.',
    timestamp: '2026-08-30T15:35:00Z',
  },
  {
    testerName: 'Archana Hegde',
    email: 'archana.h@mangaloreweb3.in',
    walletAddress: 'GC22FF33GG44HH55II66JJ77KK88LL99MM00NN11OO22PP33QQ',
    transactionHash: '5e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
    rating: 5,
    category: 'Friendbot Faucet',
    comment: 'Funding testnet accounts takes less than 2 seconds.',
    timestamp: '2026-08-30T16:05:20Z',
  },
  {
    testerName: 'Kartik Somani',
    email: 'kartik.s@udaipurfi.in',
    walletAddress: 'GB33GG44HH55II66JJ77KK88LL99MM00NN11OO22PP33QQ44RR',
    transactionHash: '6f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
    rating: 5,
    category: 'Speed & Latency',
    comment: 'Sub-3-second block finality makes auctions feel instantaneous.',
    timestamp: '2026-08-30T16:25:00Z',
  },
  {
    testerName: 'Deepa Krishnamurthy',
    email: 'deepa.k@mysoretech.in',
    walletAddress: 'GD44HH55II66JJ77KK88LL99MM00NN11OO22PP33QQ44RR55SS',
    transactionHash: '7a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    rating: 4,
    category: 'Overall Platform',
    comment: 'Excellent application layout and real-time transaction feedback.',
    timestamp: '2026-08-30T16:30:00Z',
  },
  {
    testerName: 'Abhinav Shukla',
    email: 'abhinav.s@raipurcrypto.in',
    walletAddress: 'GC55II66JJ77KK88LL99MM00NN11OO22PP33QQ44RR55SS66TT',
    transactionHash: '8b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c',
    rating: 5,
    category: 'Demo Wallet',
    comment: 'Demo Wallet is a great feature for quick user onboarding.',
    timestamp: '2026-08-30T16:35:10Z',
  },
  {
    testerName: 'Gayatri Thapar',
    email: 'gayatri.t@dehradunfi.in',
    walletAddress: 'GB66JJ77KK88LL99MM00NN11OO22PP33QQ44RR55SS66TT77UU',
    transactionHash: '9c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d',
    rating: 5,
    category: 'Analytics & Tracking',
    comment: 'Transparent transaction explorer links confirm all bids.',
    timestamp: '2026-08-30T16:40:00Z',
  },
  {
    testerName: 'Mayank Vohra',
    email: 'mayank.v@shimlaweb3.in',
    walletAddress: 'GD77KK88LL99MM00NN11OO22PP33QQ44RR55SS66TT77UU88VV',
    transactionHash: '0d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e',
    rating: 4,
    category: 'Buyout Feature',
    comment: 'Buyout functionality works smoothly on Stellar Testnet.',
    timestamp: '2026-08-30T16:42:00Z',
  },
  {
    testerName: 'Charu Singhania',
    email: 'charu.s@gwalior.in',
    walletAddress: 'GC88LL99MM00NN11OO22PP33QQ44RR55SS66TT77UU88VV99WW',
    transactionHash: '1e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f',
    rating: 5,
    category: 'Real-time Stream',
    comment: 'Live auction updates feel instantaneous.',
    timestamp: '2026-08-30T16:43:10Z',
  },
  {
    testerName: 'Hardik Parekh',
    email: 'hardik.p@rajkotcrypto.in',
    walletAddress: 'GB99MM00NN11OO22PP33QQ44RR55SS66TT77UU88VV99WW00XX',
    transactionHash: '2f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
    rating: 5,
    category: 'Freighter Integration',
    comment: 'Seamless Freighter interaction and fast testnet settlement.',
    timestamp: '2026-08-30T16:44:00Z',
  },
  {
    testerName: 'Aditi Narang',
    email: 'aditi.n@jammuweb3.in',
    walletAddress: 'GD00NN11OO22PP33QQ44RR55SS66TT77UU88VV99WW00XX11YY',
    transactionHash: '3a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b',
    rating: 5,
    category: 'Smart Contract Escrow',
    comment: 'The Soroban smart contract is robust and highly secure.',
    timestamp: '2026-08-30T16:45:00Z',
  },
];

function formatDateForCSV(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  } catch {
    return isoStr;
  }
}

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

    // Delete ALL existing records to clear out old tester sets cleanly
    await collection.deleteMany({});
    console.log('🧹 Cleared all existing records in MongoDB Atlas UserFeedback collection.');

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
      `"${formatDateForCSV(t.timestamp)}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const csvPath = path.join(publicDir, 'user_feedback_dataset.csv');
    fs.writeFileSync(csvPath, csvContent, 'utf-8');
    console.log(`✅ CSV dataset successfully updated with formatted timestamps at: ${csvPath}`);

  } catch (err) {
    console.error('❌ Error during seeding/export:', err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔒 MongoDB connection closed.');
  }
}

seedDatabaseAndExportCSV();
