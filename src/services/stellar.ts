import {
  isAllowed,
  setAllowed,
  getPublicKey,
  signTransaction,
} from '@stellar/freighter-api';
import { Horizon, Keypair } from '@stellar/stellar-sdk';

const TESTNET_HORIZON_URL = 'https://horizon-testnet.stellar.org';
const horizonServer = new Horizon.Server(TESTNET_HORIZON_URL);

export interface StellarWalletDetails {
  publicKey: string;
  balance: number;
  network: string;
}

/**
 * Check if Freighter extension object is injected into browser window
 */
export const isFreighterAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as any).freighter ||
    (window as any).stellar ||
    (window as any).StellarFreighter
  );
};

/**
 * Connect to Freighter wallet and retrieve public key
 */
export const connectFreighterWallet = async (): Promise<string> => {
  try {
    // 1. Try direct getPublicKey or setAllowed prompt
    try {
      const allowed = await isAllowed();
      if (!allowed) {
        await setAllowed();
      }
    } catch (e) {
      console.warn('isAllowed/setAllowed call warning:', e);
      // Fallthrough to getPublicKey or requestAccess
    }

    const keyResult = await getPublicKey();
    
    // Handle freighter API string response or object format
    if (typeof keyResult === 'string' && keyResult.length > 0) {
      return keyResult;
    } else if (keyResult && (keyResult as any).publicKey) {
      return (keyResult as any).publicKey;
    } else if (keyResult && (keyResult as any).error) {
      throw new Error((keyResult as any).error);
    }

    throw new Error('Freighter extension did not return a public key.');
  } catch (error: any) {
    console.error('Failed to connect Freighter:', error);

    // If extension is completely missing in browser
    if (!isFreighterAvailable()) {
      throw new Error(
        'Freighter Wallet extension is not installed in your browser. Please install Freighter from https://freighter.app or use Testnet Demo Wallet.'
      );
    }

    throw new Error(
      error.message || 'Freighter connection prompt closed or locked. Please open your Freighter extension and unlock it.'
    );
  }
};

/**
 * Generate a real Stellar Testnet Keypair funded via Friendbot (fallback mode)
 */
export const createFundedDemoWallet = async (): Promise<{ publicKey: string; balance: number }> => {
  const pair = Keypair.random();
  const pubKey = pair.publicKey();

  try {
    await fetch(`https://friendbot.stellar.org?addr=${pubKey}`);
    const balance = await fetchXlmBalance(pubKey);
    return { publicKey: pubKey, balance: balance || 10000 };
  } catch (err) {
    return { publicKey: pubKey, balance: 10000 };
  }
};

/**
 * Fetch connected account's XLM balance from Horizon Testnet
 */
export const fetchXlmBalance = async (publicKey: string): Promise<number> => {
  try {
    const account = await horizonServer.loadAccount(publicKey);
    const nativeBalance = account.balances.find(
      (b: any) => b.asset_type === 'native'
    );
    return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
  } catch (error: any) {
    console.warn(`Account ${publicKey} not found on Horizon Testnet. Defaulting initial balance.`);
    return 100;
  }
};

/**
 * Sign XDR transaction string using Freighter
 */
export const signWithFreighter = async (
  xdr: string,
  networkPassphrase = 'Test SDF Network ; August 2015'
): Promise<string> => {
  try {
    const signedXdr = await signTransaction(xdr, {
      networkPassphrase,
    });
    return signedXdr;
  } catch (error: any) {
    console.error('Freighter sign error:', error);
    throw new Error(error.message || 'Transaction signing declined by user.');
  }
};
