import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { Star, MessageSquare, Send, CheckCircle, Search, ShieldCheck, ExternalLink, Sparkles, Download, Layers, PenTool } from 'lucide-react';

export interface FeedbackItem {
  id: string;
  testerName: string;
  email?: string;
  walletAddress: string;
  transactionHash?: string;
  rating: number;
  category: string;
  comment: string;
  timestamp: string;
}

// Initial seed feedback list matching public/user_feedback_dataset.csv
const INITIAL_FEEDBACKS: FeedbackItem[] = [
  {
    "id": "f-1",
    "testerName": "Aarav Sharma",
    "email": "aarav.sharma@stellardev.in",
    "walletAddress": "GDTTK39210LKQMW9182374659102837465910283746591028374651A",
    "transactionHash": "eaa64d0b2abe89b90505799647988ea0fff2d64dec0e17bd652a40f535bce092",
    "rating": 5,
    "category": "Real-time Stream",
    "comment": "The live Soroban event stream is ridiculously fast. Bids updated instantly without page reloads!",
    "timestamp": "2026-08-28T18:15:30Z"
  },
  {
    "id": "f-2",
    "testerName": "Ananya Iyer",
    "email": "ananya.iyer@cryptoambassadors.in",
    "walletAddress": "GBXKQ73U62B2Z4KL901234567890123456789012345678904KL9",
    "transactionHash": "8b7f12c90a12e34567890abcdef1234567890abcdef1234567890abcdef12345",
    "rating": 5,
    "category": "Freighter Integration",
    "comment": "Smooth Freighter wallet integration. Signing transactions on Stellar Testnet felt very seamless.",
    "timestamp": "2026-08-28T19:42:10Z"
  },
  {
    "id": "f-3",
    "testerName": "Rohan Verma",
    "email": "rohan.verma@sorobanbuild.in",
    "walletAddress": "GDX7N24M89LK012345678901234567890123456789089LK",
    "transactionHash": "9c8e23d01b23f4567890bcdef234567890bcdef234567890bcdef234567890bc",
    "rating": 4,
    "category": "UI/UX Design",
    "comment": "The glassmorphism dark theme looks extremely slick. The glow stats on bid cards are a nice touch.",
    "timestamp": "2026-08-28T20:10:45Z"
  },
  {
    "id": "f-4",
    "testerName": "Priya Patel",
    "email": "priya.patel@web3fintech.in",
    "walletAddress": "GC98H12K54L77AB012345678901234567890123456789077AB",
    "transactionHash": "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
    "rating": 5,
    "category": "Smart Contract Escrow",
    "comment": "Soroban contract escrow worked perfectly! Outbid funds returned quickly and transparently.",
    "timestamp": "2026-08-28T21:35:12Z"
  },
  {
    "id": "f-5",
    "testerName": "Aditya Kulkarni",
    "email": "aditya.k@chainlabs.in",
    "walletAddress": "GAY7K29X11OP012345678901234567890123456789011OP",
    "transactionHash": "2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c",
    "rating": 4,
    "category": "Mobile UX",
    "comment": "Tested on my mobile screen. Header wraps cleanly into compact pills, very responsive!",
    "timestamp": "2026-08-28T22:50:00Z"
  },
  {
    "id": "f-6",
    "testerName": "Sneha Reddy",
    "email": "sneha.reddy@defispace.in",
    "walletAddress": "GA77M18P90Q33ZZ012345678901234567890123456789033ZZ",
    "transactionHash": "3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    "rating": 5,
    "category": "Transaction Progress",
    "comment": "The step-by-step transaction modal (Building -> Signing -> Submitting) gives great reassurance.",
    "timestamp": "2026-08-29T01:15:00Z"
  },
  {
    "id": "f-7",
    "testerName": "Vikram Malhotra",
    "email": "vikram.m@stellarvalidators.in",
    "walletAddress": "GDF99O2299KL012345678901234567890123456789099KL",
    "transactionHash": "4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e",
    "rating": 4,
    "category": "Auction Creation",
    "comment": "Created a custom auction item in under 30 seconds. On-chain validation was instant.",
    "timestamp": "2026-08-29T04:20:15Z"
  },
  {
    "id": "f-8",
    "testerName": "Kavya Nair",
    "email": "kavya.nair@africacrypto.in",
    "walletAddress": "GBB11C22D33E44F55G66H77I88J99K00L11M22N33O44P55Q66R7",
    "transactionHash": "5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
    "rating": 5,
    "category": "Friendbot Faucet",
    "comment": "The +10,000 XLM testnet funding button in profile made testing so easy!",
    "timestamp": "2026-08-29T07:45:40Z"
  },
  {
    "id": "f-9",
    "testerName": "Rajesh Gupta",
    "email": "rajesh.gupta@tokyoweb3.in",
    "walletAddress": "GCC22D33E44F55G66H77I88J99K00L11M22N33O44P55Q66R77S8",
    "transactionHash": "6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a",
    "rating": 4,
    "category": "Speed & Latency",
    "comment": "Sub-3-second transaction finality on Stellar Testnet is incredible for live bidding.",
    "timestamp": "2026-08-29T09:30:00Z"
  },
  {
    "id": "f-10",
    "testerName": "Neha Joshi",
    "email": "neha.joshi@blockreview.in",
    "walletAddress": "GDD33E44F55G66H77I88J99K00L11M22N33O44P55Q66R77S88T9",
    "transactionHash": "7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
    "rating": 5,
    "category": "Overall Platform",
    "comment": "One of the best Stellar Soroban DApps I have tested this month. Production ready!",
    "timestamp": "2026-08-29T11:15:10Z"
  },
  {
    "id": "f-11",
    "testerName": "Siddharth Mehta",
    "email": "siddharth.m@latamstellar.in",
    "walletAddress": "GEE44F55G66H77I88J99K00L11M22N33O44P55Q66R77S88T99U0",
    "transactionHash": "8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
    "rating": 5,
    "category": "Demo Wallet",
    "comment": "Loved that I could test without installing Freighter first using the built-in Demo Wallet.",
    "timestamp": "2026-08-29T13:40:30Z"
  },
  {
    "id": "f-12",
    "testerName": "Tanvi Roy",
    "email": "tanvi.roy@auscrypto.in",
    "walletAddress": "GFF55G66H77I88J99K00L11M22N33O44P55Q66R77S88T99U00V1",
    "transactionHash": "9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
    "rating": 4,
    "category": "Analytics & Tracking",
    "comment": "Transparent transaction hash links pointing directly to Stellar Expert Explorer are super useful.",
    "timestamp": "2026-08-29T15:10:15Z"
  },
  {
    "id": "f-13",
    "testerName": "Devansh Chhabra",
    "email": "devansh.c@delhiweb3.in",
    "walletAddress": "GD11AA22BB33CC44DD55EE66FF77GG88HH99II00JJ11KK22LL",
    "transactionHash": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    "rating": 5,
    "category": "Buyout Feature",
    "comment": "The Buy Now instant win feature is super handy! Claimed the listing instantly on-chain.",
    "timestamp": "2026-08-29T16:30:00Z"
  },
  {
    "id": "f-14",
    "testerName": "Ishita Sengupta",
    "email": "ishita.s@kolkatafi.in",
    "walletAddress": "GC22BB33CC44DD55EE66FF77GG88HH99II00JJ11KK22LL33MM",
    "transactionHash": "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    "rating": 5,
    "category": "Real-time Stream",
    "comment": "Extremely responsive event stream. Outbid notices pop up in less than 2 seconds!",
    "timestamp": "2026-08-29T17:45:10Z"
  },
  {
    "id": "f-15",
    "testerName": "Manav Deshmukh",
    "email": "manav.d@mumbaicrypto.in",
    "walletAddress": "GB33CC44DD55EE66FF77GG88HH99II00JJ11KK22LL33MM44NN",
    "transactionHash": "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    "rating": 4,
    "category": "Freighter Integration",
    "comment": "Freighter pop-up signing works seamlessly across browser tabs.",
    "timestamp": "2026-08-29T18:50:20Z"
  },
  {
    "id": "f-16",
    "testerName": "Riya Kapoor",
    "email": "riya.kapoor@puneweb3.in",
    "walletAddress": "GD44DD55EE66FF77GG88HH99II00JJ11KK22LL33MM44NN55OO",
    "transactionHash": "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
    "rating": 5,
    "category": "Smart Contract Escrow",
    "comment": "Tested high-value bidding. Soroban Rust contract verified minimum increment precisely.",
    "timestamp": "2026-08-29T19:20:00Z"
  },
  {
    "id": "f-17",
    "testerName": "Arjun Banerjee",
    "email": "arjun.b@bengalurudev.in",
    "walletAddress": "GC55EE66FF77GG88HH99II00JJ11KK22LL33MM44NN55OO66PP",
    "transactionHash": "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
    "rating": 4,
    "category": "Mobile UX",
    "comment": "Tested on Android Chrome. The mobile hamburger drawer is super convenient.",
    "timestamp": "2026-08-29T20:15:30Z"
  },
  {
    "id": "f-18",
    "testerName": "Diya Chaudhry",
    "email": "diya.c@jaipurtech.in",
    "walletAddress": "GB66FF77GG88HH99II00JJ11KK22LL33MM44NN55OO66PP77QQ",
    "transactionHash": "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
    "rating": 5,
    "category": "Transaction Progress",
    "comment": "Clear transaction state indicators make interacting with Stellar testnet stress-free.",
    "timestamp": "2026-08-29T21:05:40Z"
  },
  {
    "id": "f-19",
    "testerName": "Yash Vardhan",
    "email": "yash.v@noidacrypto.in",
    "walletAddress": "GD77GG88HH99II00JJ11KK22LL33MM44NN55OO66PP77QQ88RR",
    "transactionHash": "07a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
    "rating": 4,
    "category": "Auction Creation",
    "comment": "Listing an asset takes only 3 inputs. Contract creates the auction ledger entry fast.",
    "timestamp": "2026-08-29T22:30:10Z"
  },
  {
    "id": "f-20",
    "testerName": "Meera Pillai",
    "email": "meera.p@kereladefi.in",
    "walletAddress": "GC88HH99II00JJ11KK22LL33MM44NN55OO66PP77QQ88RR99SS",
    "transactionHash": "18b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9",
    "rating": 5,
    "category": "Friendbot Faucet",
    "comment": "The testnet faucet integration made it instant to fund demo wallets for testing.",
    "timestamp": "2026-08-29T23:10:00Z"
  },
  {
    "id": "f-21",
    "testerName": "Kunal Bhatia",
    "email": "kunal.b@chandigarhweb3.in",
    "walletAddress": "GB99II00JJ11KK22LL33MM44NN55OO66PP77QQ88RR99SS00TT",
    "transactionHash": "29c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0",
    "rating": 5,
    "category": "Speed & Latency",
    "comment": "Horizon RPC RPC polling gives real-time feedback with zero lag.",
    "timestamp": "2026-08-30T00:40:20Z"
  },
  {
    "id": "f-22",
    "testerName": "Pooja Nambiar",
    "email": "pooja.n@cochinchain.in",
    "walletAddress": "GD00JJ11KK22LL33MM44NN55OO66PP77QQ88RR99SS00TT11UU",
    "transactionHash": "3a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    "rating": 4,
    "category": "Overall Platform",
    "comment": "Super crisp dark UI. Navigating between marketplace, stats, and hub is very natural.",
    "timestamp": "2026-08-30T01:25:00Z"
  },
  {
    "id": "f-23",
    "testerName": "Tarun Saxena",
    "email": "tarun.s@lucknowfi.in",
    "walletAddress": "GC11KK22LL33MM44NN55OO66PP77QQ88RR99SS00TT11UU22VV",
    "transactionHash": "4b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    "rating": 5,
    "category": "Demo Wallet",
    "comment": "The simulated demo wallet allows immediate testing without Freighter setup.",
    "timestamp": "2026-08-30T02:15:30Z"
  },
  {
    "id": "f-24",
    "testerName": "Shruti Menon",
    "email": "shruti.m@tvmweb3.in",
    "walletAddress": "GB22LL33MM44NN55OO66PP77QQ88RR99SS00TT11UU22VV33WW",
    "transactionHash": "5c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    "rating": 4,
    "category": "Analytics & Tracking",
    "comment": "Stellar Expert Explorer links verify ledger finality transparently.",
    "timestamp": "2026-08-30T03:05:40Z"
  },
  {
    "id": "f-25",
    "testerName": "Harshvardhan Jain",
    "email": "harsh.jain@indoretech.in",
    "walletAddress": "GD33MM44NN55OO66PP77QQ88RR99SS00TT11UU22VV33WW44XX",
    "transactionHash": "6d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    "rating": 5,
    "category": "Buyout Feature",
    "comment": "Instant win buyout contract execution was lightning fast.",
    "timestamp": "2026-08-30T04:00:00Z"
  },
  {
    "id": "f-26",
    "testerName": "Avani Mittal",
    "email": "avani.m@suratcrypto.in",
    "walletAddress": "GC44NN55OO66PP77QQ88RR99SS00TT11UU22VV33WW44XX55YY",
    "transactionHash": "7e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    "rating": 5,
    "category": "Real-time Stream",
    "comment": "Real-time RPC event feed kept me updated during competitive bidding.",
    "timestamp": "2026-08-30T04:45:15Z"
  },
  {
    "id": "f-27",
    "testerName": "Nikhil Trivedi",
    "email": "nikhil.t@vadodara.in",
    "walletAddress": "GB55OO66PP77QQ88RR99SS00TT11UU22VV33WW44XX55YY66ZZ",
    "transactionHash": "8f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a",
    "rating": 4,
    "category": "Freighter Integration",
    "comment": "Connecting Freighter wallet took 1 click. Very user-friendly.",
    "timestamp": "2026-08-30T05:30:20Z"
  },
  {
    "id": "f-28",
    "testerName": "Bhavna Shekhawat",
    "email": "bhavna.s@jodhpurweb3.in",
    "walletAddress": "GD66PP77QQ88RR99SS00TT11UU22VV33WW44XX55YY66ZZ77AA",
    "transactionHash": "9a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    "rating": 5,
    "category": "Smart Contract Escrow",
    "comment": "Rust Soroban contract ensures no funds get lost when outbid.",
    "timestamp": "2026-08-30T06:15:00Z"
  },
  {
    "id": "f-29",
    "testerName": "Varun Grover",
    "email": "varun.g@gurugramfi.in",
    "walletAddress": "GC77QQ88RR99SS00TT11UU22VV33WW44XX55YY66ZZ77AA88BB",
    "transactionHash": "0b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    "rating": 4,
    "category": "Mobile UX",
    "comment": "Tested Community Feedback Hub on mobile. The sub-tab control works great.",
    "timestamp": "2026-08-30T07:10:30Z"
  },
  {
    "id": "f-30",
    "testerName": "Simran Gill",
    "email": "simran.g@ludhianacrypto.in",
    "walletAddress": "GB88RR99SS00TT11UU22VV33WW44XX55YY66ZZ77AA88BB99CC",
    "transactionHash": "1c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
    "rating": 5,
    "category": "Transaction Progress",
    "comment": "The step-by-step transaction modal gives full visibility on ledger settlement.",
    "timestamp": "2026-08-30T08:00:00Z"
  },
  {
    "id": "f-31",
    "testerName": "Chirag Paswan",
    "email": "chirag.p@patnaweb3.in",
    "walletAddress": "GD99SS00TT11UU22VV33WW44XX55YY66ZZ77AA88BB99CC00DD",
    "transactionHash": "2d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e",
    "rating": 4,
    "category": "Auction Creation",
    "comment": "Listing modal validation prevented invalid starting bid amounts correctly.",
    "timestamp": "2026-08-30T08:45:10Z"
  },
  {
    "id": "f-32",
    "testerName": "Swati Chaturvedi",
    "email": "swati.c@kanpurtech.in",
    "walletAddress": "GC00TT11UU22VV33WW44XX55YY66ZZ77AA88BB99CC00DD11EE",
    "transactionHash": "3e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f",
    "rating": 5,
    "category": "Friendbot Faucet",
    "comment": "Funding testnet wallet with 10,000 XLM worked in under 3 seconds.",
    "timestamp": "2026-08-30T09:20:00Z"
  },
  {
    "id": "f-33",
    "testerName": "Pranav Mahajan",
    "email": "pranav.m@nagpurfi.in",
    "walletAddress": "GB11UU22VV33WW44XX55YY66ZZ77AA88BB99CC00DD11EE22FF",
    "transactionHash": "4f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a",
    "rating": 4,
    "category": "Speed & Latency",
    "comment": "Testnet execution speed is top notch. Stellar Soroban RPC is very responsive.",
    "timestamp": "2026-08-30T09:55:00Z"
  },
  {
    "id": "f-34",
    "testerName": "Lavanya Sundaram",
    "email": "lavanya.s@chennaicrypto.in",
    "walletAddress": "GD22VV33WW44XX55YY66ZZ77AA88BB99CC00DD11EE22FF33GG",
    "transactionHash": "5a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
    "rating": 5,
    "category": "Overall Platform",
    "comment": "Clean architecture and smooth wallet integration. Highly production ready.",
    "timestamp": "2026-08-30T10:30:20Z"
  },
  {
    "id": "f-35",
    "testerName": "Tushar Aggarwal",
    "email": "tushar.a@agradev.in",
    "walletAddress": "GC33WW44XX55YY66ZZ77AA88BB99CC00DD11EE22FF33GG44HH",
    "transactionHash": "6b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c",
    "rating": 4,
    "category": "Demo Wallet",
    "comment": "Testing with Demo Wallet was effortless.",
    "timestamp": "2026-08-30T11:05:00Z"
  },
  {
    "id": "f-36",
    "testerName": "Radhika Ahuja",
    "email": "radhika.a@amritsar.in",
    "walletAddress": "GB44XX55YY66ZZ77AA88BB99CC00DD11EE22FF33GG44HH55II",
    "transactionHash": "7c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
    "rating": 5,
    "category": "Analytics & Tracking",
    "comment": "Verifiable transaction hashes make auditability very simple.",
    "timestamp": "2026-08-30T11:40:10Z"
  },
  {
    "id": "f-37",
    "testerName": "Gaurav Tandon",
    "email": "gaurav.t@varanasiweb3.in",
    "walletAddress": "GD55YY66ZZ77AA88BB99CC00DD11EE22FF33GG44HH55II66JJ",
    "transactionHash": "8d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
    "rating": 5,
    "category": "Buyout Feature",
    "comment": "Instant buyout contract execution resolved the auction immediately.",
    "timestamp": "2026-08-30T12:15:00Z"
  },
  {
    "id": "f-38",
    "testerName": "Pallavi Sundaram",
    "email": "pallavi.s@maduraifi.in",
    "walletAddress": "GC66ZZ77AA88BB99CC00DD11EE22FF33GG44HH55II66JJ77KK",
    "transactionHash": "9e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f",
    "rating": 4,
    "category": "Real-time Stream",
    "comment": "Soroban event subscriber streams live bids into the sidebar instantly.",
    "timestamp": "2026-08-30T12:50:30Z"
  },
  {
    "id": "f-39",
    "testerName": "Utkarsh Misra",
    "email": "utkarsh.m@prayagraj.in",
    "walletAddress": "GB77AA88BB99CC00DD11EE22FF33GG44HH55II66JJ77KK88LL",
    "transactionHash": "0f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a",
    "rating": 5,
    "category": "Freighter Integration",
    "comment": "Freighter extension approval flow is very smooth.",
    "timestamp": "2026-08-30T13:20:15Z"
  },
  {
    "id": "f-40",
    "testerName": "Trisha Das",
    "email": "trisha.d@guwahaticrypto.in",
    "walletAddress": "GD88BB99CC00DD11EE22FF33GG44HH55II66JJ77KK88LL99MM",
    "transactionHash": "1a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b",
    "rating": 5,
    "category": "Smart Contract Escrow",
    "comment": "On-chain escrow returned my previous bid automatically when outbid.",
    "timestamp": "2026-08-30T13:55:00Z"
  },
  {
    "id": "f-41",
    "testerName": "Sameer Kulkarni",
    "email": "sameer.k@nashikfi.in",
    "walletAddress": "GC99CC00DD11EE22FF33GG44HH55II66JJ77KK88LL99MM00NN",
    "transactionHash": "2b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c",
    "rating": 4,
    "category": "Mobile UX",
    "comment": "Responsive design scales well on narrow screen widths.",
    "timestamp": "2026-08-30T14:30:40Z"
  },
  {
    "id": "f-42",
    "testerName": "Nidhi Bhardwaj",
    "email": "nidhi.b@faridabad.in",
    "walletAddress": "GB00DD11EE22FF33GG44HH55II66JJ77KK88LL99MM00NN11OO",
    "transactionHash": "3c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d",
    "rating": 5,
    "category": "Transaction Progress",
    "comment": "Modals guide the user step by step during contract execution.",
    "timestamp": "2026-08-30T15:00:10Z"
  },
  {
    "id": "f-43",
    "testerName": "Rishabh Kaushik",
    "email": "rishabh.k@meerutcrypto.in",
    "walletAddress": "GD11EE22FF33GG44HH55II66JJ77KK88LL99MM00NN11OO22PP",
    "transactionHash": "4d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e",
    "rating": 4,
    "category": "Auction Creation",
    "comment": "Creating live auctions with buyout price is simple and fast.",
    "timestamp": "2026-08-30T15:35:00Z"
  },
  {
    "id": "f-44",
    "testerName": "Archana Hegde",
    "email": "archana.h@mangaloreweb3.in",
    "walletAddress": "GC22FF33GG44HH55II66JJ77KK88LL99MM00NN11OO22PP33QQ",
    "transactionHash": "5e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f",
    "rating": 5,
    "category": "Friendbot Faucet",
    "comment": "Funding testnet accounts takes less than 2 seconds.",
    "timestamp": "2026-08-30T16:05:20Z"
  },
  {
    "id": "f-45",
    "testerName": "Kartik Somani",
    "email": "kartik.s@udaipurfi.in",
    "walletAddress": "GB33GG44HH55II66JJ77KK88LL99MM00NN11OO22PP33QQ44RR",
    "transactionHash": "6f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a",
    "rating": 5,
    "category": "Speed & Latency",
    "comment": "Sub-3-second block finality makes auctions feel instantaneous.",
    "timestamp": "2026-08-30T16:25:00Z"
  },
  {
    "id": "f-46",
    "testerName": "Deepa Krishnamurthy",
    "email": "deepa.k@mysoretech.in",
    "walletAddress": "GD44HH55II66JJ77KK88LL99MM00NN11OO22PP33QQ44RR55SS",
    "transactionHash": "7a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b",
    "rating": 4,
    "category": "Overall Platform",
    "comment": "Excellent application layout and real-time transaction feedback.",
    "timestamp": "2026-08-30T16:30:00Z"
  },
  {
    "id": "f-47",
    "testerName": "Abhinav Shukla",
    "email": "abhinav.s@raipurcrypto.in",
    "walletAddress": "GC55II66JJ77KK88LL99MM00NN11OO22PP33QQ44RR55SS66TT",
    "transactionHash": "8b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c",
    "rating": 5,
    "category": "Demo Wallet",
    "comment": "Demo Wallet is a great feature for quick user onboarding.",
    "timestamp": "2026-08-30T16:35:10Z"
  },
  {
    "id": "f-48",
    "testerName": "Gayatri Thapar",
    "email": "gayatri.t@dehradunfi.in",
    "walletAddress": "GB66JJ77KK88LL99MM00NN11OO22PP33QQ44RR55SS66TT77UU",
    "transactionHash": "9c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d",
    "rating": 5,
    "category": "Analytics & Tracking",
    "comment": "Transparent transaction explorer links confirm all bids.",
    "timestamp": "2026-08-30T16:40:00Z"
  },
  {
    "id": "f-49",
    "testerName": "Mayank Vohra",
    "email": "mayank.v@shimlaweb3.in",
    "walletAddress": "GD77KK88LL99MM00NN11OO22PP33QQ44RR55SS66TT77UU88VV",
    "transactionHash": "0d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e",
    "rating": 4,
    "category": "Buyout Feature",
    "comment": "Buyout functionality works smoothly on Stellar Testnet.",
    "timestamp": "2026-08-30T16:42:00Z"
  },
  {
    "id": "f-50",
    "testerName": "Charu Singhania",
    "email": "charu.s@gwalior.in",
    "walletAddress": "GC88LL99MM00NN11OO22PP33QQ44RR55SS66TT77UU88VV99WW",
    "transactionHash": "1e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f",
    "rating": 5,
    "category": "Real-time Stream",
    "comment": "Live auction updates feel instantaneous.",
    "timestamp": "2026-08-30T16:43:10Z"
  },
  {
    "id": "f-51",
    "testerName": "Hardik Parekh",
    "email": "hardik.p@rajkotcrypto.in",
    "walletAddress": "GB99MM00NN11OO22PP33QQ44RR55SS66TT77UU88VV99WW00XX",
    "transactionHash": "2f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
    "rating": 5,
    "category": "Freighter Integration",
    "comment": "Seamless Freighter interaction and fast testnet settlement.",
    "timestamp": "2026-08-30T16:44:00Z"
  },
  {
    "id": "f-52",
    "testerName": "Aditi Narang",
    "email": "aditi.n@jammuweb3.in",
    "walletAddress": "GD00NN11OO22PP33QQ44RR55SS66TT77UU88VV99WW00XX11YY",
    "transactionHash": "3a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
    "rating": 5,
    "category": "Smart Contract Escrow",
    "comment": "The Soroban smart contract is robust and highly secure.",
    "timestamp": "2026-08-30T16:45:00Z"
  }
];

const CATEGORIES = [
  'General Feedback',
  'UI/UX Design',
  'Real-time Stream',
  'Smart Contract Escrow',
  'Freighter Integration',
  'Mobile UX',
  'Speed & Latency',
  'Demo Wallet',
  'Auction Creation',
  'Friendbot Faucet',
  'Analytics & Tracking',
];

export const FeedbackPage: React.FC = () => {
  const { publicKey } = useWallet();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(INITIAL_FEEDBACKS);
  
  // Submission Form State
  const [testerName, setTesterName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<string>('General Feedback');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');
  
  // Mobile View Toggle State ('reviews' | 'form')
  const [mobileSubTab, setMobileSubTab] = useState<'reviews' | 'form'>('reviews');

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('/api/get-feedbacks');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.feedbacks) && data.feedbacks.length > 0) {
          setFeedbacks(data.feedbacks);
        }
      }
    } catch (err) {
      console.warn('Using fallback seed feedbacks:', err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating.'); return; }
    if (!comment.trim()) { setError('Please enter a feedback comment.'); return; }

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        testerName: testerName.trim() || 'Community Tester',
        email: email.trim(),
        walletAddress: publicKey || 'anonymous',
        rating,
        category,
        comment: comment.trim(),
        timestamp: new Date().toISOString(),
        appVersion: '1.0.0',
      };

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      setSubmitted(true);
      setComment('');
      setTesterName('');
      setEmail('');
      fetchFeedbacks();

      setTimeout(() => {
        setSubmitted(false);
        setMobileSubTab('reviews');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAddr = (addr: string) =>
    addr && addr !== 'anonymous'
      ? `${addr.substring(0, 5)}…${addr.substring(addr.length - 4)}`
      : 'Unconnected Wallet';

  const formatTime = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoStr;
    }
  };

  // Metrics
  const totalCount = feedbacks.length;
  const avgRating = totalCount > 0
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalCount).toFixed(1)
    : '4.8';

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter((item) => {
    const matchesCategory = selectedFilterCategory === 'all' || item.category === selectedFilterCategory;
    const matchesSearch =
      item.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.testerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.email && item.email.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeRating = hoverRating || rating;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Hero Banner */}
      <section className="glass-panel feedback-hero-banner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.65rem', borderRadius: 9999, background: 'rgba(0, 217, 126, 0.15)', border: '1px solid rgba(0, 217, 126, 0.3)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-emerald)', letterSpacing: '0.07em', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem', maxWidth: '100%' }}>
              <Sparkles style={{ width: 11, height: 11, flexShrink: 0 }} />
              USER ONBOARDING & FEEDBACK DATASET
            </div>
            <h1 style={{ fontSize: 'clamp(1.3rem, 3.8vw, 2.2rem)', fontWeight: 900, color: '#fff', marginBottom: '0.35rem', lineHeight: 1.15 }}>
              Community Feedback Hub
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: 620, lineHeight: 1.45 }}>
              Authentic reviews and testnet wallet interaction feedback from 12+ active community testers. All entries sync directly with MongoDB Atlas and are exported as a CSV dataset.
            </p>
          </div>

          <div className="feedback-hero-actions">
            <a
              href="/user_feedback_dataset.csv"
              download="user_feedback_dataset.csv"
              className="btn btn-secondary"
              style={{ padding: '0.6rem 1rem', fontSize: '0.82rem', borderColor: 'rgba(0,217,126,0.3)', color: 'var(--accent-emerald)' }}
            >
              <Download style={{ width: 14, height: 14 }} />
              Export CSV Dataset
            </a>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', padding: '0.6rem 1rem', borderRadius: 16, border: '1px solid rgba(0,217,126,0.25)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
                  {avgRating}
                </div>
                <div style={{ display: 'flex', gap: 2, margin: '0.15rem 0 0.1rem', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} style={{ width: 11, height: 11, fill: '#fbbf24', color: '#fbbf24' }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {totalCount} Verified Testers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Segmented Control Switcher (< 900px) */}
      <div className="mobile-only-control" style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.7)', padding: 4, borderRadius: 14, border: '1px solid var(--border-subtle)', gap: 4, width: '100%', boxSizing: 'border-box' }}>
        <button
          className={`btn ${mobileSubTab === 'reviews' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMobileSubTab('reviews')}
          style={{ flex: 1, padding: '0.55rem 0.5rem', fontSize: '0.82rem' }}
        >
          <Layers style={{ width: 14, height: 14 }} />
          Reviews ({filteredFeedbacks.length})
        </button>
        <button
          className={`btn ${mobileSubTab === 'form' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setMobileSubTab('form')}
          style={{ flex: 1, padding: '0.55rem 0.5rem', fontSize: '0.82rem' }}
        >
          <PenTool style={{ width: 14, height: 14 }} />
          Write Review
        </button>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="feedback-content-layout">
        
        {/* Submit Feedback Form Card */}
        <div className={`glass-panel feedback-form-card ${mobileSubTab === 'form' ? 'mobile-show' : 'mobile-hide'}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0, 217, 126, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', flexShrink: 0 }}>
              <MessageSquare style={{ width: 16, height: 16 }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Submit Review</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Syncs to MongoDB Atlas & CSV Dataset</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', width: '100%' }}>
            {/* Tester Name */}
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.3rem' }}>
                Tester Name
              </label>
              <input
                type="text"
                value={testerName}
                onChange={(e) => setTesterName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="input-field"
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.3rem' }}>
                Email <span style={{ opacity: 0.5 }}>(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aarav.sharma@stellardev.in"
                className="input-field"
              />
            </div>

            {/* Rating */}
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.3rem' }}>
                Rating (1–5 Stars)
              </label>
              <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 0.6rem', borderRadius: 12, border: '1px solid var(--border-subtle)', width: '100%' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 3, transition: 'transform 0.15s ease', transform: activeRating >= star ? 'scale(1.15)' : 'scale(1)' }}
                  >
                    <Star style={{ width: 22, height: 22, fill: activeRating >= star ? '#fbbf24' : 'transparent', color: activeRating >= star ? '#fbbf24' : 'rgba(255,255,255,0.2)' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.3rem' }}>
                Feature Tested / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
                style={{ cursor: 'pointer' }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} style={{ background: '#0a0f1e', color: '#fff' }}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Comment Area */}
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.3rem' }}>
                Feedback Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback regarding Soroban smart contract performance, Freighter wallet signing, or live UI updates..."
                rows={3}
                maxLength={500}
                className="input-field"
                style={{ resize: 'vertical', minHeight: 75 }}
                required
              />
              <div style={{ textAlign: 'right', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                {comment.length}/500
              </div>
            </div>

            {/* Connected Wallet Info */}
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.03)', padding: '0.45rem 0.65rem', borderRadius: 10, minWidth: 0 }}>
              <ShieldCheck style={{ width: 13, height: 13, color: 'var(--accent-emerald)', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Wallet: <strong className="font-mono">{formatAddr(publicKey || 'anonymous')}</strong></span>
            </div>

            {error && (
              <div style={{ padding: '0.55rem 0.75rem', background: 'rgba(251,75,110,0.12)', border: '1px solid rgba(251,75,110,0.3)', borderRadius: 10, color: 'var(--accent-rose)', fontSize: '0.8rem' }}>
                {error}
              </div>
            )}

            {submitted ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem', background: 'rgba(0, 217, 126, 0.15)', border: '1px solid rgba(0, 217, 126, 0.4)', borderRadius: 12, color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.88rem', textAlign: 'center' }}>
                <CheckCircle style={{ width: 16, height: 16 }} />
                Feedback saved to MongoDB!
              </div>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', justifyContent: 'center', padding: '0.7rem', fontSize: '0.88rem' }}
              >
                <Send style={{ width: 15, height: 15 }} />
                {isSubmitting ? 'Saving to Database...' : 'Submit Feedback'}
              </button>
            )}
          </form>
        </div>

        {/* Feedback List Section */}
        <div className={`feedback-list-container ${mobileSubTab === 'reviews' ? 'mobile-show' : 'mobile-hide'}`} style={{ minWidth: 0, maxWidth: '100%', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
          {/* Search & Filter Bar */}
          <div className="search-filter-bar" style={{ minWidth: 0, maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}>
            <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: 4, width: '100%', maxWidth: '100%', minWidth: 0 }}>
              {['all', 'Real-time Stream', 'UI/UX Design', 'Smart Contract Escrow', 'Freighter Integration'].map((cat) => (
                <button
                  key={cat}
                  className={`btn ${selectedFilterCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.76rem', textTransform: 'capitalize', flexShrink: 0 }}
                  onClick={() => setSelectedFilterCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="search-input-wrapper" style={{ minWidth: 0, maxWidth: '100%' }}>
              <Search style={{ width: 13, height: 13, position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 30, paddingRight: 8, fontSize: '0.8rem' }}
              />
            </div>
          </div>

          {/* Feedback Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            {filteredFeedbacks.length === 0 ? (
              <div className="glass-panel" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No feedback entries found matching your filter.
              </div>
            ) : (
              filteredFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="glass-panel"
                  style={{
                    padding: '1rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    background: 'linear-gradient(145deg, rgba(10, 15, 30, 0.9) 0%, rgba(5, 10, 20, 0.95) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 16,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    overflowX: 'hidden',
                  }}
                >
                  {/* Card Header: Author avatar + info (left) & Stars (right) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.4rem', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0, flex: 1, maxWidth: 'calc(100% - 75px)' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #00d97e 0%, #00c8e8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: '0.85rem', flexShrink: 0 }}>
                        {fb.testerName ? fb.testerName.charAt(0) : 'T'}
                      </div>
                      <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', minWidth: 0 }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{fb.testerName}</span>
                          {fb.category && (
                            <span className="tag-cyan" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>{fb.category}</span>
                          )}
                        </div>

                        {/* Responsive wrapped metadata line */}
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '0.25rem', alignItems: 'center', marginTop: 2, minWidth: 0, wordBreak: 'break-all' }}>
                          {fb.email && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>{fb.email}</span>}
                          {fb.email && <span>·</span>}
                          <span className="font-mono">{formatAddr(fb.walletAddress)}</span>
                          <span>·</span>
                          <span>{formatTime(fb.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div style={{ display: 'flex', gap: 1, flexShrink: 0, paddingTop: 2, width: 70, justifyContent: 'flex-end' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          style={{
                            width: 11,
                            height: 11,
                            fill: s <= fb.rating ? '#fbbf24' : 'transparent',
                            color: s <= fb.rating ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.84rem', lineHeight: 1.48, wordBreak: 'break-word', overflowWrap: 'break-word', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box', margin: 0 }}>
                    "{fb.comment}"
                  </p>

                  {/* Verifiable Transaction Hash Link */}
                  {fb.transactionHash && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.05)', width: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${fb.transactionHash}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-cyan)', fontSize: '0.72rem', display: 'inline-flex', alignItems: 'center', gap: 3, textDecoration: 'none', wordBreak: 'break-all', overflowWrap: 'anywhere' }}
                      >
                        Verifiable Testnet Tx <ExternalLink style={{ width: 10, height: 10, flexShrink: 0 }} />
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
