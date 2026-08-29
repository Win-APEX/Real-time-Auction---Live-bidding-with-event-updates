import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import { Clock, User, Award, Flame, Zap, ShieldCheck } from 'lucide-react';

interface AuctionCardProps {
  auction: AuctionItem;
  onBidClick: (auction: AuctionItem) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onBidClick }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [timeUrgent, setTimeUrgent] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = auction.endTime - now;
      if (diff <= 0) {
        setTimeLeft('Auction Closed');
        setIsExpired(true);
        setTimeUrgent(false);
      } else {
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
        );
        setIsExpired(false);
        setTimeUrgent(diff < 3600); // under 1 hour
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const formatAddr = (addr: string) =>
    addr ? `${addr.substring(0, 4)}…${addr.substring(addr.length - 4)}` : 'None';

  const minNextBid = auction.totalBids === 0
    ? auction.startingBid
    : auction.highestBid + auction.minIncrement;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.15rem',
        position: 'relative',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Card Header: Badges & Timer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {!isExpired ? (
            <div className="badge-live">
              <div className="badge-live-dot" />
              <span>LIVE BIDDING</span>
            </div>
          ) : (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, fontFamily: 'var(--font-mono)', padding: '0.2rem 0.6rem', borderRadius: 9999, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
              CLOSED
            </span>
          )}

          {auction.buyoutPrice && auction.buyoutPrice > 0 ? (
            <span className="tag-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Zap style={{ width: 10, height: 10 }} /> BUYOUT
            </span>
          ) : null}
        </div>

        {/* Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'var(--font-mono)', color: isExpired ? 'var(--text-muted)' : timeUrgent ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
          <Clock style={{ width: 13, height: 13 }} />
          <span>{timeLeft}</span>
        </div>
      </div>

      {/* Item Title & Description */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '0.35rem', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
          {auction.itemTitle}
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, minHeight: '2.5rem' }}>
          {auction.itemDescription}
        </p>
      </div>

      {/* Pricing & Bids Stats Grid */}
      <div
        style={{
          background: 'rgba(5, 7, 12, 0.6)',
          borderRadius: 'var(--radius-md)',
          padding: '0.9rem 1rem',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            Highest Bid
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: isExpired ? 'var(--text-muted)' : 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
            {auction.highestBid} <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>XLM</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
            {auction.totalBids === 0 ? 'Starting' : 'Total Bids'}
          </span>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
            {auction.totalBids === 0 ? `${auction.startingBid} XLM` : `${auction.totalBids} bids`}
          </div>
        </div>
      </div>

      {/* Participants Metadata */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <User style={{ width: 12, height: 12 }} />
          <span>Seller: <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatAddr(auction.seller)}</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Award style={{ width: 12, height: 12, color: 'var(--accent-amber)' }} />
          <span>Highest: <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{formatAddr(auction.highestBidder)}</span></span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem', opacity: isExpired ? 0.5 : 1, cursor: isExpired ? 'not-allowed' : 'pointer' }}
        disabled={isExpired}
        onClick={() => onBidClick(auction)}
      >
        <Flame style={{ width: 16, height: 16 }} />
        {isExpired ? 'Auction Ended' : `Place Bid (Min ${minNextBid} XLM)`}
      </button>
    </div>
  );
};
