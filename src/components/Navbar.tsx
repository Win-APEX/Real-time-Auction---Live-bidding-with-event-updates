import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, RefreshCw, Zap, ShieldCheck, Sparkles, User, LayoutGrid } from 'lucide-react';

interface NavbarProps {
  currentTab: 'explore' | 'profile';
  onTabChange: (tab: 'explore' | 'profile') => void;
  onCreateAuctionClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, onCreateAuctionClick }) => {
  const {
    isConnected, publicKey, balance, walletType,
    connectWallet, connectDemoWallet, disconnectWallet,
    refreshBalance, isLoading, error,
  } = useWallet();

  const formatAddress = (addr: string) =>
    addr ? `${addr.substring(0, 4)}…${addr.substring(addr.length - 4)}` : '';

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="logo" onClick={() => onTabChange('explore')}>
            <Zap style={{ width: 20, height: 20, color: '#00d97e' }} />
            <span>StellarBid</span>
            <span className="logo-badge">SOROBAN TESTNET</span>
          </div>
          {isConnected && (
            <button className="btn btn-danger" onClick={disconnectWallet} title="Disconnect" style={{ padding: '0.45rem 0.65rem' }}>
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        {/* Nav Tabs */}
        <nav className="nav-tabs" style={{ display: 'flex', gap: '0.3rem', width: '100%' }}>
          <button
            className={`btn ${currentTab === 'explore' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem', borderRadius: 10 }}
            onClick={() => onTabChange('explore')}
          >
            <LayoutGrid style={{ width: 14, height: 14 }} /> Explore
          </button>
          <button
            className={`btn ${currentTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem', borderRadius: 10 }}
            onClick={() => onTabChange('profile')}
          >
            <User style={{ width: 14, height: 14 }} /> Profile & Stats
          </button>
        </nav>

        {/* Wallet Area */}
        <div className="wallet-area" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%' }}>
          {isConnected ? (
            <>
              {/* Wallet Pill */}
              <div
                className="glass-panel"
                style={{
                  flex: 1,
                  padding: '0.5rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.6rem',
                  border: '1px solid rgba(0, 217, 126, 0.25)',
                  background: 'rgba(0, 217, 126, 0.05)',
                  borderRadius: 14,
                  cursor: 'pointer',
                }}
                onClick={() => onTabChange('profile')}
                title="View Profile"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ShieldCheck style={{ width: 15, height: 15, color: '#00d97e', flexShrink: 0 }} />
                  <span className="font-mono" style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {formatAddress(publicKey || '')}
                  </span>
                  {walletType === 'simulated' && (
                    <span className="tag-cyan" style={{ fontSize: '0.6rem' }}>DEMO</span>
                  )}
                </div>

                <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.12)' }} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{
                    fontWeight: 800,
                    color: '#00d97e',
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-mono)',
                    textShadow: '0 0 16px rgba(0,217,126,0.4)',
                  }}>
                    {balance !== null ? balance.toFixed(2) : '0.00'} XLM
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); refreshBalance(); }}
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
                style={{
                  background: 'rgba(0, 217, 126, 0.1)',
                  borderColor: 'rgba(0, 217, 126, 0.3)',
                  color: '#00d97e',
                  whiteSpace: 'nowrap',
                  fontWeight: 700,
                }}
              >
                + Create
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
              <button className="btn btn-primary" onClick={connectWallet} disabled={isLoading} style={{ flex: 1 }}>
                <Wallet style={{ width: 15, height: 15 }} />
                {isLoading ? 'Connecting...' : 'Connect Freighter'}
              </button>
              <button className="btn btn-secondary" onClick={connectDemoWallet} disabled={isLoading} style={{ flex: 1 }}>
                <Sparkles style={{ width: 14, height: 14, color: '#00c8e8' }} />
                Demo Wallet
              </button>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{
          margin: '0.5rem 0 0',
          padding: '0.55rem 1rem',
          background: 'rgba(251, 75, 110, 0.12)',
          border: '1px solid rgba(251, 75, 110, 0.25)',
          borderRadius: 10,
          color: 'var(--accent-rose)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <span>{error}</span>
          <button
            onClick={connectDemoWallet}
            style={{ background: '#00c8e8', color: '#000', border: 'none', borderRadius: 6, padding: '0.22rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Use Demo Wallet
          </button>
        </div>
      )}
    </header>
  );
};
