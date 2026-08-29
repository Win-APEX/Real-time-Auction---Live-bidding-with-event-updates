import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import { Clock, User, Award, Flame, TrendingUp } from 'lucide-react';

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
        setTimeLeft('Ended');
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
        setTimeUrgent(diff < 3600);
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

  // Random subtle accent color per card for visual variety
  const accentColors = [
    { from: '#00d97e', to: '#00c8e8' },
    { from: '#a78bfa', to: '#00c8e8' },
    { from: '#00c8e8', to: '#00d97e' },
    { from: '#fbbf24', to: '#fb923c' },
  ];
  const accent = accentColors[auction.id % accentColors.length];

  return (
    <div
      className="auction-card-glow"
      style={{
        background: 'linear-gradient(145deg, rgba(10, 15, 30, 0.9) 0%, rgba(5, 10, 20, 0.95) 100%)',
        border: isExpired ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.15rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Top gradient accent bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 2,
        background: isExpired ? 'rgba(255,255,255,0.08)' : `linear-gradient(90deg, ${accent.from} 0%, ${accent.to} 100%)`,
        borderRadius: '20px 20px 0 0',
      }} />

      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={isExpired ? '' : 'live-badge'} style={
          isExpired ? {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.6rem',
            borderRadius: 9999,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.06)',
            color: 'var(--text-dim)',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'var(--font-mono)',
          } : {}
        }>
          {!isExpired && <div className="live-dot" />}
          {isExpired ? 'CLOSED' : 'LIVE'}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.82rem',
          color: isExpired ? 'var(--text-dim)' : timeUrgent ? 'var(--accent-rose)' : 'var(--accent-cyan)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 600,
        }}>
          <Clock style={{ width: 13, height: 13 }} />
          <span>{timeLeft}</span>
        </div>
      </div>

      {/* Item Title & Description */}
      <div>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 800,
          marginBottom: '0.4rem',
          color: '#fff',
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
        }}>
          {auction.itemTitle}
        </h3>
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          lineHeight: 1.55,
          minHeight: '2.6rem',
        }}>
          {auction.itemDescription}
        </p>
      </div>

      {/* Bid Stats */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: 14,
        padding: '0.9rem 1rem',
        border: `1px solid ${isExpired ? 'rgba(255,255,255,0.05)' : 'rgba(0, 217, 126, 0.15)'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle inner glow */}
        {!isExpired && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 0% 50%, rgba(0, 217, 126, 0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
        )}
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
            Highest Bid
          </span>
          <span style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            color: isExpired ? 'var(--text-muted)' : 'var(--accent-emerald)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '-0.02em',
            textShadow: isExpired ? 'none' : '0 0 20px rgba(0,217,126,0.4)',
          }}>
            {auction.highestBid} <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>XLM</span>
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>
            Total Bids
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' }}>
            <TrendingUp style={{ width: 14, height: 14, color: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
              {auction.totalBids}
            </span>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <User style={{ width: 12, height: 12 }} />
          <span>Seller: <span className="font-mono" style={{ color: 'var(--text-main)' }}>{formatAddr(auction.seller)}</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Award style={{ width: 12, height: 12, color: 'var(--accent-amber)' }} />
          <span>Top: <span className="font-mono" style={{ color: 'var(--text-main)' }}>{formatAddr(auction.highestBidder)}</span></span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        className="btn btn-primary"
        style={{
          width: '100%',
          justifyContent: 'center',
          fontSize: '0.92rem',
          padding: '0.75rem',
          borderRadius: 14,
          marginTop: '0.1rem',
          background: isExpired
            ? 'rgba(255,255,255,0.06)'
            : `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
          color: isExpired ? 'var(--text-dim)' : '#000',
          boxShadow: isExpired ? 'none' : `0 4px 20px rgba(0, 217, 126, 0.3)`,
          cursor: isExpired ? 'not-allowed' : 'pointer',
        }}
        disabled={isExpired}
        onClick={() => onBidClick(auction)}
      >
        <Flame style={{ width: 16, height: 16 }} />
        {isExpired ? 'Auction Ended' : `Place Bid — Min ${minNextBid} XLM`}
      </button>
    </div>
  );
};
