import { useState } from 'react'
import Header from '../components/ui/Header'
import MainStreamSelector from '../components/stream/MainStreamSelector'
import StreamGrid from '../components/stream/StreamGrid'
import StreamSettings from '../components/forms/StreamSettings'

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <div className="flex-1 flex flex-col">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />

      <MainStreamSelector />

      <StreamGrid />

      <StreamSettings
        key={isSettingsOpen ? 'open' : 'closed'}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}
