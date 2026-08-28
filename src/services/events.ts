import { SorobanEvent } from '../types';

type EventListenerCallback = (event: SorobanEvent) => void;

class SorobanEventStreamer {
  private listeners: EventListenerCallback[] = [];
  private isPolling = false;
  private timerId: any = null;

  constructor() {
    // Initialize mock background streamer for demo live activity
  }

  public subscribe(callback: EventListenerCallback): () => void {
    this.listeners.push(callback);
    if (!this.isPolling) {
      this.startPolling();
    }
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
      if (this.listeners.length === 0) {
        this.stopPolling();
      }
    };
  }

  public emitEvent(event: SorobanEvent) {
    this.listeners.forEach((cb) => cb(event));
  }

  private startPolling() {
    this.isPolling = true;
    // Simulate real-time live events periodically for testing UI updates
    this.timerId = setInterval(() => {
      if (Math.random() > 0.65) {
        const randomAuctionId = Math.floor(Math.random() * 3) + 1;
        const randomAmount = Math.floor(Math.random() * 50) + 10;
        const mockAddress = `G${Math.random().toString(36).substring(2, 8).toUpperCase()}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        const simulatedEvent: SorobanEvent = {
          id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          type: 'bid_placed',
          auctionId: randomAuctionId,
          user: mockAddress,
          amount: randomAmount,
          timestamp: Math.floor(Date.now() / 1000),
          txHash: Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        };

        this.emitEvent(simulatedEvent);
      }
    }, 12000); // every 12 seconds
  }

  private stopPolling() {
    this.isPolling = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}

export const eventStreamer = new SorobanEventStreamer();
