import { describe, it, expect } from 'vitest';

describe('Wallet Utilities Test Suite', () => {
  it('should truncate public key addresses correctly for display', () => {
    const key = 'GBXKQ73U62B2Z4KL901234567890123456789012345678904KL9';
    const formatted = `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
    expect(formatted).toBe('GBXK...4KL9');
  });

  it('should validate native XLM balance numbers', () => {
    const rawBalance = '150.7500000';
    const parsed = parseFloat(rawBalance);
    expect(parsed).toBe(150.75);
    expect(parsed).toBeGreaterThan(0);
  });

  it('should format XLM currency correctly', () => {
    const balance = 1234.567;
    expect(balance.toFixed(2)).toBe('1234.57');
  });
});
