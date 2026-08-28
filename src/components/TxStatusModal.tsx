import React, { useState } from 'react';
import { TxStatus } from '../types';
import { CheckCircle2, XCircle, Loader2, ExternalLink, Copy, Check } from 'lucide-react';

interface TxStatusModalProps {
  status: TxStatus | null;
  onClose: () => void;
}

export const TxStatusModal: React.FC<TxStatusModalProps> = ({ status, onClose }) => {
  if (!status || status.step === 'idle') return null;

  const [copiedHash, setCopiedHash] = useState(false);

  const steps: { id: string; label: string }[] = [
    { id: 'building', label: 'Constructing Soroban XDR Transaction' },
    { id: 'signing', label: 'Awaiting Wallet Authorization' },
    { id: 'submitting', label: 'Submitting to Stellar Testnet RPC' },
    { id: 'success', label: 'Ledger Settlement Confirmed' },
  ];

  const getStepIndex = (step: string) => {
    switch (step) {
      case 'building': return 0;
      case 'signing': return 1;
      case 'submitting': return 2;
      case 'success': return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(status.step);

  const handleCopyHash = () => {
    if (status.txHash) {
      navigator.clipboard.writeText(status.txHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ textAlign: 'center', maxWidth: 540 }}>
        {status.step === 'error' ? (
          <div>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#f43f5e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <XCircle style={{ width: 36, height: 36 }} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e', marginBottom: '0.5rem' }}>
              Transaction Execution Error
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {status.error || status.message}
            </p>

            <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Dismiss & Retry
            </button>
          </div>
        ) : status.step === 'success' ? (
          <div>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCircle2 style={{ width: 38, height: 38 }} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
              Transaction Confirmed on Soroban!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your smart contract call was settled cleanly on Stellar Testnet.
            </p>

            {status.txHash && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: 14,
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Transaction Hash</span>
                  <button
                    onClick={handleCopyHash}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem' }}
                  >
                    {copiedHash ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                    {copiedHash ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', wordBreak: 'break-all' }} className="font-mono">
                  {status.txHash}
                </div>

                <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-light)' }}>
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${status.txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--accent-cyan)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    View Ledger Record on Stellar Expert Explorer <ExternalLink style={{ width: 13, height: 13 }} />
                  </a>
                </div>
              </div>
            )}

            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ position: 'relative', width: 54, height: 54, margin: '0 auto 1.25rem' }}>
              <Loader2
                style={{
                  width: 54,
                  height: 54,
                  color: 'var(--accent-cyan)',
                  animation: 'spin 1.2s linear infinite',
                }}
              />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>
              Settling Soroban Smart Contract Transaction
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              {steps.map((s, idx) => {
                const isCurrent = idx === currentIndex;
                const isPassed = idx < currentIndex;
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      fontSize: '0.9rem',
                      color: isPassed ? '#10b981' : isCurrent ? '#fff' : 'var(--text-dim)',
                    }}
                  >
                    {isPassed ? (
                      <CheckCircle2 style={{ width: 20, height: 20, color: '#10b981', flexShrink: 0 }} />
                    ) : isCurrent ? (
                      <Loader2 style={{ width: 20, height: 20, color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid var(--text-dim)', flexShrink: 0 }} />
                    )}
                    <span style={{ fontWeight: isCurrent ? 700 : 400 }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
