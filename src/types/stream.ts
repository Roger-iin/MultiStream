export type Platform = 'youtube' | 'twitch' | 'kick'

export interface ChannelConfig {
  youtube: string
  twitch: string
  kick: string
}

export type LayoutOrientation = 'horizontal' | 'vertical'

export interface StreamState {
  channels: ChannelConfig
  mainStream: Platform
  layoutOrientation: LayoutOrientation
  isMuted: Record<Platform, boolean>
  volumes: Record<Platform, number>
}

export interface StreamPlayerController {
  setVolume(volume: number): void
  mute(): void
  unmute(): void
}
