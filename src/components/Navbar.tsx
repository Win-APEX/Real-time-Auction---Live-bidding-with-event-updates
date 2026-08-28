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
        {/* Brand Logo Bar */}
        <div className="logo-bar">
          <div className="logo" onClick={() => onTabChange('explore')} style={{ cursor: 'pointer' }}>
            <Zap style={{ width: 22, height: 22, color: '#10b981' }} />
            <span>StellarBid</span>
            <span className="logo-badge">SOROBAN TESTNET</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="nav-tabs" style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className={`btn ${currentTab === 'explore' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            onClick={() => onTabChange('explore')}
          >
            <LayoutGrid style={{ width: 15, height: 15 }} /> Explore Auctions
          </button>

          <button
            className={`btn ${currentTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            onClick={() => onTabChange('profile')}
          >
            <User style={{ width: 15, height: 15 }} /> Profile & Stats
          </button>
        </nav>

        {/* Wallet Area */}
        <div className="wallet-area" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isConnected ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={onCreateAuctionClick}
                style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}
              >
                + Create Auction
              </button>

              <div
                className="glass-panel"
                style={{
                  padding: '0.45rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  fontSize: '0.88rem',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  onClick={() => onTabChange('profile')}
                  title="View Profile"
                >
                  <ShieldCheck style={{ width: 16, height: 16, color: '#10b981' }} />
                  <span className="font-mono" style={{ fontWeight: 600 }}>{formatAddress(publicKey || '')}</span>
                  {walletType === 'simulated' && (
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#06b6d4', background: 'rgba(6,182,212,0.2)', padding: '1px 5px', borderRadius: 4 }}>
                      DEMO
                    </span>
                  )}
                </div>

                <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.15)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>
                    {balance !== null ? balance.toFixed(2) : '0.00'} XLM
                  </span>
                  <button
                    onClick={refreshBalance}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 2 }}
                    title="Refresh XLM Balance"
                  >
                    <RefreshCw style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>

              <button
                className="btn btn-danger"
                onClick={disconnectWallet}
                title="Disconnect Wallet"
                style={{ padding: '0.6rem 0.85rem' }}
              >
                <LogOut style={{ width: 16, height: 16 }} />
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
                <Wallet style={{ width: 16, height: 16 }} />
                {isLoading ? 'Connecting...' : 'Connect Freighter'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={connectDemoWallet}
                disabled={isLoading}
                style={{ flex: 1 }}
                title="Connect Testnet Funded Account"
              >
                <Sparkles style={{ width: 15, height: 15, color: '#06b6d4' }} />
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
