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
        {/* Brand Logo & View Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="logo" onClick={() => onTabChange('explore')} style={{ cursor: 'pointer' }}>
            <Zap style={{ width: 24, height: 24, color: '#10b981' }} />
            <span>StellarBid</span>
            <span className="logo-badge">SOROBAN TESTNET</span>
          </div>

          <nav style={{ display: 'flex', gap: '0.4rem' }}>
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
        </div>

        {/* Wallet & Balance Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isConnected ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={onCreateAuctionClick}
                style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}
              >
                + Create Auction
              </button>

              {/* Prominent Balance & Address Container */}
              <div
                className="glass-panel"
                style={{
                  padding: '0.45rem 0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  fontSize: '0.9rem',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.15)',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
                  onClick={() => onTabChange('profile')}
                  title="View Account Profile"
                >
                  <ShieldCheck style={{ width: 18, height: 18, color: '#10b981' }} />
                  <span className="font-mono" style={{ fontWeight: 600 }}>{formatAddress(publicKey || '')}</span>
                  {walletType === 'simulated' && (
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#06b6d4', background: 'rgba(6,182,212,0.2)', padding: '1px 6px', borderRadius: 4 }}>
                      DEMO
                    </span>
                  )}
                </div>

                <div style={{ height: 18, width: 1, background: 'rgba(255,255,255,0.15)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.95rem', fontFamily: 'var(--font-mono)' }}>
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
