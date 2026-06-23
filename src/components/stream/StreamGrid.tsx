import { useState } from 'react'
import { useStreamStore } from '../../hooks/useStreamStore'
import type { Platform } from '../../types/stream'
import StreamPlayer from './StreamPlayer'
import { ChevronDown, ChevronUp, Tv2 } from 'lucide-react'

export default function StreamGrid() {
  const { channels, mainStream, layoutOrientation } = useStreamStore()
  const [secondaryCollapsed, setSecondaryCollapsed] = useState(false)

  const allPlatforms: Platform[] = ['youtube', 'twitch', 'kick']
  const secondaryPlatforms = allPlatforms.filter((p) => p !== mainStream)

  const hasConfiguredAny = Object.values(channels).some(Boolean)

  if (!hasConfiguredAny) {
    return (
      <div
        className="w-full flex-1 flex flex-col items-center justify-center p-8 text-center rounded-2xl glass-panel min-h-[400px]"
        aria-live="polite"
      >
        <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-4 text-violet-400">
          <svg
            className="w-8 h-8 animate-bounce-slow"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Plataforma não configurada</h3>
        <p className="text-slate-400 text-sm max-w-sm">
          Abra a seção <strong>Canais</strong> no canto superior direito para inserir os canais do
          YouTube, Twitch e Kick.
        </p>
      </div>
    )
  }

  const renderPlayer = (platform: Platform, isMain: boolean) => (
    <StreamPlayer
      key={`${platform}-${channels[platform]}`}
      platform={platform}
      channel={channels[platform]}
      isMain={isMain}
    />
  )

  const isVertical = layoutOrientation === 'vertical'

  // Secondary players are ALWAYS mounted so streams keep running.
  // When collapsed, the wrapper is positioned off-screen (fixed, left: -9999px)
  // preserving real pixel dimensions so the iframes keep playing inside.
  const secondaryStyle: React.CSSProperties = secondaryCollapsed
    ? {
      position: 'fixed',
      left: '-9999px',
      top: '-9999px',
      width: '720px',
      height: '220px',
      pointerEvents: 'none',
      opacity: 0,
      zIndex: -1,
    }
    : {}

  return (
    <main className="w-full flex-1 flex flex-col gap-3 pb-3" aria-label="Grade de Transmissões">
      {isVertical ? (
        // ── SIDEBAR: main left (72%), secondaries stacked right (28%) ──────
        <div className="flex flex-col lg:flex-row gap-3 w-full flex-1">
          {/* Main — tall, takes most of the viewport */}
          <div className="flex-4 min-h-[400px] h-[660px] " style={{ minHeight: '40vh' }}>
            {renderPlayer(mainStream, true)}
          </div>

          {/* Secondary sidebar */}
          <div className="lg:flex-[1] flex flex-col gap-2 min-w-0">
            {/* Collapse toggle */}
            <button
              onClick={() => setSecondaryCollapsed((v) => !v)}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-semibold hover:bg-slate-700/60 transition-colors shrink-0"
            >
              <span className="flex items-center gap-1.5">
                <Tv2 className="w-3.5 h-3.5 text-violet-400" />
                Streams secundários
              </span>
              {secondaryCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Secondary players — always mounted, off-screen when collapsed */}
            <div
              className={secondaryCollapsed ? '' : 'flex flex-row lg:flex-col gap-2 flex-1'}
              style={secondaryStyle}
            >
              {secondaryPlatforms.map((platform) => (
                <div
                  key={platform}
                  className="flex-1 min-h-[140px] "
                  style={secondaryCollapsed ? { width: '360px', height: '220px' } : {}}
                >
                  {renderPlayer(platform, false)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // ── HORIZONTAL: main on top (large), secondaries strip below ────────
        <div className="flex flex-col gap-3 w-full flex-1">
          {/* Main stream — dominant height */}
          <div
            className="w-full rounded-xl overflow-hidden "
            style={{
              height: '95vh',
              minHeight: '380px',
            }}
          >
            {renderPlayer(mainStream, true)}
          </div>

          {/* Secondary strip controls */}
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => setSecondaryCollapsed((v) => !v)}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 text-xs font-semibold hover:bg-slate-700/60 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Tv2 className="w-3.5 h-3.5 text-violet-400" />
                Streams secundários
                {secondaryCollapsed && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px]">
                    rodando em background
                  </span>
                )}
              </span>
              {secondaryCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Secondary players — always mounted, off-screen when collapsed */}
            <div
              className={secondaryCollapsed ? '' : 'flex flex-col sm:flex-row gap-3 w-full'}
              style={secondaryCollapsed ? secondaryStyle : { height: '60vh', minHeight: '150px' }}
            >
              {secondaryPlatforms.map((platform) => (
                <div
                  key={platform}
                  className="flex-1 min-w-0 h-full "
                >
                  {renderPlayer(platform, false)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
