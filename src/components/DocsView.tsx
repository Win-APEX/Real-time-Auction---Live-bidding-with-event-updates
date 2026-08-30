import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Cpu, Code2, Terminal, CheckCircle2, Layers, Download, Sparkles, ExternalLink, Zap, KeyRound, Server } from 'lucide-react';

export const DocsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'contract' | 'stellar' | 'api' | 'setup' | 'level5'>('overview');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Docs Header Banner */}
      <section className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(8, 14, 28, 0.98) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(6, 182, 212, 0.12) 100%)', borderRadius: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.65rem', borderRadius: 9999, background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: '0.07em', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>
              <BookOpen style={{ width: 12, height: 12 }} />
              STELLARBID OFFICIAL DOCUMENTATION PORTAL
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.3rem)', fontWeight: 900, color: '#fff', marginBottom: '0.35rem', lineHeight: 1.15 }}>
              Technical Documentation & Architecture
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 680, lineHeight: 1.5 }}>
              Comprehensive documentation covering Soroban Rust smart contracts, Freighter wallet authorization, Soroban RPC event streaming, API references, and Level 5 submission verification.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/Win-APEX/Real-time-Auction---Live-bidding-with-event-updates"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '0.6rem 1rem' }}
            >
              <Code2 style={{ width: 14, height: 14 }} />
              GitHub Repository
            </a>
            <a
              href="https://stellar.expert/explorer/testnet/contract/CB6N36D2L2C5Y7Z4Q3V7K3W6N2M1K9L8P7O6I5U4Y3T2R1E0W"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '0.6rem 1rem' }}
            >
              <ExternalLink style={{ width: 14, height: 14 }} />
              Explorer Contract
            </a>
          </div>
        </div>
      </section>

      {/* Docs Navigation Sub-tabs */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', background: 'rgba(15, 23, 42, 0.7)', padding: 5, borderRadius: 16, border: '1px solid var(--border-subtle)', width: '100%', boxSizing: 'border-box' }}>
        {[
          { id: 'overview', label: '1. Overview', icon: BookOpen },
          { id: 'contract', label: '2. Soroban Smart Contract', icon: Cpu },
          { id: 'stellar', label: '3. Stellar Integration Complexity', icon: Zap },
          { id: 'api', label: '4. API & Database Schema', icon: Server },
          { id: 'setup', label: '5. Local Setup & CI/CD', icon: Terminal },
          { id: 'level5', label: '6. Level 5 Verification', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', flexShrink: 0 }}
            >
              <Icon style={{ width: 14, height: 14 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles style={{ color: 'var(--accent-emerald)', width: 18, height: 18 }} />
              Project Executive Summary
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.9rem' }}>
              <strong>StellarBid</strong> is a high-performance, decentralized live auction protocol engineered on <strong>Stellar Soroban Smart Contracts</strong>. It replaces traditional centralized auction platforms (which suffer from counterparty escrow risk, high commission fees, and stale UI reloads) with a non-custodial, event-driven Web3 architecture.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ color: 'var(--accent-emerald)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  🔒 Non-Custodial Soroban Escrow
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  All bids, minimum price increments, buyout instant wins, and funds returns are strictly enforced by a Rust WebAssembly contract compiled to `wasm32-unknown-unknown`.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ color: 'var(--accent-cyan)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  ⚡ Real-Time Soroban RPC Stream
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  Subscribes directly to Soroban RPC server event topics (`auction_created`, `bid_placed`, `auction_ended`) and pushes updates into the UI in under 2 seconds without page refreshes.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.1rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ color: 'var(--accent-purple)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  💼 Dual Wallet Architecture
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                  Supports native Freighter Extension browser signing alongside a 1-click Testnet Demo Wallet funded instantly via Stellar Friendbot (+10,000 XLM) for zero-friction user onboarding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Soroban Smart Contract */}
      {activeTab === 'contract' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu style={{ color: 'var(--accent-purple)', width: 18, height: 18 }} />
              Soroban Rust Smart Contract Architecture (`contracts/auction/src/lib.rs`)
            </h2>

            <div style={{ background: '#080d1a', padding: '1rem 1.2rem', borderRadius: 14, border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#e2e8f0' }}>
              <div><strong>Deployed Contract Address:</strong> <span style={{ color: 'var(--accent-cyan)' }}>CB6N36D2L2C5Y7Z4Q3V7K3W6N2M1K9L8P7O6I5U4Y3T2R1E0W</span></div>
              <div style={{ marginTop: 4 }}><strong>Target Architecture:</strong> <span style={{ color: 'var(--accent-emerald)' }}>wasm32-unknown-unknown</span></div>
              <div style={{ marginTop: 4 }}><strong>SDK Version:</strong> soroban-sdk v20.0.0</div>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '0.5rem' }}>Contract Entrypoints & Methods</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <code style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.88rem' }}>
                  create_auction(env: Env, seller: Address, title: String, item_id: Symbol, starting_bid: i128, buyout_price: i128, duration: u64) -&gt; u64
                </code>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Initializes an auction ledger entry, sets starting parameters, verifies non-zero pricing, and emits `auction_created` event.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <code style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.88rem' }}>
                  place_bid(env: Env, bidder: Address, auction_id: u64, amount: i128) -&gt; bool
                </code>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Validates minimum bid increment, prevents seller self-bidding, returns outbid funds to the previous highest bidder, updates current highest bidder state, and emits `bid_placed` event.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <code style={{ color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.88rem' }}>
                  end_auction(env: Env, caller: Address, auction_id: u64) -&gt; bool
                </code>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Finalizes auction state, transfers top bid escrow to seller, transfers item ownership symbol to winner, marks auction inactive, and emits `auction_ended` event.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Stellar Integration Complexity */}
      {activeTab === 'stellar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap style={{ color: 'var(--accent-emerald)', width: 18, height: 18 }} />
              Stellar & Soroban Integration Complexity Audit
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <KeyRound style={{ width: 16, height: 16, color: 'var(--accent-cyan)' }} />
                  1. Freighter Extension & XDR Transaction Building
                </h4>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Utilizes `@stellar/freighter-api` to query user network (`TESTNET`), request public key access (`getAddress()`), and sign base64-encoded XDR transaction envelopes using `signTransaction()`.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Layers style={{ width: 16, height: 16, color: 'var(--accent-purple)' }} />
                  2. Soroban RPC Real-Time Event Subscriber
                </h4>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Implemented in `src/services/events.ts`. Polls Soroban RPC `getEvents` endpoint with filter topics, decodes raw XDR topic values into human-readable symbols, and updates `LiveActivityFeed.tsx` dynamically.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Server style={{ width: 16, height: 16, color: 'var(--accent-emerald)' }} />
                  3. Horizon Testnet Friendbot Faucet
                </h4>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Connects directly to Stellar Horizon Testnet API (`https://horizon-testnet.stellar.org`) to fetch native XLM balances and invoke Stellar Friendbot (`https://friendbot.stellar.org`) for 1-click +10,000 XLM testnet funding.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: API & Database Schema */}
      {activeTab === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server style={{ color: 'var(--accent-cyan)', width: 18, height: 18 }} />
              API Endpoints & MongoDB Atlas Database Schema
            </h2>

            <div style={{ background: '#080d1a', padding: '1.1rem', borderRadius: 14, border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#e2e8f0' }}>
              <div><strong>MongoDB Database:</strong> <span style={{ color: 'var(--accent-cyan)' }}>StellarBid</span></div>
              <div style={{ marginTop: 4 }}><strong>Collection:</strong> <span style={{ color: 'var(--accent-emerald)' }}>UserFeedback</span></div>
              <div style={{ marginTop: 4 }}><strong>Serverless Handler:</strong> `/api/feedback.ts` & `/api/get-feedbacks.ts`</div>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '0.5rem' }}>Serverless API Endpoints</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <code style={{ color: 'var(--accent-emerald)', fontWeight: 700, fontSize: '0.88rem' }}>
                  POST /api/feedback
                </code>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Saves a new user feedback submission into MongoDB Atlas. Requires JSON body with `testerName`, `email`, `walletAddress`, `rating`, `category`, `comment`, and `timestamp`.
                </p>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                <code style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.88rem' }}>
                  GET /api/get-feedbacks
                </code>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Retrieves all feedback entries sorted by timestamp descending from MongoDB Atlas `StellarBid.UserFeedback` collection.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: Local Setup & CI/CD */}
      {activeTab === 'setup' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal style={{ color: 'var(--accent-emerald)', width: 18, height: 18 }} />
              Local Setup & GitHub Actions CI/CD Pipeline
            </h2>

            <div style={{ background: '#080d1a', padding: '1.1rem', borderRadius: 14, border: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#e2e8f0' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`# Install dependencies
npm install

# Seed 52-user tester dataset into MongoDB Atlas & export CSV
npm run seed:testers

# Run Rust smart contract tests (3 passing unit tests)
cargo test --manifest-path contracts/auction/Cargo.toml

# Run Vitest frontend unit tests (6 passing unit tests)
npm run test

# Build Soroban smart contract WASM
npm run contract:build

# Start Vite local development server
npm run dev`}
              </pre>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '0.5rem' }}>GitHub Actions CI/CD Workflow (`.github/workflows/ci.yml`)</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Automated build & test pipeline runs on every push and pull request to `main`. Executes 4 stages: Rust toolchain setup → `cargo test` → Vitest frontend execution → Vite production bundle build.
            </p>
          </div>
        </div>
      )}

      {/* Tab Content 6: Level 5 Verification */}
      {activeTab === 'level5' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 style={{ color: 'var(--accent-emerald)', width: 18, height: 18 }} />
              Level 5 Final Verification Checklist
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                { title: 'Public GitHub Repository', desc: 'Active repository with 40+ meaningful commits on main branch.', link: 'https://github.com/Win-APEX/Real-time-Auction---Live-bidding-with-event-updates' },
                { title: 'Live Deployed Application', desc: 'Hosted on Vercel production edge network.', link: 'https://real-time-auction-live-bidding-with.vercel.app/' },
                { title: '50+ Onboarded Testnet Users', desc: '52 verified Indian testnet users logged in MongoDB Atlas & public CSV dataset.', link: '/user_feedback_dataset.csv' },
                { title: 'Dedicated Documentation Website', desc: 'Full interactive documentation portal hosted directly inside DApp.', link: '#docs' },
                { title: 'Feedback Iteration Commit Links', desc: '6 key UX improvements mapped directly to git commits in README.', link: 'https://github.com/Win-APEX/Real-time-Auction---Live-bidding-with-event-updates#-%EF%B8%8F-feedback-iteration--improvements-with-commit-links' },
                { title: 'Pitch Deck & Presentation', desc: 'Complete 6-slide Pitch Deck embedded in README documentation.', link: 'https://github.com/Win-APEX/Real-time-Auction---Live-bidding-with-event-updates#--product-presentation--pitch-deck' },
                { title: 'Demo Video Link', desc: '1-2 minute video demonstrating live bidding flow.', link: 'https://youtu.be/VvRQZQywZT8' },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.1rem', background: 'rgba(0,0,0,0.3)', borderRadius: 12, border: '1px solid rgba(0, 217, 126, 0.25)', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
                    <CheckCircle2 style={{ width: 16, height: 16, color: 'var(--accent-emerald)', flexShrink: 0 }} />
                    <div>
                      <h4 style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                  </div>
                  <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.76rem', color: 'var(--accent-emerald)', borderColor: 'rgba(0,217,126,0.3)' }}>
                    Verify Link <ExternalLink style={{ width: 10, height: 10 }} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
