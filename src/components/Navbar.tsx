import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { Wallet, LogOut, RefreshCw, Zap, ShieldCheck, Sparkles, User, LayoutGrid, MessageSquare, PlusCircle, Menu, X, BookOpen } from 'lucide-react';

interface NavbarProps {
  currentTab: 'explore' | 'profile' | 'feedback' | 'docs';
  onTabChange: (tab: 'explore' | 'profile' | 'feedback' | 'docs') => void;
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

  const handleTabClick = (tab: 'explore' | 'profile' | 'feedback' | 'docs') => {
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
            <span className="logo-badge">SOROBAN TESTNET</span>
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
            <button
              className={`nav-tab-item ${currentTab === 'docs' ? 'active' : ''}`}
              onClick={() => handleTabClick('docs')}
            >
              <BookOpen style={{ width: 15, height: 15 }} /> Docs Portal
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
                    gap: '0.6rem',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.84rem',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: walletType === 'freighter' ? 'var(--accent-emerald)' : 'var(--accent-cyan)',
                      boxShadow: walletType === 'freighter' ? '0 0 8px var(--accent-emerald)' : '0 0 8px var(--accent-cyan)',
                    }}
                  />
                  <span style={{ fontWeight: 700, color: '#fff' }} className="font-mono">
                    {formatAddress(publicKey || '')}
                  </span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(255,255,255,0.08)',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {walletType}
                  </span>
                </div>

                {/* Balance Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--accent-emerald)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  <span>{balance !== null ? balance.toLocaleString() : '...'} XLM</span>
                  <button
                    onClick={() => refreshBalance()}
                    disabled={isLoading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-emerald)',
                      cursor: 'pointer',
                      padding: 2,
                      display: 'flex',
                    }}
                    title="Refresh Balance"
                  >
                    <RefreshCw style={{ width: 12, height: 12, animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
                  </button>
                </div>

                {/* Disconnect */}
                <button
                  onClick={() => disconnectWallet()}
                  className="btn btn-secondary"
                  style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                  title="Disconnect Wallet"
                >
                  <LogOut style={{ width: 14, height: 14 }} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => connectDemoWallet()}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', borderColor: 'rgba(6, 182, 212, 0.3)', color: 'var(--accent-cyan)' }}
                >
                  <Sparkles style={{ width: 14, height: 14 }} /> Demo Wallet
                </button>
                <button
                  onClick={() => connectWallet()}
                  className="btn btn-primary"
                  style={{ fontSize: '0.82rem' }}
                >
                  <Wallet style={{ width: 14, height: 14 }} /> Connect Freighter
                </button>
              </>
            )}

            {/* Create Listing Button (Always visible) */}
            <button
              onClick={() => {
                if (!isConnected) connectDemoWallet();
                onCreateAuctionClick();
              }}
              className="btn btn-primary"
              style={{
                fontSize: '0.82rem',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                borderColor: 'rgba(139, 92, 246, 0.4)',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
              }}
            >
              <PlusCircle style={{ width: 14, height: 14 }} /> + Create Listing
            </button>
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

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              className={`nav-tab-item ${currentTab === 'explore' ? 'active' : ''}`}
              onClick={() => handleTabClick('explore')}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <LayoutGrid style={{ width: 16, height: 16 }} /> Live Marketplace
            </button>
            <button
              className={`nav-tab-item ${currentTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabClick('profile')}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <User style={{ width: 16, height: 16 }} /> Portfolio & Stats
            </button>
            <button
              className={`nav-tab-item ${currentTab === 'feedback' ? 'active' : ''}`}
              onClick={() => handleTabClick('feedback')}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <MessageSquare style={{ width: 16, height: 16 }} /> Community Hub
            </button>
            <button
              className={`nav-tab-item ${currentTab === 'docs' ? 'active' : ''}`}
              onClick={() => handleTabClick('docs')}
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <BookOpen style={{ width: 16, height: 16 }} /> Docs Portal
            </button>
          </div>

          <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0.2rem 0' }} />

          {/* Mobile Wallet Status */}
          {isConnected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(15, 23, 42, 0.7)', padding: '0.65rem 0.85rem', borderRadius: 12, border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)' }} />
                  <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>
                    {formatAddress(publicKey || '')}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  {balance !== null ? balance.toLocaleString() : '0'} XLM
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    onCreateAuctionClick();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '0.6rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' }}
                >
                  <PlusCircle style={{ width: 14, height: 14 }} /> + Create Listing
                </button>
                <button
                  onClick={() => {
                    disconnectWallet();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '0.6rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <LogOut style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                onClick={() => {
                  connectDemoWallet();
                  setMobileMenuOpen(false);
                }}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(6, 182, 212, 0.3)', color: 'var(--accent-cyan)' }}
              >
                <Sparkles style={{ width: 15, height: 15 }} /> Use Demo Wallet
              </button>
              <button
                onClick={() => {
                  connectWallet();
                  setMobileMenuOpen(false);
                }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Wallet style={{ width: 15, height: 15 }} /> Connect Freighter Wallet
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', borderBottom: '1px solid rgba(244, 63, 94, 0.3)', padding: '0.4rem 1.5rem', fontSize: '0.8rem', color: 'var(--accent-rose)', textAlign: 'center' }}>
          {error}
        </div>
      )}
    </header>
  );
};
