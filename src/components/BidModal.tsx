import React, { useState } from 'react';
import { AuctionItem } from '../types';
import { useWallet } from '../context/WalletContext';
import { X, Flame, AlertCircle } from 'lucide-react';

interface BidModalProps {
  auction: AuctionItem | null;
  onClose: () => void;
  onSubmitBid: (auctionId: number, amount: number) => void;
}

export const BidModal: React.FC<BidModalProps> = ({ auction, onClose, onSubmitBid }) => {
  if (!auction) return null;

  const { isConnected, balance, connectWallet } = useWallet();

  const minRequiredBid = auction.totalBids === 0
    ? auction.startingBid
    : auction.highestBid + auction.minIncrement;

  const [bidAmount, setBidAmount] = useState<number>(minRequiredBid);
  const [error, setError] = useState<string | null>(null);

  const handlePercentageAdd = (pct: number) => {
    const calculated = Math.ceil(minRequiredBid * (1 + pct / 100));
    setBidAmount(calculated);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setError('Please connect your Freighter wallet to place a bid.');
      return;
    }

    if (bidAmount < minRequiredBid) {
      setError(`Bid must be at least ${minRequiredBid} XLM (Minimum required increment: ${auction.minIncrement} XLM).`);
      return;
    }

    if (balance !== null && bidAmount > balance) {
      setError(`Insufficient XLM balance. You have ${balance.toFixed(2)} XLM.`);
      return;
    }

    setError(null);
    onSubmitBid(auction.id, bidAmount);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Place Bid</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <div
          style={{
            background: 'rgba(15, 23, 42, 0.6)',
            borderRadius: 12,
            padding: '1rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-light)',
          }}
        >
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auction Item</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: '0.25rem 0' }}>
            {auction.itemTitle}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            <span>Current Highest Bid:</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{auction.highestBid} XLM</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              Your Bid Amount (XLM)
            </label>
            <input
              type="number"
              className="input-field font-mono"
              value={bidAmount}
              onChange={(e) => {
                setBidAmount(Number(e.target.value));
                setError(null);
              }}
              min={minRequiredBid}
              step={1}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[10, 25, 50].map((pct) => (
              <button
                key={pct}
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', justifyContent: 'center' }}
                onClick={() => handlePercentageAdd(pct)}
              >
                +{pct}%
              </button>
            ))}
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 10,
                padding: '0.75rem',
                color: '#f43f5e',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {!isConnected ? (
            <button type="button" className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={connectWallet}>
              Connect Freighter Wallet
            </button>
          ) : (
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
              <Flame style={{ width: 18, height: 18 }} />
              Confirm & Sign with Freighter ({bidAmount} XLM)
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
