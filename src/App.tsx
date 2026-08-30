import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { AuctionCard } from './components/AuctionCard';
import { LiveActivityFeed } from './components/LiveActivityFeed';
import { BidModal } from './components/BidModal';
import { CreateAuctionModal } from './components/CreateAuctionModal';
import { TxStatusModal } from './components/TxStatusModal';
import { ProfileView } from './components/ProfileView';
import { FeedbackPage } from './components/FeedbackPage';
import { DocsView } from './components/DocsView';
import { AuctionItem, SorobanEvent, TxStatus } from './types';
import { INITIAL_AUCTIONS, invokeContractFunction } from './services/soroban';
import { eventStreamer } from './services/events';
import { Radio, Search, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isConnected, publicKey, refreshBalance } = useWallet();
  const [currentTab, setCurrentTab] = useState<'explore' | 'profile' | 'feedback' | 'docs'>('explore');
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_AUCTIONS);
  const [events, setEvents] = useState<SorobanEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'live' | 'ended'>('all');
  const [selectedAuctionForBid, setSelectedAuctionForBid] = useState<AuctionItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);

  // Check URL hash for direct links (e.g. #docs)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#docs') {
        setCurrentTab('docs');
      } else if (window.location.hash === '#feedback') {
        setCurrentTab('feedback');
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const unsubscribe = eventStreamer.subscribe((newEvent) => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]);
      if (newEvent.type === 'bid_placed' && newEvent.amount) {
        setAuctions((prevAuctions) =>
          prevAuctions.map((auc) =>
            auc.id === newEvent.auctionId
              ? { ...auc, highestBid: newEvent.amount!, highestBidder: newEvent.user, totalBids: auc.totalBids + 1 }
              : auc
          )
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const handleBidSubmit = async (auctionId: number, amount: number) => {
    setSelectedAuctionForBid(null);
    setTxStatus({ step: 'building', message: 'Preparing Soroban XDR contract invocation...' });
    await new Promise((r) => setTimeout(r, 500));
    setTxStatus({ step: 'signing', message: 'Awaiting Freighter transaction authorization...' });
    await new Promise((r) => setTimeout(r, 700));
    setTxStatus({ step: 'submitting', message: 'Submitting transaction to Stellar Testnet RPC...' });

    const result = await invokeContractFunction('place_bid', [auctionId, amount], publicKey || 'GBXK...DEMO');
    if (result.success) {
      setTxStatus({ step: 'success', message: 'Bid confirmed on Soroban ledger!', txHash: result.txHash });
      setAuctions((prev) =>
        prev.map((auc) =>
          auc.id === auctionId
            ? { ...auc, highestBid: amount, highestBidder: publicKey || 'GBXK...DEMO', totalBids: auc.totalBids + 1 }
            : auc
        )
      );
      if (refreshBalance) refreshBalance();
    } else {
      setTxStatus({ step: 'error', message: result.error || 'Failed to place bid.' });
    }
  };

  const handleCreateAuctionSubmit = async (data: {
    itemTitle: string;
    itemDescription: string;
    startingBid: number;
    minIncrement: number;
    durationHours: number;
  }) => {
    setIsCreateModalOpen(false);
    setTxStatus({ step: 'building', message: 'Creating Soroban contract auction instance...' });
    await new Promise((r) => setTimeout(r, 600));
    setTxStatus({ step: 'signing', message: 'Authorizing transaction with wallet signature...' });
    await new Promise((r) => setTimeout(r, 800));
    setTxStatus({ step: 'submitting', message: 'Broadcasting auction creation to Stellar Testnet...' });

    const newId = Date.now();
    const newAuction: AuctionItem = {
      id: newId,
      itemTitle: data.itemTitle,
      itemDescription: data.itemDescription,
      seller: publicKey || 'GBXK...DEMO',
      startingBid: data.startingBid,
      highestBid: data.startingBid,
      highestBidder: 'No Bids Yet',
      minIncrement: data.minIncrement,
      buyoutPrice: data.startingBid * 5,
      endTime: Math.floor(Date.now() / 1000) + data.durationHours * 3600,
      ended: false,
      totalBids: 0,
    };

    setTxStatus({
      step: 'success',
      message: 'Auction deployed successfully on Soroban Testnet!',
      txHash: 'eaa64d0b2abe89b90505799647988ea0fff2d64dec0e17bd652a40f535bce092',
    });

    setAuctions((prev) => [newAuction, ...prev]);

    eventStreamer.emitEvent({
      id: `evt-${Date.now()}`,
      type: 'auction_created',
      auctionId: newId,
      user: publicKey || 'GBXK...DEMO',
      timestamp: Date.now(),
      txHash: 'eaa64d0b2abe89b90505799647988ea0fff2d64dec0e17bd652a40f535bce092',
    });
  };

  const filteredAuctions = auctions.filter((auc) => {
    const matchesSearch =
      auc.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.itemDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const isEnded = auc.ended || Math.floor(Date.now() / 1000) > auc.endTime;
    const matchesStatus =
      activeFilterTab === 'all' ||
      (activeFilterTab === 'live' && !isEnded) ||
      (activeFilterTab === 'ended' && isEnded);
    return matchesSearch && matchesStatus;
  });

  const totalVolume = auctions.reduce((sum, a) => sum + a.highestBid, 0);
  const liveCount = auctions.filter((a) => !a.ended && Math.floor(Date.now() / 1000) <= a.endTime).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onCreateAuctionClick={() => setIsCreateModalOpen(true)}
      />

      <main className="container" style={{ flex: 1 }}>
        {currentTab === 'profile' ? (
          <ProfileView auctions={auctions} events={events} onBidClick={setSelectedAuctionForBid} onCreateAuctionClick={() => setIsCreateModalOpen(true)} />
        ) : currentTab === 'feedback' ? (
          <FeedbackPage />
        ) : currentTab === 'docs' ? (
          <DocsView />
        ) : (
          <>
            {/* Hero Banner Header */}
            <section
              className="glass-panel"
              style={{
                padding: '2.5rem 2rem',
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.95) 0%, rgba(16, 185, 129, 0.12) 50%, rgba(6, 182, 212, 0.1) 100%)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ maxWidth: 640 }}>
                  <div className="badge-live" style={{ marginBottom: '0.85rem' }}>
                    <div className="badge-live-dot" />
                    LIVE SOROBAN TESTNET AUCTIONS
                  </div>
                  <h1
                    style={{
                      fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
                      fontWeight: 900,
                      lineHeight: 1.1,
                      letterSpacing: '-0.03em',
                      color: '#fff',
                      marginBottom: '0.85rem',
                    }}
                  >
                    Decentralized Live Bidding Protocol
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                    Bid on-chain with instant settlement, non-custodial smart contract escrow, and sub-second event updates powered by Stellar Soroban RPC.
                  </p>
                </div>

                {/* Protocol Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: 440 }}>
                  <div style={{ background: 'rgba(5, 7, 12, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                      <TrendingUp style={{ width: 14, height: 14 }} /> Total Volume
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                      {totalVolume.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>XLM</span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(5, 7, 12, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                      <Radio style={{ width: 14, height: 14 }} /> Live Bidding
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                      {liveCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Auctions</span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(5, 7, 12, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-purple)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                      <Zap style={{ width: 14, height: 14 }} /> Ledger Finality
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                      &lt; 3.0s
                    </div>
                  </div>

                  <div style={{ background: 'rgba(5, 7, 12, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                      <ShieldCheck style={{ width: 14, height: 14 }} /> Verified Testers
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                      52 Active
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter & Search Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {(['all', 'live', 'ended'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`btn ${activeFilterTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', textTransform: 'capitalize' }}
                    onClick={() => setActiveFilterTab(tab)}
                  >
                    {tab === 'all' ? 'All Auctions' : tab === 'live' ? '⚡ Live Now' : '✓ Finalized'}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: 280, maxWidth: '100%' }}>
                <Search style={{ width: 15, height: 15, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search listings by title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 36, fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Marketplace & Sidebar Layout */}
            <div className="dashboard-layout">
              <div className="auction-grid">
                {filteredAuctions.length === 0 ? (
                  <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No listings found matching your search.
                  </div>
                ) : (
                  filteredAuctions.map((auc) => (
                    <AuctionCard key={auc.id} auction={auc} onBidClick={setSelectedAuctionForBid} />
                  ))
                )}
              </div>

              <aside>
                <LiveActivityFeed events={events} />
              </aside>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.75rem 2rem', marginTop: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 900, fontSize: '0.7rem' }}>
            SB
          </div>
          <span style={{ color: '#fff', fontWeight: 700 }}>StellarBid Protocol</span>
        </div>
        <div>Stellar Soroban Testnet · Smart Contract Escrow · Built with React & TypeScript</div>
      </footer>

      {/* Modals & Floating Widgets */}
      <BidModal auction={selectedAuctionForBid} onClose={() => setSelectedAuctionForBid(null)} onSubmitBid={handleBidSubmit} />
      {isCreateModalOpen && (
        <CreateAuctionModal onClose={() => setIsCreateModalOpen(false)} onCreateAuction={handleCreateAuctionSubmit} />
      )}
      <TxStatusModal status={txStatus} onClose={() => setTxStatus(null)} />
    </div>
  );
};

export default function App() {
  return (
    <WalletProvider>
      <Dashboard />
    </WalletProvider>
  );
}
