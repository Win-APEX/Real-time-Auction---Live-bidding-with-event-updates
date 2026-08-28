import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { AuctionItem, SorobanEvent } from '../types';
import {
  User,
  Zap,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  Award,
  ExternalLink,
  Coins,
  Copy,
  Check,
} from 'lucide-react';

interface ProfileViewProps {
  auctions: AuctionItem[];
  events: SorobanEvent[];
  onBidClick: (auction: AuctionItem) => void;
  onCreateAuctionClick: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  auctions,
  events,
  onBidClick,
  onCreateAuctionClick,
}) => {
  const {
    isConnected,
    publicKey,
    balance,
    walletType,
    network,
    connectWallet,
    connectDemoWallet,
    refreshBalance,
  } = useWallet();

  const [copied, setCopied] = useState(false);
  const [funding, setFunding] = useState(false);
  const [fundingMsg, setFundingMsg] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'my_bids' | 'my_auctions' | 'history'>('my_bids');

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFundTestnetWallet = async () => {
    if (!publicKey) return;
    setFunding(true);
    setFundingMsg(null);
    try {
      await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
      await refreshBalance();
      setFundingMsg('Successfully received +10,000 XLM from Stellar Friendbot!');
    } catch (err) {
      setFundingMsg('Friendbot funding request submitted.');
      await refreshBalance();
    } finally {
      setFunding(false);
      setTimeout(() => setFundingMsg(null), 4000);
    }
  };

  if (!isConnected) {
    return (
      <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: 640, margin: '2rem auto' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--accent-emerald)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <User style={{ width: 36, height: 36 }} />
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: '#fff' }}>
          Connect Wallet to View Profile
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Access your live bidding statistics, active auctions, XLM testnet balance, and account history by connecting Freighter or Testnet Demo Wallet.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={connectWallet}>
            <Zap style={{ width: 18, height: 18 }} /> Connect Freighter
          </button>
          <button className="btn btn-secondary" onClick={connectDemoWallet}>
            <Coins style={{ width: 18, height: 18, color: '#06b6d4' }} /> Use Testnet Demo Wallet
          </button>
        </div>
      </div>
    );
  }

  const userAddress = publicKey || '';
  const myBiddingAuctions = auctions.filter((auc) => auc.highestBidder === userAddress);
  const myCreatedAuctions = auctions.filter((auc) => auc.seller === userAddress);
  const userEvents = events.filter((evt) => evt.user === userAddress || userAddress.startsWith(evt.user.substring(0, 4)));

  const totalUserBidVolume = myBiddingAuctions.reduce((acc, a) => acc + a.highestBid, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Account Hero Card */}
      <div
        className="glass-panel"
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(16, 185, 129, 0.15) 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
              }}
            >
              <User style={{ width: 32, height: 32 }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>Stellar Account</h2>
                <span className="logo-badge">{network.toUpperCase()}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 6, background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4' }}>
                  {walletType.toUpperCase()} WALLET
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span className="font-mono">{userAddress}</span>
                <button
                  onClick={copyAddress}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-emerald)', cursor: 'pointer', display: 'flex' }}
                  title="Copy Address"
                >
                  {copied ? <Check style={{ width: 14, height: 14 }} /> : <Copy style={{ width: 14, height: 14 }} />}
                </button>
              </div>
            </div>
          </div>

          {/* Balance Pill & Faucet Action */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: 16,
                padding: '0.85rem 1.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.2)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Available Balance
                </span>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
                  {balance !== null ? balance.toFixed(2) : '0.00'} XLM
                </span>
              </div>

              <button
                onClick={refreshBalance}
                className="btn btn-secondary"
                style={{ padding: '0.5rem', borderRadius: 10 }}
                title="Refresh XLM Balance"
              >
                <RefreshCw style={{ width: 16, height: 16 }} />
              </button>
            </div>

            <button
              onClick={handleFundTestnetWallet}
              disabled={funding}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem', background: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)', color: '#06b6d4' }}
            >
              <Coins style={{ width: 14, height: 14 }} />
              {funding ? 'Requesting Testnet XLM...' : '+ Fund Wallet (+10,000 XLM)'}
            </button>
          </div>
        </div>

        {fundingMsg && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.6rem 1rem',
              background: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: 8,
              color: '#10b981',
              fontSize: '0.85rem',
            }}
          >
            {fundingMsg}
          </div>
        )}
      </div>

      {/* Account Statistics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <Award style={{ width: 16, height: 16, color: 'var(--accent-amber)' }} />
            <span>Highest Bid Status</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{myBiddingAuctions.length} Auctions</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <TrendingUp style={{ width: 16, height: 16, color: 'var(--accent-emerald)' }} />
            <span>Total Committed Volume</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{totalUserBidVolume} XLM</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <PlusCircle style={{ width: 16, height: 16, color: 'var(--accent-cyan)' }} />
            <span>Auctions Created</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{myCreatedAuctions.length}</div>
        </div>
      </div>

      {/* Profile Activity Tabs */}
      <div>
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            className={`btn ${profileTab === 'my_bids' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem' }}
            onClick={() => setProfileTab('my_bids')}
          >
            My Top Bids ({myBiddingAuctions.length})
          </button>
          <button
            className={`btn ${profileTab === 'my_auctions' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem' }}
            onClick={() => setProfileTab('my_auctions')}
          >
            My Created Auctions ({myCreatedAuctions.length})
          </button>
          <button
            className={`btn ${profileTab === 'history' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.88rem' }}
            onClick={() => setProfileTab('history')}
          >
            Transaction History ({userEvents.length})
          </button>
        </div>

        {/* Tab Contents */}
        {profileTab === 'my_bids' && (
          <div className="auction-grid">
            {myBiddingAuctions.length === 0 ? (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                You have not placed top bids on any active auctions yet.
              </div>
            ) : (
              myBiddingAuctions.map((auc) => (
                <div key={auc.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="logo-badge">TOP BIDDER</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                      {auc.highestBid} XLM
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{auc.itemTitle}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{auc.itemDescription}</p>
                  <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => onBidClick(auc)}>
                    Increase Bid
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {profileTab === 'my_auctions' && (
          <div className="auction-grid">
            {myCreatedAuctions.length === 0 ? (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                You have not created any auctions yet.
                <div style={{ marginTop: '1rem' }}>
                  <button className="btn btn-primary" onClick={onCreateAuctionClick}>
                    + Create New Auction
                  </button>
                </div>
              </div>
            ) : (
              myCreatedAuctions.map((auc) => (
                <div key={auc.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="logo-badge" style={{ background: 'rgba(6,182,212,0.2)', color: '#06b6d4' }}>YOUR LISTING</span>
                    <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 700 }}>{auc.highestBid} XLM</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{auc.itemTitle}</h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Total Bids Received: {auc.totalBids}</div>
                </div>
              ))
            )}
          </div>
        )}

        {profileTab === 'history' && (
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {userEvents.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                No recent contract transaction logs recorded.
              </div>
            ) : (
              userEvents.map((evt) => (
                <div
                  key={evt.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 12,
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>
                      Bid Placed on Auction #{evt.auctionId}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Timestamp: {new Date(evt.timestamp * 1000).toLocaleTimeString()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>+{evt.amount} XLM</div>
                    {evt.txHash && (
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${evt.txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--accent-cyan)', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}
                      >
                        Explore <ExternalLink style={{ width: 10, height: 10 }} />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
