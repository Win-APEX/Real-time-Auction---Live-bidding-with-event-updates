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
import { Radio, Search, Sparkles } from 'lucide-react';

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

  // Real-time Event Subscription
  useEffect(() => {
    const unsubscribe = eventStreamer.subscribe((newEvent) => {
      setEvents((prev) => [newEvent, ...prev.slice(0, 19)]); // Keep last 20 events

      if (newEvent.type === 'bid_placed' && newEvent.amount) {
        setAuctions((prevAuctions) =>
          prevAuctions.map((auc) => {
            if (auc.id === newEvent.auctionId) {
              return {
                ...auc,
                highestBid: newEvent.amount!,
                highestBidder: newEvent.user,
                totalBids: auc.totalBids + 1,
              };
            }
            return auc;
          })
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle Bidding Submission
  const handleBidSubmit = async (auctionId: number, amount: number) => {
    setSelectedAuctionForBid(null);

    setTxStatus({
      step: 'building',
      message: 'Preparing Soroban XDR contract invocation...',
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    setTxStatus({
      step: 'signing',
      message: 'Awaiting Freighter transaction authorization...',
    });

    await new Promise((resolve) => setTimeout(resolve, 700));

    setTxStatus({
      step: 'submitting',
      message: 'Submitting transaction to Stellar Testnet RPC...',
    });

    const result = await invokeContractFunction(
      'place_bid',
      [auctionId, amount],
      publicKey || 'GBXK...DEMO'
    );

    if (result.success) {
      setTxStatus({
        step: 'success',
        message: 'Bid confirmed on Soroban ledger!',
        txHash: result.txHash,
      });

      setAuctions((prev) =>
        prev.map((auc) =>
          auc.id === auctionId
            ? {
                ...auc,
                highestBid: amount,
                highestBidder: publicKey || 'GBXK...DEMO',
                totalBids: auc.totalBids + 1,
              }
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
      setTxStatus({
        step: 'error',
        message: result.error || 'Failed to submit bid.',
        error: result.error,
      });
    }
  };

  // Handle Auction Creation
  const handleCreateAuctionSubmit = async (data: {
    itemTitle: string;
    itemDescription: string;
    startingBid: number;
    minIncrement: number;
    durationHours: number;
  }) => {
    setIsCreateModalOpen(false);

    setTxStatus({
      step: 'building',
      message: 'Constructing create_auction contract call...',
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    setTxStatus({
      step: 'signing',
      message: 'Awaiting wallet signature...',
    });

    await new Promise((resolve) => setTimeout(resolve, 700));

    setTxStatus({
      step: 'submitting',
      message: 'Deploying auction record to Soroban Testnet...',
    });

    const result = await invokeContractFunction(
      'create_auction',
      [data.itemTitle, data.startingBid, data.minIncrement],
      publicKey || 'GBXK...DEMO'
    );

    if (result.success) {
      const newAuctionId = auctions.length + 1;
      const newAuction: AuctionItem = {
        id: newAuctionId,
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

      setTxStatus({
        step: 'success',
        message: 'New auction created on Soroban!',
        txHash: result.txHash,
      });

      refreshBalance();
    } else {
      setTxStatus({
        step: 'error',
        message: result.error || 'Failed to create auction.',
        error: result.error,
      });
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Navbar
        currentTab={currentTab}
        onTabChange={(t) => setCurrentTab(t)}
        onCreateAuctionClick={() => setIsCreateModalOpen(true)}
      />

      <main className="container" style={{ flex: 1 }}>
        {currentTab === 'profile' ? (
          <ProfileView
            auctions={auctions}
            events={events}
            onBidClick={(auc) => setSelectedAuctionForBid(auc)}
            onCreateAuctionClick={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <>
            {/* Banner Overview */}
            <section className="glass-panel banner-overview" style={{ padding: '2rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 78, 59, 0.35) 100%)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Sparkles style={{ width: 18, height: 18, color: 'var(--accent-emerald)' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-emerald)', letterSpacing: '0.05em' }}>
                      STELLAR SOROBAN REAL-TIME BIDDING
                    </span>
                  </div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem', lineHeight: 1.2 }}>
                    Decentralized Live Auctions
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 640, lineHeight: 1.45 }}>
                    Stream real-time bids, automated smart contract escrow, and event notifications directly on Stellar Testnet.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-light)', borderRadius: 12, padding: '0.75rem 1.15rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Active Auctions</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>{auctions.length}</span>
                  </div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-light)', borderRadius: 12, padding: '0.75rem 1.15rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Total Volume</span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{totalVolume} XLM</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter Controls & Search Bar */}
            <div className="search-filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.4rem', width: '100%', maxWidth: 'max-content' }}>
                {(['all', 'live', 'ended'] as const).map((tab) => (
                  <button
                    key={tab}
                    className={`btn ${activeFilterTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', textTransform: 'capitalize' }}
                    onClick={() => setActiveFilterTab(tab)}
                  >
                    {tab === 'live' && <Radio style={{ width: 13, height: 13 }} />}
                    {tab} Auctions
                  </button>
                ))}
              </div>

              <div className="search-box" style={{ position: 'relative', width: 280 }}>
                <Search style={{ width: 16, height: 16, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
              </div>
            </div>

            {/* Layout: Main Grid & Side Live Event Stream */}
            <div className="dashboard-layout">
              <div className="auction-grid">
                {filteredAuctions.length === 0 ? (
                  <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No auctions found matching your criteria.
                  </div>
                ) : (
                  filteredAuctions.map((auc) => (
                    <AuctionCard
                      key={auc.id}
                      auction={auc}
                      onBidClick={(auctionToBid) => setSelectedAuctionForBid(auctionToBid)}
                    />
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
      <footer style={{ borderTop: '1px solid var(--border-light)', padding: '1.5rem', marginTop: '3rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)', width: '100%' }}>
        Real-Time Auction Web3 App • Stellar Soroban Testnet & Freighter Wallet • Built with React + TypeScript
      </footer>

      {/* Modals */}
      <BidModal
        auction={selectedAuctionForBid}
        onClose={() => setSelectedAuctionForBid(null)}
        onSubmitBid={handleBidSubmit}
      />

      {isCreateModalOpen && (
        <CreateAuctionModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreateAuction={handleCreateAuctionSubmit}
        />
      )}

      <TxStatusModal
        status={txStatus}
        onClose={() => setTxStatus(null)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <WalletProvider>
      <Dashboard />
    </WalletProvider>
  );
};

export default App;
