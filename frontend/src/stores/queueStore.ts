import { create } from 'zustand';
import { QueueItem } from '../types/queue.types';
import { QueueUpdatedEvent } from '../types/socket.types';

interface QueueState {
  queueItems: QueueItem[];
  slaBreaches: string[]; // List of tokenIds that breached SLA
  lastUpdatedAt: Date | null;
  setQueue: (items: QueueItem[]) => void;
  applyQueueUpdate: (event: QueueUpdatedEvent) => void;
  addSlaBreach: (tokenId: string) => void;
  clearSlaBreach: (tokenId: string) => void;
  resetQueue: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  queueItems: [],
  slaBreaches: [],
  lastUpdatedAt: null,

  setQueue: (items) => set({ queueItems: items, lastUpdatedAt: new Date() }),

  applyQueueUpdate: (event) => set({
    queueItems: event.queue,
    lastUpdatedAt: new Date(event.timestamp)
  }),

  addSlaBreach: (tokenId) => set((state) => {
    if (state.slaBreaches.includes(tokenId)) return {};
    return { slaBreaches: [...state.slaBreaches, tokenId] };
  }),

  clearSlaBreach: (tokenId) => set((state) => ({
    slaBreaches: state.slaBreaches.filter(id => id !== tokenId)
  })),

  resetQueue: () => set({ queueItems: [], slaBreaches: [], lastUpdatedAt: null })
}));
