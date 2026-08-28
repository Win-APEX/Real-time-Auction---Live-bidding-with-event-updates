import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, RefreshCw, Zap, ShieldCheck, Sparkles } from 'lucide-react';

interface NavbarProps {
  onCreateAuctionClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCreateAuctionClick }) => {
  const {
    isConnected,
    publicKey,
    balance,
    walletType,
    connectWallet,
    connectDemoWallet,
    disconnectWallet,
    refreshBalance,
    isLoading,
    error,
  } = useWallet();

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Zap className="w-6 h-6 text-emerald-400" style={{ width: 22, height: 22, color: '#10b981' }} />
          <span>StellarBid</span>
          <span className="logo-badge">SOROBAN TESTNET</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isConnected ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={onCreateAuctionClick}
                style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
              >
                + Create Auction
              </button>

              <div
                className="glass-panel"
                style={{
                  padding: '0.4rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck style={{ width: 16, height: 16, color: '#10b981' }} />
                  <span className="font-mono">{formatAddress(publicKey || '')}</span>
                  {walletType === 'simulated' && (
                    <span style={{ fontSize: '0.7rem', color: '#06b6d4', background: 'rgba(6,182,212,0.15)', padding: '1px 5px', borderRadius: 4 }}>
                      DEMO
                    </span>
                  )}
                </div>

                <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.15)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>
                    {balance !== null ? balance.toFixed(2) : '0.00'} XLM
                  </span>
                  <button
                    onClick={refreshBalance}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: 2,
                    }}
                    title="Refresh Balance"
                  >
                    <RefreshCw style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>

              <button
                className="btn btn-danger"
                onClick={disconnectWallet}
                title="Disconnect Wallet"
                style={{ padding: '0.65rem' }}
              >
                <LogOut style={{ width: 16, height: 16 }} />
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-primary"
                onClick={connectWallet}
                disabled={isLoading}
              >
                <Wallet style={{ width: 18, height: 18 }} />
                {isLoading ? 'Connecting...' : 'Connect Freighter'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={connectDemoWallet}
                disabled={isLoading}
                title="Connect Testnet Funded Demo Account"
              >
                <Sparkles style={{ width: 16, height: 16, color: '#06b6d4' }} />
                Demo Wallet
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div
          style={{
            maxWidth: 1280,
            margin: '0.5rem auto 0',
            padding: '0.6rem 1rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 8,
            color: '#f43f5e',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <span>{error}</span>
          <button
            onClick={connectDemoWallet}
            style={{
              background: '#06b6d4',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '0.25rem 0.6rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Use Demo Testnet Wallet
          </button>
        </div>
      )}
    </header>
  );
};
