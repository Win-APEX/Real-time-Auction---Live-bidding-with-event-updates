import React from 'react';
import { TxStatus } from '../types';
import { CheckCircle2, XCircle, Loader2, ExternalLink, ShieldAlert } from 'lucide-react';

interface TxStatusModalProps {
  status: TxStatus | null;
  onClose: () => void;
}

export const TxStatusModal: React.FC<TxStatusModalProps> = ({ status, onClose }) => {
  if (!status || status.step === 'idle') return null;

  const steps: { id: string; label: string }[] = [
    { id: 'building', label: 'Building Soroban XDR Transaction' },
    { id: 'signing', label: 'Awaiting Freighter Signature' },
    { id: 'submitting', label: 'Submitting to Stellar Testnet RPC' },
    { id: 'success', label: 'Confirmed on Ledger' },
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

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        {status.step === 'error' ? (
          <div>
            <XCircle style={{ width: 54, height: 54, color: '#f43f5e', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.5rem' }}>
              Transaction Failed
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {status.error || status.message}
            </p>
            <button className="btn btn-secondary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Close
            </button>
          </div>
        ) : status.step === 'success' ? (
          <div>
            <CheckCircle2 style={{ width: 54, height: 54, color: '#10b981', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
              Transaction Confirmed!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Your bid was successfully registered on the Stellar Soroban smart contract.
            </p>

            {status.txHash && (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: 12,
                  padding: '0.85rem',
                  marginBottom: '1.5rem',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transaction Hash</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', wordBreak: 'break-all' }} className="font-mono">
                  {status.txHash}
                </div>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${status.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    color: 'var(--accent-cyan)',
                    fontSize: '0.8rem',
                    marginTop: '0.5rem',
                    textDecoration: 'none',
                  }}
                >
                  View on Stellar Expert Explorer <ExternalLink style={{ width: 12, height: 12 }} />
                </a>
              </div>
            )}

            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <Loader2 style={{ width: 48, height: 48, color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite', margin: '0 auto 1.25rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Processing Transaction
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left', marginBottom: '1.5rem' }}>
              {steps.map((s, idx) => {
                const isCurrent = idx === currentIndex;
                const isPassed = idx < currentIndex;
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: '0.88rem',
                      color: isPassed ? '#10b981' : isCurrent ? '#fff' : 'var(--text-dim)',
                    }}
                  >
                    {isPassed ? (
                      <CheckCircle2 style={{ width: 18, height: 18, color: '#10b981' }} />
                    ) : isCurrent ? (
                      <Loader2 style={{ width: 18, height: 18, color: 'var(--accent-cyan)', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid var(--text-dim)' }} />
                    )}
                    <span style={{ fontWeight: isCurrent ? 600 : 400 }}>{s.label}</span>
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
