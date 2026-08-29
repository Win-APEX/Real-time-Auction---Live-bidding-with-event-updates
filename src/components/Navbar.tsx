import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, RefreshCw, Zap, ShieldCheck, Sparkles, User, LayoutGrid, MessageSquare, PlusCircle, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentTab: 'explore' | 'profile' | 'feedback';
  onTabChange: (tab: 'explore' | 'profile' | 'feedback') => void;
  onCreateAuctionClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onTabChange, onCreateAuctionClick }) => {
  const {
    isConnected, publicKey, balance, walletType,
    connectWallet, connectDemoWallet, disconnectWallet,
    refreshBalance, isLoading, error,
  } = useWallet();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatAddress = (addr: string) =>
    addr ? `${addr.substring(0, 5)}…${addr.substring(addr.length - 4)}` : '';

  const handleTabClick = (tab: 'explore' | 'profile' | 'feedback') => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Left: Brand Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'space-between' }}>
          <div className="logo" onClick={() => handleTabClick('explore')}>
            <div className="logo-icon">
              <Zap style={{ width: 18, height: 18 }} />
            </div>
            <span>StellarBid</span>
            <span className="logo-badge">TESTNET RPC</span>
          </div>

          {/* Desktop Nav Tabs */}
          <nav className="nav-tabs desktop-only">
            <button
              className={`nav-tab-item ${currentTab === 'explore' ? 'active' : ''}`}
              onClick={() => handleTabClick('explore')}
            >
              <LayoutGrid style={{ width: 15, height: 15 }} /> Live Marketplace
            </button>
            <button
              className={`nav-tab-item ${currentTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabClick('profile')}
            >
              <User style={{ width: 15, height: 15 }} /> Portfolio & Stats
            </button>
            <button
              className={`nav-tab-item ${currentTab === 'feedback' ? 'active' : ''}`}
              onClick={() => handleTabClick('feedback')}
            >
              <MessageSquare style={{ width: 15, height: 15 }} /> Community Hub
            </button>
          </nav>

          {/* Right: Desktop Wallet Actions */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {isConnected ? (
              <>
                {/* Account Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '12px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}
                    onClick={() => handleTabClick('profile')}
                  >
                    <ShieldCheck style={{ width: 15, height: 15, color: 'var(--accent-emerald)' }} />
                    <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formatAddress(publicKey || '')}
                    </span>
                    {walletType === 'simulated' && (
                      <span className="tag-cyan">DEMO</span>
                    )}
                  </div>

                  <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                      {balance !== null ? balance.toFixed(2) : '0.00'} XLM
                    </span>
                    <button
                      onClick={refreshBalance}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 2 }}
                      title="Refresh Balance"
                    >
                      <RefreshCw style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!isConnected) connectDemoWallet();
                    onCreateAuctionClick();
                  }}
                >
                  <PlusCircle style={{ width: 16, height: 16 }} />
                  Create Listing
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={disconnectWallet}
                  title="Disconnect Wallet"
                  style={{ padding: '0.6rem 0.75rem', color: 'var(--accent-rose)' }}
                >
                  <LogOut style={{ width: 15, height: 15 }} />
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!isConnected) connectDemoWallet();
                    onCreateAuctionClick();
                  }}
                >
                  <PlusCircle style={{ width: 16, height: 16 }} />
                  Create Listing
                </button>

                <button className="btn btn-secondary" onClick={connectWallet} disabled={isLoading}>
                  <Wallet style={{ width: 16, height: 16 }} />
                  {isLoading ? 'Connecting...' : 'Connect Freighter'}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Overlay Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              className={`nav-tab-item ${currentTab === 'explore' ? 'active' : ''}`}
              style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              onClick={() => handleTabClick('explore')}
            >
              <LayoutGrid style={{ width: 18, height: 18 }} /> Live Marketplace
            </button>
            <button
              className={`nav-tab-item ${currentTab === 'profile' ? 'active' : ''}`}
              style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              onClick={() => handleTabClick('profile')}
            >
              <User style={{ width: 18, height: 18 }} /> Portfolio & Stats
            </button>
            <button
              className={`nav-tab-item ${currentTab === 'feedback' ? 'active' : ''}`}
              style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
              onClick={() => handleTabClick('feedback')}
            >
              <MessageSquare style={{ width: 18, height: 18 }} /> Community Hub
            </button>
          </nav>

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.5rem 0' }} />

          {/* Wallet Actions in Mobile Drawer */}
          {isConnected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck style={{ width: 16, height: 16, color: 'var(--accent-emerald)' }} />
                  <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {formatAddress(publicKey || '')}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                    {balance !== null ? balance.toFixed(2) : '0.00'} XLM
                  </span>
                  <button onClick={refreshBalance} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}>
                    <RefreshCw style={{ width: 12, height: 12 }} />
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                onClick={() => { onCreateAuctionClick(); setMobileMenuOpen(false); }}
              >
                <PlusCircle style={{ width: 18, height: 18 }} />
                Create Listing
              </button>

              <button
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', color: 'var(--accent-rose)', padding: '0.65rem' }}
                onClick={() => { disconnectWallet(); setMobileMenuOpen(false); }}
              >
                <LogOut style={{ width: 16, height: 16 }} />
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                onClick={() => { connectWallet(); setMobileMenuOpen(false); }}
                disabled={isLoading}
              >
                <Wallet style={{ width: 18, height: 18 }} />
                {isLoading ? 'Connecting...' : 'Connect Freighter'}
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
                onClick={() => { connectDemoWallet(); setMobileMenuOpen(false); }}
                disabled={isLoading}
              >
                <Sparkles style={{ width: 16, height: 16, color: 'var(--accent-cyan)' }} />
                Use Testnet Demo Wallet
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{
          maxWidth: 1400,
          margin: '0.5rem auto 0',
          padding: '0.55rem 1rem',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.25)',
          borderRadius: 10,
          color: 'var(--accent-rose)',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>{error}</span>
          <button
            onClick={connectDemoWallet}
            style={{ background: 'var(--accent-cyan)', color: '#000', border: 'none', borderRadius: 6, padding: '0.22rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Use Demo Wallet
          </button>
        </div>
      )}
    </header>
  );
};
