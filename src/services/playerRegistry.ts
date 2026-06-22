import type { Platform, StreamPlayerController } from '../types/stream'

class PlayerRegistry {
  private controllers = new Map<Platform, StreamPlayerController>()

  register(platform: Platform, controller: StreamPlayerController): void {
    this.controllers.set(platform, controller)
  }

  unregister(platform: Platform): void {
    this.controllers.delete(platform)
  }

  get(platform: Platform): StreamPlayerController | undefined {
    return this.controllers.get(platform)
  }

  adjustVolumes(mainStream: Platform): void {
    const platforms: Platform[] = ['youtube', 'twitch', 'kick']

    platforms.forEach((platform) => {
      const controller = this.controllers.get(platform)
      if (!controller) return

      if (platform === mainStream) {
        controller.unmute()
        controller.setVolume(100)
      } else {
        // Set secondary streams to 1% volume and mute them
        controller.setVolume(1)
        controller.mute()
      }
    })
  }
}

export const playerRegistry = new PlayerRegistry()
