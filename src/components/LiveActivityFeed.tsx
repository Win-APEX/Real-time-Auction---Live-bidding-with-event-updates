import React from 'react';
import { SorobanEvent } from '../types';
import { Activity, ExternalLink, ArrowUpRight, PlusCircle, Zap } from 'lucide-react';

interface LiveActivityFeedProps {
  events: SorobanEvent[];
}

export const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ events }) => {
  const formatAddr = (addr: string) =>
    addr ? `${addr.substring(0, 4)}…${addr.substring(addr.length - 4)}` : '';

  const formatTime = (ts: number) => {
    const d = new Date(ts * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getEventIcon = (type: string) => {
    if (type === 'bid_placed') return <ArrowUpRight style={{ width: 14, height: 14 }} />;
    if (type === 'auction_created') return <PlusCircle style={{ width: 14, height: 14 }} />;
    return <Zap style={{ width: 14, height: 14 }} />;
  };

  const getEventBadge = (type: string) => {
    if (type === 'bid_placed') return { bg: 'rgba(16, 185, 129, 0.12)', color: 'var(--accent-emerald)', border: 'rgba(16, 185, 129, 0.25)' };
    if (type === 'auction_created') return { bg: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)', border: 'rgba(6, 182, 212, 0.25)' };
    return { bg: 'rgba(139, 92, 246, 0.12)', color: 'var(--accent-purple)', border: 'rgba(139, 92, 246, 0.25)' };
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.1rem',
        position: 'sticky',
        top: '5rem',
        maxHeight: 'calc(100vh - 6.5rem)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)' }}>
            <Activity style={{ width: 16, height: 16 }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>Soroban RPC Stream</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Real-time contract events</p>
          </div>
        </div>

        <div className="badge-live">
          <div className="badge-live-dot" />
          <span>LIVE</span>
        </div>
      </div>

      <div style={{ height: 1, background: 'var(--border-subtle)' }} />

      {/* Events Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', overflowY: 'auto', paddingRight: 2 }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <Activity style={{ width: 28, height: 28, margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Listening for events...
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Soroban RPC events will stream live here
            </div>
          </div>
        ) : (
          events.map((evt, i) => {
            const badge = getEventBadge(evt.type);
            return (
              <div
                key={evt.id}
                style={{
                  background: i === 0 ? badge.bg : 'rgba(15, 23, 42, 0.5)',
                  border: `1px solid ${i === 0 ? badge.border : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.65rem',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: badge.bg, border: `1px solid ${badge.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: badge.color, flexShrink: 0 }}>
                    {getEventIcon(evt.type)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {evt.type === 'bid_placed' ? `Bid on #${evt.auctionId}` : 'Auction Created'}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span className="font-mono">{formatAddr(evt.user)}</span>
                      <span>·</span>
                      <span>{formatTime(evt.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {evt.amount && (
                    <div style={{ fontWeight: 800, color: badge.color, fontSize: '0.88rem', fontFamily: 'var(--font-mono)' }}>
                      +{evt.amount} XLM
                    </div>
                  )}
                  {evt.txHash && (
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${evt.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem', display: 'inline-flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}
                    >
                      Explorer <ExternalLink style={{ width: 9, height: 9 }} />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
