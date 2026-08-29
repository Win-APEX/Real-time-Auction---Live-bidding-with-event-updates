import React, { useState } from 'react';
import { MessageSquare, Star, Send, X, CheckCircle } from 'lucide-react';

interface FeedbackWidgetProps {
  userPublicKey?: string;
}

type Rating = 1 | 2 | 3 | 4 | 5;

/**
 * FeedbackWidget — Collects user feedback and POSTs to /api/feedback
 * which is a Vercel serverless function that saves to MongoDB Atlas.
 */
export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ userPublicKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!rating) { setError('Please select a star rating.'); return; }
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        rating,
        message: message.trim(),
        walletAddress: userPublicKey || 'anonymous',
        timestamp: new Date().toISOString(),
        appVersion: '1.0.0',
        page: window.location.href,
        userAgent: navigator.userAgent,
      };

      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      setSubmitted(true);
      setTimeout(() => { setIsOpen(false); setSubmitted(false); setRating(null); setMessage(''); }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const starLabels = ['Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
  const activeRating = hoverRating || rating || 0;

  return (
    <>
      {/* Floating trigger button */}
      <button
        id="feedback-trigger-btn"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 150,
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.65rem 1.1rem',
          background: 'linear-gradient(135deg, #00d97e 0%, #00a85e 100%)',
          color: '#000',
          border: 'none',
          borderRadius: '9999px',
          fontWeight: 700,
          fontSize: '0.85rem',
          fontFamily: 'Outfit, sans-serif',
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(0, 217, 126, 0.45)',
          transition: 'all 0.22s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px) scale(1.04)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0) scale(1)')}
        aria-label="Give Feedback"
      >
        <MessageSquare style={{ width: 16, height: 16 }} />
        Feedback
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Feedback form"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(12px)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: '1.5rem',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div
            style={{
              background: 'linear-gradient(145deg, #0d1526 0%, #0a1020 100%)',
              border: '1px solid rgba(0, 217, 126, 0.2)',
              borderRadius: 24,
              width: '100%',
              maxWidth: 400,
              padding: '1.75rem',
              boxShadow: '0 24px 64px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,217,126,0.1)',
              animation: 'modal-appear 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '0.2rem' }}>
                  Share Your Feedback
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#7a8daa' }}>
                  Help us improve StellarBid · Saved to MongoDB Atlas
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#7a8daa', cursor: 'pointer', padding: 4 }}
                aria-label="Close feedback"
              >
                <X style={{ width: 18, height: 18 }} />
              </button>
            </div>

            {submitted ? (
              /* Success State */
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle style={{ width: 48, height: 48, color: '#00d97e', margin: '0 auto 1rem' }} />
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: '0.4rem' }}>
                  Thank you!
                </div>
                <div style={{ color: '#7a8daa', fontSize: '0.88rem' }}>
                  Your feedback has been saved.
                </div>
              </div>
            ) : (
              <>
                {/* Star Rating */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#7a8daa', display: 'block', marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    How would you rate your experience?
                  </label>
                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                    {([1, 2, 3, 4, 5] as Rating[]).map((star) => (
                      <button
                        key={star}
                        id={`feedback-star-${star}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`${star} star — ${starLabels[star - 1]}`}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          transition: 'transform 0.15s ease',
                          transform: activeRating >= star ? 'scale(1.15)' : 'scale(1)',
                        }}
                      >
                        <Star
                          style={{
                            width: 32,
                            height: 32,
                            fill: activeRating >= star ? '#fbbf24' : 'transparent',
                            color: activeRating >= star ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                            transition: 'all 0.15s ease',
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  {activeRating > 0 && (
                    <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#fbbf24', marginTop: '0.35rem', fontWeight: 600 }}>
                      {starLabels[activeRating - 1]}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#7a8daa', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Any comments? <span style={{ opacity: 0.5 }}>(Optional)</span>
                  </label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What did you like? What can we improve?"
                    rows={3}
                    maxLength={500}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#f0f4ff',
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: 80,
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#00d97e')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                  <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>
                    {message.length}/500
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    padding: '0.55rem 0.85rem',
                    background: 'rgba(251,75,110,0.1)',
                    border: '1px solid rgba(251,75,110,0.25)',
                    borderRadius: 10,
                    color: '#fb4b6e',
                    fontSize: '0.82rem',
                    marginBottom: '1rem',
                  }}>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="feedback-submit-btn"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !rating}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    padding: '0.75rem',
                    background: !rating
                      ? 'rgba(255,255,255,0.06)'
                      : 'linear-gradient(135deg, #00d97e 0%, #00a85e 100%)',
                    color: !rating ? '#3d4f68' : '#000',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    fontFamily: 'Outfit, sans-serif',
                    cursor: !rating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: !rating ? 'none' : '0 4px 20px rgba(0,217,126,0.35)',
                  }}
                >
                  <Send style={{ width: 16, height: 16 }} />
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>

                {userPublicKey && (
                  <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#3d4f68', marginTop: '0.75rem' }}>
                    Submitting as <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#7a8daa' }}>
                      {userPublicKey.substring(0, 4)}…{userPublicKey.substring(userPublicKey.length - 4)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes modal-appear {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
};
