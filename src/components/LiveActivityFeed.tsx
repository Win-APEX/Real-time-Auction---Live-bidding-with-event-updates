import React from 'react';
import { SorobanEvent } from '../types';
import { Activity, ExternalLink, ArrowUpRight } from 'lucide-react';

interface LiveActivityFeedProps {
  events: SorobanEvent[];
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ events }) => {
  const formatAddr = (addr: string) =>
    addr ? `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}` : '';

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity style={{ width: 18, height: 18, color: 'var(--accent-emerald)' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real-Time Event Stream</h3>
        </div>
        <div className="live-badge">
          <div className="live-dot" />
          <span>Soroban RPC Live</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 340, overflowY: 'auto' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0', fontSize: '0.9rem' }}>
            Listening for Soroban contract events...
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-light)',
                borderRadius: 12,
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-emerald)',
                  }}
                >
                  <ArrowUpRight style={{ width: 16, height: 16 }} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    New Bid on Auction #{evt.auctionId}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    by <span className="font-mono">{formatAddr(evt.user)}</span>
                  </div>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  +{evt.amount} XLM
                </div>
                {evt.txHash && (
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${evt.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: 'var(--accent-cyan)',
                      fontSize: '0.75rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      textDecoration: 'none',
                    }}
                  >
                    Hash <ExternalLink style={{ width: 10, height: 10 }} />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
