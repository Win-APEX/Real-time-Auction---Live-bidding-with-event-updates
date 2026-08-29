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
import { AuctionItem, SorobanEvent, TxStatus } from './types';
import { INITIAL_AUCTIONS, invokeContractFunction } from './services/soroban';
import { eventStreamer } from './services/events';
import { Radio, Search, Sparkles, TrendingUp, Layers, Activity, ShieldCheck, Zap } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isConnected, publicKey, refreshBalance } = useWallet();
  const [currentTab, setCurrentTab] = useState<'explore' | 'profile' | 'feedback'>('explore');
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_AUCTIONS);
  const [events, setEvents] = useState<SorobanEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'live' | 'ended'>('all');
  const [selectedAuctionForBid, setSelectedAuctionForBid] = useState<AuctionItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [txStatus, setTxStatus] = useState<TxStatus | null>(null);

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
      eventStreamer.emitEvent({
        id: `evt-${Date.now()}`,
        type: 'bid_placed',
        auctionId,
        user: publicKey || 'GBXK...DEMO',
        amount,
        timestamp: Math.floor(Date.now() / 1000),
        txHash: result.txHash,
      });
      refreshBalance();
    } else {
      setTxStatus({ step: 'error', message: result.error || 'Failed to submit bid.', error: result.error });
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
    setTxStatus({ step: 'building', message: 'Constructing create_auction contract call...' });
    await new Promise((r) => setTimeout(r, 500));
    setTxStatus({ step: 'signing', message: 'Awaiting wallet signature...' });
    await new Promise((r) => setTimeout(r, 700));
    setTxStatus({ step: 'submitting', message: 'Deploying auction record to Soroban Testnet...' });

    const result = await invokeContractFunction('create_auction', [data.itemTitle, data.startingBid, data.minIncrement], publicKey || 'GBXK...DEMO');
    if (result.success) {
      const newAuction: AuctionItem = {
        id: auctions.length + 1,
        seller: publicKey || 'GBXK...DEMO',
        itemTitle: data.itemTitle,
        itemDescription: data.itemDescription,
        startingBid: data.startingBid,
        highestBid: data.startingBid,
        highestBidder: publicKey || 'GBXK...DEMO',
        minIncrement: data.minIncrement,
        endTime: Math.floor(Date.now() / 1000) + data.durationHours * 3600,
        ended: false,
        totalBids: 0,
      };
      setAuctions((prev) => [newAuction, ...prev]);
      setTxStatus({ step: 'success', message: 'New auction created on Soroban!', txHash: result.txHash });
      refreshBalance();
    } else {
      setTxStatus({ step: 'error', message: result.error || 'Failed to create auction.', error: result.error });
    }
  };

  const filteredAuctions = auctions.filter((auc) => {
    const matchesSearch =
      auc.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.itemDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const now = Math.floor(Date.now() / 1000);
    const isLive = auc.endTime > now && !auc.ended;
    if (activeFilterTab === 'live') return matchesSearch && isLive;
    if (activeFilterTab === 'ended') return matchesSearch && !isLive;
    return matchesSearch;
  });

  const totalVolume = auctions.reduce((acc, a) => acc + a.highestBid, 0);
  const liveCount = auctions.filter(a => a.endTime > Math.floor(Date.now() / 1000) && !a.ended).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onCreateAuctionClick={() => setIsCreateModalOpen(true)}
      />

      <main className="container" style={{ flex: 1 }}>
        {currentTab === 'profile' ? (
          <ProfileView
            auctions={auctions}
            events={events}
            onBidClick={setSelectedAuctionForBid}
            onCreateAuctionClick={() => setIsCreateModalOpen(true)}
          />
        ) : currentTab === 'feedback' ? (
          <FeedbackPage />
        ) : (
          <>
            {/* Hero Marketplace Banner */}
            <section
              className="glass-panel"
              style={{
                padding: '2.5rem',
                marginBottom: '2rem',
                borderRadius: 24,
                background: 'linear-gradient(135deg, rgba(13, 19, 32, 0.95) 0%, rgba(16, 185, 129, 0.08) 50%, rgba(6, 182, 212, 0.06) 100%)',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ maxWidth: 620 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: 9999, background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginBottom: '0.85rem' }}>
                    <Sparkles style={{ width: 12, height: 12 }} />
                    STELLAR SOROBAN SMART CONTRACT ESCROW
                  </div>

                  <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '0.85rem' }}>
                    Real-Time Decentralized<br />
                    <span style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Live Auction Protocol
                    </span>
                  </h1>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
                    Automated smart contract escrow on Stellar Testnet. Bid in real time with sub-3-second ledger finality and instant RPC event updates.
                  </p>
                </div>

                {/* Protocol Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', maxWidth: 440 }}>
                  <div style={{ background: 'rgba(5, 7, 12, 0.6)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-emerald)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>
                      <TrendingUp style={{ width: 14, height: 14 }} /> Total Volume
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}>
                      {totalVolume} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>XLM</span>
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
                      12 Active
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
                    {tab === 'live' && <Radio style={{ width: 13, height: 13 }} />}
                    {tab === 'all' && <Layers style={{ width: 13, height: 13 }} />}
                    {tab === 'ended' && <Activity style={{ width: 13, height: 13 }} />}
                    {tab}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: 280 }}>
                <Search style={{ width: 15, height: 15, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 36 }}
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
          <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800, fontSize: '0.65rem' }}>
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

export const App: React.FC = () => (
  <WalletProvider>
    <Dashboard />
  </WalletProvider>
);

export default App;
