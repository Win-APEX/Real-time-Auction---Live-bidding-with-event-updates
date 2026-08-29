export interface AuctionItem {
  id: number;
  seller: string;
  itemTitle: string;
  itemDescription: string;
  startingBid: number; // in XLM
  highestBid: number;  // in XLM
  highestBidder: string;
  minIncrement: number; // in XLM
  buyoutPrice?: number; // in XLM (optional instant buy price)
  endTime: number;     // Unix timestamp in seconds
  ended: boolean;
  totalBids: number;
}

export interface BidRecord {
  bidder: string;
  amount: number;
  timestamp: number;
}

export interface SorobanEvent {
  id: string;
  type: 'auction_created' | 'bid_placed' | 'auction_ended';
  auctionId: number;
  user: string;
  amount?: number;
  timestamp: number;
  txHash?: string;
}

export type TxStep = 'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'error';

export interface TxStatus {
  step: TxStep;
  message: string;
  txHash?: string;
  error?: string;
}

export type WalletType = 'freighter' | 'albedo' | 'simulated';

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  balance: number | null;
  walletType: WalletType;
  network: string;
  error: string | null;
  isLoading: boolean;
}
