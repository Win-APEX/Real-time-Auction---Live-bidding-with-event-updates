import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import { Clock, User, Award, Flame } from 'lucide-react';

interface AuctionCardProps {
  auction: AuctionItem;
  onBidClick: (auction: AuctionItem) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onBidClick }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = auction.endTime - now;

      if (diff <= 0) {
        setTimeLeft('Auction Ended');
        setIsExpired(true);
      } else {
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}h ${minutes
            .toString()
            .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
        );
        setIsExpired(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const formatAddr = (addr: string) =>
    addr ? `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}` : 'None';

  const minNextBid = auction.totalBids === 0
    ? auction.startingBid
    : auction.highestBid + auction.minIncrement;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="live-badge">
          <div className="live-dot" />
          <span>{isExpired ? 'CLOSED' : 'LIVE'}</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: isExpired ? 'var(--text-dim)' : 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Clock style={{ width: 14, height: 14 }} />
          <span>{timeLeft}</span>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.35rem', color: '#fff' }}>
          {auction.itemTitle}
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45, minHeight: '2.8rem' }}>
          {auction.itemDescription}
        </p>
      </div>

      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          borderRadius: 12,
          padding: '1rem',
          border: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Highest Bid</span>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {auction.highestBid} XLM
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Bids</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {auction.totalBids}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <User style={{ width: 12, height: 12 }} />
          <span>Seller: <span className="font-mono">{formatAddr(auction.seller)}</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Award style={{ width: 12, height: 12, color: 'var(--accent-amber)' }} />
          <span>Top: <span className="font-mono">{formatAddr(auction.highestBidder)}</span></span>
        </div>
      </div>

      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
        disabled={isExpired}
        onClick={() => onBidClick(auction)}
      >
        <Flame style={{ width: 16, height: 16 }} />
        {isExpired ? 'Auction Ended' : `Place Bid (Min ${minNextBid} XLM)`}
      </button>
    </div>
  );
};
