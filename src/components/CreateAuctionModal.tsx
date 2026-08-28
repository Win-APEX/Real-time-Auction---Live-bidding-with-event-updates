import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { X, PlusCircle, AlertCircle } from 'lucide-react';

interface CreateAuctionModalProps {
  onClose: () => void;
  onCreateAuction: (data: {
    itemTitle: string;
    itemDescription: string;
    startingBid: number;
    minIncrement: number;
    durationHours: number;
  }) => void;
}

export const CreateAuctionModal: React.FC<CreateAuctionModalProps> = ({
  onClose,
  onCreateAuction,
}) => {
  const { isConnected, connectWallet } = useWallet();

  const [itemTitle, setItemTitle] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [startingBid, setStartingBid] = useState(50);
  const [minIncrement, setMinIncrement] = useState(5);
  const [durationHours, setDurationHours] = useState(4);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim() || !itemDescription.trim()) {
      setError('Please provide both item title and description.');
      return;
    }
    if (startingBid <= 0 || minIncrement <= 0) {
      setError('Starting bid and minimum increment must be greater than 0 XLM.');
      return;
    }
    setError(null);
    onCreateAuction({
      itemTitle,
      itemDescription,
      startingBid,
      minIncrement,
      durationHours,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Launch Soroban Auction</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Item Title
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Genesis Soroban Pass"
              value={itemTitle}
              onChange={(e) => setItemTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Item Description
            </label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Detailed description of the asset being auctioned..."
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Starting Price (XLM)
              </label>
              <input
                type="number"
                className="input-field font-mono"
                value={startingBid}
                onChange={(e) => setStartingBid(Number(e.target.value))}
                min={1}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                Min Increment (XLM)
              </label>
              <input
                type="number"
                className="input-field font-mono"
                value={minIncrement}
                onChange={(e) => setMinIncrement(Number(e.target.value))}
                min={1}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
              Duration (Hours)
            </label>
            <input
              type="number"
              className="input-field font-mono"
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value))}
              min={1}
              max={168}
            />
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
            <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              <PlusCircle style={{ width: 18, height: 18 }} />
              Deploy Auction on Testnet
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
