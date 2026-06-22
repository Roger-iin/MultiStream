import { useState, useEffect } from 'react'
import { useStreamStore } from '../../hooks/useStreamStore'
import type { ChannelConfig } from '../../types/stream'
import { X, Video, Save, Info } from 'lucide-react'

// Custom YouTube brand icon SVG to replace missing lucide-react brand icons
const YoutubeIcon = () => (
  <svg className="w-4 h-4 fill-current text-red-500" viewBox="0 0 24 24">
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.54 12 3.54 12 3.54s-7.53 0-9.388.515A3.003 3.003 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.46 12 20.46 12 20.46s7.53 0 9.388-.515a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

interface StreamSettingsProps {
  isOpen: boolean
  onClose: () => void
}

export default function StreamSettings({ isOpen, onClose }: StreamSettingsProps) {
  const { channels, setChannels } = useStreamStore()
  const [formState, setFormState] = useState<ChannelConfig>(channels)

  // Lock page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setChannels(formState)
    onClose()
  }

  const handleChange = (platform: keyof ChannelConfig, value: string) => {
    setFormState((prev) => ({ ...prev, [platform]: value }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-lg glass-panel rounded-2xl border-slate-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 id="modal-title" className="text-lg font-bold text-white flex items-center gap-2 m-0">
            <Video className="w-5 h-5 text-violet-400" />
            Configurar Canais
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* YouTube Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-slate-200 flex items-center gap-2"
              htmlFor="youtube"
            >
              <YoutubeIcon />
              Canal ou Vídeo do YouTube
            </label>
            <input
              id="youtube"
              type="text"
              value={formState.youtube}
              onChange={(e) => handleChange('youtube', e.target.value)}
              placeholder="Ex: UCq54-RurqySGjGQjaac9JgA (ID) ou dQw4w9WgXcQ (Vídeo)"
              className="w-full glass-input"
              required
            />
            <div className="flex gap-1.5 p-2 bg-slate-950/50 rounded-lg text-[11px] text-slate-400 border border-slate-800/60">
              <Info className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
              <span>
                Para YouTube, recomendamos usar o <strong>Channel ID</strong> (UC...) ou o{' '}
                <strong>Video ID</strong> da live atual para evitar limitações de embed por apelido.
              </span>
            </div>
          </div>

          {/* Twitch Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-slate-200 flex items-center gap-2"
              htmlFor="twitch"
            >
              <svg className="w-4 h-4 text-purple-500 fill-current" viewBox="0 0 24 24">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
              Canal da Twitch
            </label>
            <input
              id="twitch"
              type="text"
              value={formState.twitch}
              onChange={(e) => handleChange('twitch', e.target.value)}
              placeholder="Ex: gaules"
              className="w-full glass-input"
              required
            />
          </div>

          {/* Kick Field */}
          <div className="space-y-2">
            <label
              className="text-sm font-semibold text-slate-200 flex items-center gap-2"
              htmlFor="kick"
            >
              <span className="w-4 h-4 text-green-500 font-extrabold text-xs flex items-center justify-center border border-green-500 rounded-sm leading-none">
                K
              </span>
              Canal da Kick
            </label>
            <input
              id="kick"
              type="text"
              value={formState.kick}
              onChange={(e) => handleChange('kick', e.target.value)}
              placeholder="Ex: gaules"
              className="w-full glass-input"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
