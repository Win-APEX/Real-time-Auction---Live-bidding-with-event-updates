import React from 'react';
import { SorobanEvent } from '../types';
import { Activity, ExternalLink, ArrowUpRight, Zap, PlusCircle } from 'lucide-react';

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
    if (type === 'bid_placed') return <ArrowUpRight style={{ width: 15, height: 15 }} />;
    if (type === 'auction_created') return <PlusCircle style={{ width: 15, height: 15 }} />;
    return <Zap style={{ width: 15, height: 15 }} />;
  };

  const getEventColor = (type: string) => {
    if (type === 'bid_placed') return { bg: 'rgba(0,217,126,0.12)', color: 'var(--accent-emerald)', border: 'rgba(0,217,126,0.2)' };
    if (type === 'auction_created') return { bg: 'rgba(0,200,232,0.12)', color: 'var(--accent-cyan)', border: 'rgba(0,200,232,0.2)' };
    return { bg: 'rgba(167,139,250,0.12)', color: 'var(--accent-purple)', border: 'rgba(167,139,250,0.2)' };
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(8, 14, 28, 0.95) 0%, rgba(5, 10, 20, 0.98) 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 20,
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      position: 'sticky',
      top: '4.5rem',
      maxHeight: 'calc(100vh - 6rem)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'rgba(0, 217, 126, 0.12)',
            border: '1px solid rgba(0, 217, 126, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-emerald)',
          }}>
            <Activity style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
              Live Event Stream
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.05rem' }}>
              Soroban RPC Contract Events
            </p>
          </div>
        </div>
        <div className="live-badge">
          <div className="live-dot" />
          <span>LIVE</span>
        </div>
      </div>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,217,126,0.2), transparent)' }} />

      {/* Events List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 14rem)',
        paddingRight: '0.2rem',
      }}>
        {events.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            color: 'var(--text-muted)',
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--text-dim)',
            }}>
              <Activity style={{ width: 22, height: 22 }} />
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Listening for events...
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Place a bid to see real-time Soroban contract events appear here
            </div>
          </div>
        ) : (
          events.map((evt, i) => {
            const style = getEventColor(evt.type);
            return (
              <div
                key={evt.id}
                style={{
                  background: i === 0 ? style.bg : 'rgba(255,255,255,0.025)',
                  border: `1px solid ${i === 0 ? style.border : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14,
                  padding: '0.8rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  animation: i === 0 ? 'event-slide-in 0.35s ease' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: style.color,
                    flexShrink: 0,
                  }}>
                    {getEventIcon(evt.type)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {evt.type === 'bid_placed' ? `Bid on #${evt.auctionId}` : `Auction Created`}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span className="font-mono">{formatAddr(evt.user)}</span>
                      <span>·</span>
                      <span>{formatTime(evt.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {evt.amount && (
                    <div style={{
                      fontWeight: 800,
                      color: style.color,
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      +{evt.amount} XLM
                    </div>
                  )}
                  {evt.txHash && (
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${evt.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color: 'var(--accent-cyan)',
                        fontSize: '0.72rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 2,
                        textDecoration: 'none',
                        opacity: 0.8,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      Tx <ExternalLink style={{ width: 10, height: 10 }} />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        @keyframes event-slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
