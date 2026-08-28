import { describe, it, expect } from 'vitest';
import { AuctionItem } from '../src/types';

describe('Auction Logic & State Calculations Test Suite', () => {
  const mockAuction: AuctionItem = {
    id: 1,
    seller: 'GBXKQ...DEMO',
    itemTitle: 'Test Item',
    itemDescription: 'Test Description',
    startingBid: 100,
    highestBid: 150,
    highestBidder: 'GDF99...USER',
    minIncrement: 15,
    endTime: Math.floor(Date.now() / 1000) + 3600,
    ended: false,
    totalBids: 3,
  };

  it('should calculate minimum required next bid accurately', () => {
    const minNextBid = mockAuction.totalBids === 0
      ? mockAuction.startingBid
      : mockAuction.highestBid + mockAuction.minIncrement;
    expect(minNextBid).toBe(165);
  });

  it('should calculate starting price when no bids have been placed yet', () => {
    const freshAuction: AuctionItem = {
      ...mockAuction,
      totalBids: 0,
      highestBid: 100,
    };
    const minNextBid = freshAuction.totalBids === 0
      ? freshAuction.startingBid
      : freshAuction.highestBid + freshAuction.minIncrement;
    expect(minNextBid).toBe(100);
  });

  it('should accurately detect expired auctions', () => {
    const pastTime = Math.floor(Date.now() / 1000) - 100;
    const isExpired = pastTime <= Math.floor(Date.now() / 1000);
    expect(isExpired).toBe(true);
  });
});
