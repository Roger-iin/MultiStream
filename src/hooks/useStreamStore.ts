import { create } from 'zustand'
import type { ChannelConfig, Platform, LayoutOrientation } from '../types/stream'
import { StorageService } from '../services/storage'
import { playerRegistry } from '../services/playerRegistry'

interface StreamStore {
  channels: ChannelConfig
  mainStream: Platform
  layoutOrientation: LayoutOrientation
  setChannels: (channels: ChannelConfig) => void
  setMainStream: (mainStream: Platform) => void
  setLayoutOrientation: (layoutOrientation: LayoutOrientation) => void
}

/**
 * JUSTIFICATION FOR USING ZUSTAND OVER USEREDUCER:
 *
 * 1. Performance & Unnecessary Re-renders:
 *    React's `useReducer` combined with `useContext` triggers a re-render on all subscribing components
 *    whenever any slice of the state changes, unless heavily optimized with custom memoization.
 *    Zustand uses selector-based subscriptions, ensuring that if a component only cares about the
 *    `layoutOrientation`, it will NOT re-render when the user changes a channel configuration.
 *
 * 2. Boilerplate Reduction & Maintainability:
 *    `useReducer` requires defining actions, action types, reducer functions, context providers,
 *    and custom hooks to read from the context. Zustand centralizes this in a single, type-safe store,
 *    making the code cleaner and easier to maintain for a senior developer.
 *
 * 3. Side Effects & Separation of Concerns:
 *    Zustand store allows running side effects (like saving to localStorage and updating
 *    programmatic player audio via the PlayerRegistry) cleanly inside the actions, keeping the React
 *    components focused entirely on rendering the user interface (SOLID principles).
 */
export const useStreamStore = create<StreamStore>((set) => ({
  channels: StorageService.getChannels(),
  mainStream: StorageService.getMainStream(),
  layoutOrientation: StorageService.getLayoutOrientation(),

  setChannels: (channels) => {
    StorageService.saveChannels(channels)
    set({ channels })
  },

  setMainStream: (mainStream) => {
    StorageService.saveMainStream(mainStream)
    set({ mainStream })
    // Dynamically adjust volumes for all registered stream players
    playerRegistry.adjustVolumes(mainStream)
  },

  setLayoutOrientation: (layoutOrientation) => {
    StorageService.saveLayoutOrientation(layoutOrientation)
    set({ layoutOrientation })
  },
}))
