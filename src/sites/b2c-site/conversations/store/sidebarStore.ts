import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
  isPinned: boolean;
  togglePinned: () => void;
  setPinned: (pinned: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isPinned: true, // Default to pinned (expanded)
      togglePinned: () => set((state) => ({ isPinned: !state.isPinned })),
      setPinned: (pinned) => set({ isPinned: pinned }),
    }),
    {
      name: 'sidebar-storage',
    }
  )
);
