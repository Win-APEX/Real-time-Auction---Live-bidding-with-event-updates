import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, RefreshCw, Zap, ShieldCheck, Sparkles, User, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  currentTab: 'explore' | 'profile';
  onTabChange: (tab: 'explore' | 'profile') => void;
  onCreateAuctionClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onCreateAuctionClick,
}) => {
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
        {/* Row 1: Logo & Network Badge & Logout on Mobile */}
        <div className="logo-bar">
          <div className="logo" onClick={() => onTabChange('explore')} style={{ cursor: 'pointer' }}>
            <Zap style={{ width: 20, height: 20, color: '#10b981' }} />
            <span>StellarBid</span>
            <span className="logo-badge">SOROBAN TESTNET</span>
          </div>

          {isConnected && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                className="btn btn-danger"
                onClick={disconnectWallet}
                title="Disconnect Wallet"
                style={{ padding: '0.45rem 0.65rem' }}
              >
                <LogOut style={{ width: 14, height: 14 }} />
              </button>
            </div>
          )}
        </div>

        {/* Row 2: Segmented Navigation Bar */}
        <nav className="nav-tabs">
          <button
            className={`btn ${currentTab === 'explore' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onTabChange('explore')}
          >
            <LayoutGrid style={{ width: 14, height: 14 }} /> Explore
          </button>

          <button
            className={`btn ${currentTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => onTabChange('profile')}
          >
            <User style={{ width: 14, height: 14 }} /> Profile & Stats
          </button>
        </nav>

        {/* Row 3: Wallet Pill & Create Action */}
        <div className="wallet-area">
          {isConnected ? (
            <>
              <div
                className="glass-panel"
                style={{
                  padding: '0.4rem 0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                  onClick={() => onTabChange('profile')}
                  title="View Profile"
                >
                  <ShieldCheck style={{ width: 15, height: 15, color: '#10b981', flexShrink: 0 }} />
                  <span className="font-mono" style={{ fontWeight: 600 }}>{formatAddress(publicKey || '')}</span>
                  {walletType === 'simulated' && (
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#06b6d4', background: 'rgba(6,182,212,0.2)', padding: '1px 4px', borderRadius: 4 }}>
                      DEMO
                    </span>
                  )}
                </div>

                <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.15)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.88rem', fontFamily: 'var(--font-mono)' }}>
                    {balance !== null ? balance.toFixed(2) : '0.00'} XLM
                  </span>
                  <button
                    onClick={refreshBalance}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 2 }}
                    title="Refresh Balance"
                  >
                    <RefreshCw style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                onClick={onCreateAuctionClick}
                style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981', whiteSpace: 'nowrap' }}
              >
                + Create Auction
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <button
                className="btn btn-primary"
                onClick={connectWallet}
                disabled={isLoading}
                style={{ flex: 1 }}
              >
                <Wallet style={{ width: 15, height: 15 }} />
                {isLoading ? 'Connecting...' : 'Connect Freighter'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={connectDemoWallet}
                disabled={isLoading}
                style={{ flex: 1 }}
                title="Connect Testnet Funded Account"
              >
                <Sparkles style={{ width: 14, height: 14, color: '#06b6d4' }} />
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
            margin: '0.4rem auto 0',
            padding: '0.5rem 0.85rem',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: 8,
            color: '#f43f5e',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
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
              padding: '0.2rem 0.5rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Use Demo Wallet
          </button>
        </div>
      )}
    </header>
  );
};
