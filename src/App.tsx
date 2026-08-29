import React, { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { AuctionCard } from './components/AuctionCard';
import { LiveActivityFeed } from './components/LiveActivityFeed';
import { BidModal } from './components/BidModal';
import { CreateAuctionModal } from './components/CreateAuctionModal';
import { TxStatusModal } from './components/TxStatusModal';
import { ProfileView } from './components/ProfileView';
import { AuctionItem, SorobanEvent, TxStatus } from './types';
import { INITIAL_AUCTIONS, invokeContractFunction } from './services/soroban';
import { eventStreamer } from './services/events';
import { Radio, Search, Sparkles, TrendingUp, Layers, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { isConnected, publicKey, refreshBalance } = useWallet();
  const [currentTab, setCurrentTab] = useState<'explore' | 'profile'>('explore');
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
        ) : (
          <>
            {/* Hero Banner */}
            <section
              className="banner-overview"
              style={{
                background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.98) 0%, rgba(0, 40, 25, 0.5) 60%, rgba(0, 30, 50, 0.5) 100%)',
                border: '1px solid rgba(0, 217, 126, 0.15)',
                borderRadius: 24,
                padding: '2.25rem',
                marginBottom: '1.75rem',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background grid pattern */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(0,217,126,0.04) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,217,126,0.04) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
              }} />
              {/* Glowing orbs */}
              <div style={{
                position: 'absolute',
                top: '-40%',
                right: '-10%',
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,200,232,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute',
                bottom: '-60%',
                left: '5%',
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,217,126,0.07) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div style={{ maxWidth: 560 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: 9999,
                      background: 'rgba(0, 217, 126, 0.12)',
                      border: '1px solid rgba(0, 217, 126, 0.3)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--accent-emerald)',
                      letterSpacing: '0.07em',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      <Sparkles style={{ width: 12, height: 12 }} />
                      STELLAR SOROBAN · REAL-TIME BIDDING
                    </div>
                  </div>
                  <h1 style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
                    fontWeight: 900,
                    color: '#fff',
                    marginBottom: '0.75rem',
                    lineHeight: 1.15,
                    letterSpacing: '-0.03em',
                  }}>
                    Decentralized<br />
                    <span style={{
                      background: 'linear-gradient(135deg, #00d97e 0%, #00c8e8 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>Live Auctions</span>
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
                    Stream real-time bids via Soroban RPC events. Automated smart contract escrow with transparent, on-chain bid validation — no intermediaries.
                  </p>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {[
                    { icon: <Layers style={{ width: 16, height: 16 }} />, label: 'Active Auctions', value: auctions.length, color: 'var(--accent-emerald)' },
                    { icon: <Radio style={{ width: 16, height: 16 }} />, label: 'Live Now', value: liveCount, color: 'var(--accent-cyan)' },
                    { icon: <TrendingUp style={{ width: 16, height: 16 }} />, label: 'Total Volume', value: `${totalVolume} XLM`, color: 'var(--accent-emerald)' },
                  ].map((s) => (
                    <div key={s.label} style={{
                      background: 'rgba(0,0,0,0.35)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 16,
                      padding: '1rem 1.25rem',
                      minWidth: 110,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: s.color, marginBottom: '0.5rem' }}>
                        {s.icon}
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</span>
                      </div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', fontFamily: 'var(--font-mono)' }}>
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Filter & Search Bar */}
            <div className="search-filter-bar" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
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

              <div className="search-box" style={{ position: 'relative', width: 280 }}>
                <Search style={{ width: 15, height: 15, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 36, paddingRight: 12 }}
                />
              </div>
            </div>

            {/* Dashboard Grid */}
            <div className="dashboard-layout">
              <div className="auction-grid">
                {filteredAuctions.length === 0 ? (
                  <div style={{
                    gridColumn: '1 / -1',
                    padding: '4rem',
                    textAlign: 'center',
                    color: 'var(--text-muted)',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 20,
                  }}>
                    No auctions found.
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
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '1.5rem 1.75rem',
        marginTop: '3rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.8rem',
        color: 'var(--text-dim)',
      }}>
        <span style={{ background: 'linear-gradient(135deg, #00d97e, #00c8e8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>
          StellarBid
        </span>
        <span>Real-Time Auction · Stellar Soroban Testnet · Built with React + TypeScript</span>
      </footer>

      {/* Modals */}
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
