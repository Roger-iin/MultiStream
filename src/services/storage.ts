import type { ChannelConfig, Platform, LayoutOrientation } from '../types/stream'

const CHANNELS_KEY = 'multistream_channels'
const MAIN_STREAM_KEY = 'multistream_main_stream'
const LAYOUT_KEY = 'multistream_layout'

const DEFAULT_CHANNELS: ChannelConfig = {
  youtube: 'UCq54-RurqySGjGQjaac9JgA', // Gaules Channel ID (Gaules is the target from prompt example)
  twitch: 'gaules',
  kick: 'gaules',
}

export const StorageService = {
  getChannels(): ChannelConfig {
    try {
      const stored = localStorage.getItem(CHANNELS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return { ...DEFAULT_CHANNELS, ...parsed }
      }
    } catch (e) {
      console.error('Failed to load channels from storage', e)
    }
    return DEFAULT_CHANNELS
  },

  saveChannels(channels: ChannelConfig): void {
    try {
      localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels))
    } catch (e) {
      console.error('Failed to save channels to storage', e)
    }
  },

  getMainStream(): Platform {
    try {
      const stored = localStorage.getItem(MAIN_STREAM_KEY) as Platform
      if (stored === 'youtube' || stored === 'twitch' || stored === 'kick') {
        return stored
      }
    } catch (e) {
      console.error('Failed to load main stream from storage', e)
    }
    return 'youtube'
  },

  saveMainStream(mainStream: Platform): void {
    try {
      localStorage.setItem(MAIN_STREAM_KEY, mainStream)
    } catch (e) {
      console.error('Failed to save main stream to storage', e)
    }
  },

  getLayoutOrientation(): LayoutOrientation {
    try {
      const stored = localStorage.getItem(LAYOUT_KEY) as LayoutOrientation
      if (stored === 'horizontal' || stored === 'vertical') {
        return stored
      }
    } catch (e) {
      console.error('Failed to load layout orientation from storage', e)
    }
    return 'vertical'
  },

  saveLayoutOrientation(layout: LayoutOrientation): void {
    try {
      localStorage.setItem(LAYOUT_KEY, layout)
    } catch (e) {
      console.error('Failed to save layout orientation to storage', e)
    }
  },
}
