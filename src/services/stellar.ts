import {
  isAllowed,
  setAllowed,
  getPublicKey,
  getNetwork,
  signTransaction,
} from '@stellar/freighter-api';
import { Horizon } from '@stellar/stellar-sdk';

const TESTNET_HORIZON_URL = 'https://horizon-testnet.stellar.org';
const horizonServer = new Horizon.Server(TESTNET_HORIZON_URL);

export interface StellarWalletDetails {
  publicKey: string;
  balance: number;
  network: string;
}

/**
 * Check if Freighter browser extension is installed
 */
export const checkFreighterInstalled = async (): Promise<boolean> => {
  try {
    const allowed = await isAllowed();
    return !!allowed;
  } catch (err) {
    console.warn('Freighter not detected or errored:', err);
    return false;
  }
};

/**
 * Connect to Freighter wallet and retrieve public key
 */
export const connectFreighterWallet = async (): Promise<string> => {
  try {
    const isInstalled = await checkFreighterInstalled();
    if (!isInstalled) {
      // Prompt freighter access
      await setAllowed();
    }
    const keyResult = await getPublicKey();
    if (!keyResult) {
      throw new Error('No public key returned from Freighter.');
    }
    return keyResult;
  } catch (error: any) {
    console.error('Failed to connect Freighter:', error);
    throw new Error(error.message || 'Freighter connection failed. Please unlock your extension.');
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
    console.warn(`Account ${publicKey} not found on Testnet or unfunded. Returning 0 XLM.`);
    return 0;
  }
};

/**
 * Request testnet XLM funding via Friendbot for new test accounts
 */
export const requestFriendbotFunding = async (publicKey: string): Promise<boolean> => {
  try {
    const res = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
    const data = await res.json();
    return !!data;
  } catch (err) {
    console.error('Friendbot funding error:', err);
    return false;
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
