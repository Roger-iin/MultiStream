import { useStreamStore } from '../../hooks/useStreamStore'
import { Settings, Compass, Columns, Rows } from 'lucide-react'

interface HeaderProps {
  onOpenSettings: () => void
}

export default function Header({ onOpenSettings }: HeaderProps) {
  const { layoutOrientation, setLayoutOrientation } = useStreamStore()

  const toggleLayout = () => {
    setLayoutOrientation(layoutOrientation === 'vertical' ? 'horizontal' : 'vertical')
  }

  return (
    <header
      className="w-full py-4 px-6 flex items-center justify-between glass-panel rounded-2xl border-slate-800/80 mb-6"
      role="banner"
    >
      {/* Brand logo & title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
          <Compass className="w-5.5 h-5.5 text-white" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-none">
            MultiStream{' '}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Viewer
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium hidden sm:block">
            Assista YouTube, Twitch e Kick simultaneamente com áudio inteligente
          </p>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-3">
        {/* Layout Orientation Toggle */}
        <button
          onClick={toggleLayout}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200"
          aria-label={`Mudar orientação do layout. Atual: ${
            layoutOrientation === 'vertical' ? 'Sidebar Vertical' : 'Grid Horizontal'
          }`}
          title="Mudar layout das lives secundárias"
        >
          {layoutOrientation === 'vertical' ? (
            <>
              <Columns className="w-3.5 h-3.5 text-violet-400" />
              <span className="hidden md:inline">Sidebar Lateral</span>
            </>
          ) : (
            <>
              <Rows className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="hidden md:inline">Layout Horizontal</span>
            </>
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-xl shadow-md hover:shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-95 transition-all duration-200 cursor-pointer"
          aria-label="Abrir configurações de canais das lives"
        >
          <Settings className="w-3.5 h-3.5 animate-pulse-slow" />
          <span>Canais</span>
        </button>
      </div>
    </header>
  )
}
