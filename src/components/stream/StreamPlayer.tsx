import { useEffect, useRef } from 'react'
import type { Platform, StreamPlayerController } from '../../types/stream'
import { playerRegistry } from '../../services/playerRegistry'
import { loadScript } from '../../utils/scriptLoader'
import { parseYoutubeInput } from '../../utils/youtube'
import { useStreamStore } from '../../hooks/useStreamStore'
import { AlertCircle } from 'lucide-react'

interface StreamPlayerProps {
  platform: Platform
  channel: string
  isMain: boolean
}

export default function StreamPlayer({ platform, channel, isMain }: StreamPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!channel) return

    let active = true
    const currentContainer = containerRef.current
    if (currentContainer) {
      currentContainer.innerHTML = ''
    }

    if (platform === 'youtube') {
      const parsed = parseYoutubeInput(channel)

      // Channel URLs already have `?channel=ID`, so use `&` to append params.
      // Video URLs have no query string, so we must start with `?`.
      const baseUrl =
        parsed.type === 'channel'
          ? `https://www.youtube.com/embed/live_stream?channel=${parsed.id}`
          : `https://www.youtube.com/embed/${parsed.id}`
      const sep = parsed.type === 'channel' ? '&' : '?'
      const origin = window.location.origin || 'http://localhost'

      const iframeId = `yt-player-${parsed.id}`
      const iframe = document.createElement('iframe')
      iframe.id = iframeId
      // `origin` is required alongside `enablejsapi=1` to allow postMessage
      iframe.src = `${baseUrl}${sep}enablejsapi=1&autoplay=1&mute=${isMain ? 0 : 1}&rel=0&origin=${origin}`
      iframe.className = 'w-full h-full border-0 rounded-lg shadow-lg'
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture'
      iframe.allowFullscreen = true

      if (currentContainer) {
        currentContainer.appendChild(iframe)
      }

      // Initialize YouTube IFrame API for programmatic volume control
      loadScript<any>('https://www.youtube.com/iframe_api', 'YT')
        .then((YT) => {
          if (!active || !YT) return
          if (YT.Player) {
            new YT.Player(iframeId, {
              events: {
                onReady: (event: {
                  target: { setVolume: (v: number) => void; mute: () => void; unmute: () => void }
                }) => {
                  if (!active) return
                  const controller: StreamPlayerController = {
                    setVolume: (v) => event.target.setVolume(v),
                    mute: () => event.target.mute(),
                    unmute: () => event.target.unmute(),
                  }
                  playerRegistry.register('youtube', controller)

                  // Initial volume: unmute main at 100, just mute secondary
                  const main = useStreamStore.getState().mainStream
                  if (main === 'youtube') {
                    controller.unmute()
                    controller.setVolume(100)
                  } else {
                    controller.mute()
                  }
                },
              },
            })
          }
        })
        .catch((err) => {
          console.error('Failed to load YouTube API', err)
        })
    } else if (platform === 'twitch') {
      const hostname = window.location.hostname || 'localhost'

      const iframe = document.createElement('iframe')
      // A Twitch exige que o origin do parent seja exato.
      iframe.src = `https://player.twitch.tv/?channel=${channel}&parent=${hostname}&autoplay=true&muted=true`

      // Unificando o estilo para usar as mesmas classes do YouTube/Kick
      // Isso garante que o elemento tenha volume e visibilidade no momento do append
      iframe.className = 'w-full h-full border-0 rounded-lg shadow-lg min-h-[300px]'
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'
      iframe.allowFullscreen = true // Substitui o setAttribute manual que causava o aviso

      iframe.onload = () => {
        if (isMain) {
          setTimeout(() => {
            if (!active) return
            iframe.contentWindow?.postMessage(
              JSON.stringify({ eventName: 'SET_MUTED', params: [false] }),
              'https://player.twitch.tv',
            )
          }, 1500)
        }
      }

      // IMPORTANTE: Garante que o iframe só é inserido se o container estiver visível
      if (currentContainer) {
        currentContainer.appendChild(iframe)
      }

      // Removida a chamada dinâmica loadScript('https://embed.twitch.tv/embed/v1.js') daqui.
      // Chamar isso repetidas vezes causava o Erro 429 e o Memory Leak.

      const controller: StreamPlayerController = {
        setVolume: (v) => {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ eventName: 'SET_VOLUME', params: [v / 100] }),
            'https://player.twitch.tv',
          )
        },
        mute: () => {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ eventName: 'SET_MUTED', params: [true] }),
            'https://player.twitch.tv',
          )
        },
        unmute: () => {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ eventName: 'SET_MUTED', params: [false] }),
            'https://player.twitch.tv',
          )
        },
      }
      playerRegistry.register('twitch', controller)
    } else if (platform === 'kick') {
      const iframe = document.createElement('iframe')

      // Correção da URL: A Kick geralmente exige este formato para embeds de terceiros
      // Evite passar autoplay=true como query param, deixe o iframe lidar com isso nativamente se possível.
      // Se precisar de mute, a URL correta costuma ser na rota de clipe ou canal, mas o padrão é:
      iframe.src = `https://player.kick.com/${channel}`

      iframe.className = 'w-full h-full border-0 rounded-lg shadow-lg min-h-[300px]'
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'
      iframe.allowFullscreen = true // Corrige o aviso do React

      if (currentContainer) {
        currentContainer.appendChild(iframe)
      }

      // Kick volume cannot be controlled via postMessage; register a stub
      const controller: StreamPlayerController = {
        setVolume: () => {},
        mute: () => {},
        unmute: () => {},
      }
      playerRegistry.register('kick', controller)
    }

    return () => {
      active = false
      playerRegistry.unregister(platform)
      if (currentContainer) {
        currentContainer.innerHTML = ''
      }
    }
  }, [channel, platform, isMain])

  const platformLabel = platform.charAt(0).toUpperCase() + platform.slice(1)

  // Early return if channel is missing
  if (!channel) {
    return (
      <div
        className="relative w-full h-full min-h-[200px] flex items-center justify-center rounded-xl overflow-hidden glass-card group"
        aria-label={`Player da live do ${platformLabel}`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-center p-6 z-10 border border-slate-800 rounded-xl">
          <AlertCircle className="w-12 h-12 text-violet-500/80 mb-3" />
          <h3 className="text-white font-semibold text-base mb-1">{platformLabel}</h3>
          <p className="text-slate-400 text-sm max-w-[200px] mb-4">Canal não configurado</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-full min-h-[200px] flex items-center justify-center rounded-xl overflow-hidden glass-card group"
      aria-label={`Player da live do ${platformLabel}`}
    >
      {/* Container holding the dynamically injected player iframe */}
      <div ref={containerRef} className="w-full h-full" style={{ minHeight: '200px' }} />
    </div>
  )
}
