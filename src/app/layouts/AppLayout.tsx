import React from 'react'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#0b0f19] via-[#090b11] to-[#040508] p-4 md:p-6 text-slate-100 selection:bg-violet-600 selection:text-white transition-colors duration-300">
      <div className="max-w-[1600px] w-full mx-auto flex-1 flex flex-col">{children}</div>
      <footer
        className="w-full text-center py-4 mt-6 border-t border-slate-900/60 text-slate-500 text-[10px] md:text-xs"
        role="contentinfo"
      >
        <p>
          &copy; {new Date().getFullYear()} MultiStream Viewer. Desenvolvido com React 19,
          TypeScript e TailwindCSS.
        </p>
      </footer>
    </div>
  )
}
