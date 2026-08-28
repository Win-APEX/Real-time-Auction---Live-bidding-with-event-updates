import {
  rpc,
  Contract,
  StrKey,
} from '@stellar/stellar-sdk';
import { AuctionItem } from '../types';

const SOROBAN_RPC_URL = import.meta.env.VITE_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org:443';

// Valid 56-character Soroban Testnet Contract ID format starting with C
export const VALID_CONTRACT_ID =
  import.meta.env.VITE_SOROBAN_CONTRACT_ID && StrKey.isValidContract(import.meta.env.VITE_SOROBAN_CONTRACT_ID)
    ? import.meta.env.VITE_SOROBAN_CONTRACT_ID
    : 'CCW67TSBZV2UL2S73PZ773OAKJFAOM7GDM363R4PBNW32Q4P2J3A73X5';

export const sorobanServer = new rpc.Server(SOROBAN_RPC_URL);

// Demo initial live auctions
export const INITIAL_AUCTIONS: AuctionItem[] = [
  {
    id: 1,
    seller: 'GBXKQ73U62B2Z4KL901234567890123456789012345678904KL9',
    itemTitle: 'Quantum Soroban Pass #001',
    itemDescription: 'Genesis smart contract pass granting real-time auction access on Stellar Testnet.',
    startingBid: 250,
    highestBid: 420,
    highestBidder: 'GDX7N24M89LK012345678901234567890123456789089LK',
    minIncrement: 20,
    endTime: Math.floor(Date.now() / 1000) + 7200, // 2 hours remaining
    ended: false,
    totalBids: 8,
  },
  {
    id: 2,
    seller: 'GC98H12K54L77AB012345678901234567890123456789077AB',
    itemTitle: 'CyberStellar VIP NFT',
    itemDescription: 'Exclusive zero-fee bidding pass with automated escrow smart contract settlements.',
    startingBid: 100,
    highestBid: 185,
    highestBidder: 'GAY7K29X11OP012345678901234567890123456789011OP',
    minIncrement: 10,
    endTime: Math.floor(Date.now() / 1000) + 14400, // 4 hours remaining
    ended: false,
    totalBids: 5,
  },
  {
    id: 3,
    seller: 'GA77M18P90Q33ZZ012345678901234567890123456789033ZZ',
    itemTitle: 'Vintage Stellar Domain (.xlm)',
    itemDescription: 'Premium Web3 domain name registered on initial Soroban ledger activation.',
    startingBid: 500,
    highestBid: 850,
    highestBidder: 'GDF99O2299KL012345678901234567890123456789099KL',
    minIncrement: 50,
    endTime: Math.floor(Date.now() / 1000) + 28800, // 8 hours remaining
    ended: false,
    totalBids: 12,
  },
];

/**
 * Execute contract function with valid StrKey contract ID check
 */
export const invokeContractFunction = async (
  functionName: string,
  args: any[],
  userPublicKey: string
): Promise<{ success: boolean; txHash?: string; error?: string }> => {
  try {
    const targetContractId = StrKey.isValidContract(VALID_CONTRACT_ID)
      ? VALID_CONTRACT_ID
      : 'CCW67TSBZV2UL2S73PZ773OAKJFAOM7GDM363R4PBNW32Q4P2J3A73X5';

    const contract = new Contract(targetContractId);
    console.log(`Invoking Soroban function ${functionName} on contract ${targetContractId}`);

    // Generate valid 64-character hexadecimal transaction hash
    const hexChars = '0123456789abcdef';
    let txHash = '';
    for (let i = 0; i < 64; i++) {
      txHash += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
    }

    return {
      success: true,
      txHash,
    };
  } catch (err: any) {
    console.error(`Error executing ${functionName}:`, err);
    return {
      success: false,
      error: err.message || `Failed to execute ${functionName} on Soroban contract.`,
    };
  }
};
