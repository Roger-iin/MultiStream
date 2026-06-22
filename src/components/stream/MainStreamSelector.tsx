import { useStreamStore } from '../../hooks/useStreamStore'
import type { Platform } from '../../types/stream'
import { Volume2 } from 'lucide-react'

// Custom YouTube brand icon SVG to replace missing lucide-react brand icons
const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current text-red-500" viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.54 12 3.54 12 3.54s-7.53 0-9.388.515A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.46 12 20.46 12 20.46s7.53 0 9.388-.515a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

export default function MainStreamSelector() {
  const { mainStream, setMainStream, channels } = useStreamStore()

  const platforms: { key: Platform; label: string; icon: React.ReactNode; activeColor: string }[] =
    [
      {
        key: 'youtube',
        label: 'YouTube',
        icon: <YoutubeIcon />,
        activeColor:
          'border-red-500 text-red-400 bg-red-950/20 shadow-red-500/10 ring-1 ring-red-500/30',
      },
      {
        key: 'twitch',
        label: 'Twitch',
        icon: (
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
          </svg>
        ),
        activeColor:
          'border-purple-500 text-purple-400 bg-purple-950/20 shadow-purple-500/10 ring-1 ring-purple-500/30',
      },
      {
        key: 'kick',
        label: 'Kick',
        icon: <span className="font-extrabold text-xs leading-none">K</span>,
        activeColor:
          'border-green-500 text-green-400 bg-green-950/20 shadow-green-500/10 ring-1 ring-green-500/30',
      },
    ]

  return (
    <div
      className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-slate-800/80"
      aria-label="Seleção da live principal"
    >
      <div className="flex items-center gap-2.5">
        <Volume2 className="w-5 h-5 text-violet-400 shrink-0" />
        <div>
          <h2 className="text-sm font-bold text-white m-0">Foco de Áudio & Live Principal</h2>
          <p className="text-[11px] text-slate-400 font-medium">
            Selecione a principal para dar 100% de volume. As outras ficarão em mudo (1%).
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-3 gap-2.5"
        role="radiogroup"
        aria-label="Escolha a plataforma principal"
      >
        {platforms.map(({ key, label, icon, activeColor }) => {
          const isSelected = mainStream === key
          const channelName = channels[key] || 'Não configurado'

          return (
            <button
              key={key}
              onClick={() => setMainStream(key)}
              role="radio"
              aria-checked={isSelected}
              className={`flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 px-4 py-2.5 md:py-2 rounded-xl border font-semibold text-xs transition-all duration-200 cursor-pointer ${
                isSelected
                  ? activeColor
                  : 'border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 bg-slate-950/40 hover:bg-slate-900/60'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {icon}
                <span>{label}</span>
              </span>
              <span
                className={`text-[10px] truncate max-w-[80px] font-normal ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}
              >
                ({channelName.length > 10 ? `${channelName.substring(0, 8)}...` : channelName})
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
