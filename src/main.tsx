import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Analytics } from '@vercel/analytics/react';
import * as Sentry from '@sentry/react';

// ─── Sentry error monitoring (Task 4) ───────────────────────────────────────
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.MODE || 'production',
  release: 'stellarbid@1.0.0',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  beforeSend(event) {
    // Don't send Freighter wallet errors that are expected (user declined)
    if (event.exception?.values?.some(e =>
      e.value?.includes('User declined') ||
      e.value?.includes('signing declined') ||
      e.value?.includes('Freighter') ||
      e.value?.includes('not installed')
    )) {
      return null;
    }
    return event;
  },
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020509',
          color: '#f0f4ff',
          fontFamily: 'Outfit, sans-serif',
          textAlign: 'center',
          gap: '1rem',
          padding: '2rem',
        }}>
          <div style={{ fontSize: '3rem' }}>⚡</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Something went wrong</h2>
          <p style={{ color: '#7a8daa', maxWidth: 400 }}>
            An unexpected error occurred. The Sentry error report has been automatically submitted.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.65rem 1.5rem',
              background: 'linear-gradient(135deg, #00d97e, #00a85e)',
              color: '#000',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Reload App
          </button>
        </div>
      }
    >
      <App />
    </Sentry.ErrorBoundary>
    {/* Vercel Analytics — auto-tracks pageviews & interactions (Task 4) */}
    <Analytics />
  </React.StrictMode>
);
