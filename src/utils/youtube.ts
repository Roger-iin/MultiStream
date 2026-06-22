export interface ParsedYoutube {
  type: 'video' | 'channel'
  id: string
}

/**
 * Parses a YouTube input string (raw ID, handle, or URL) and returns
 * the identified type and key ID to use in the embed iframe.
 */
export function parseYoutubeInput(input: string): ParsedYoutube {
  const trimmed = input.trim()

  // 1. Check if it matches a YouTube Channel ID directly (UC + 22 chars)
  if (/^UC[\w-]{22}$/i.test(trimmed)) {
    return { type: 'channel', id: trimmed }
  }

  // 2. Check if it matches a standard 11-character video ID directly
  if (/^[\w-]{11}$/.test(trimmed)) {
    return { type: 'video', id: trimmed }
  }

  // 3. Try parsing as a URL
  try {
    // Add protocol if missing to enable standard URL parsing
    const urlString = trimmed.match(/^https?:\/\//i) ? trimmed : `https://${trimmed}`
    const url = new URL(urlString)

    // Check query params for video ID: ?v=VIDEO_ID
    const vParam = url.searchParams.get('v')
    if (vParam && /^[\w-]{11}$/.test(vParam)) {
      return { type: 'video', id: vParam }
    }

    // Check path for live video ID: youtube.com/live/VIDEO_ID
    const liveMatch = url.pathname.match(/\/live\/([\w-]{11})/i)
    if (liveMatch && liveMatch[1]) {
      return { type: 'video', id: liveMatch[1] }
    }

    // Check path for embed video ID: youtube.com/embed/VIDEO_ID
    const embedMatch = url.pathname.match(/\/embed\/([\w-]{11})/i)
    if (embedMatch && embedMatch[1]) {
      return { type: 'video', id: embedMatch[1] }
    }

    // Check path for channel ID: youtube.com/channel/CHANNEL_ID
    const channelMatch = url.pathname.match(/\/channel\/(UC[\w-]{22})/i)
    if (channelMatch && channelMatch[1]) {
      return { type: 'channel', id: channelMatch[1] }
    }
  } catch {
    // Ignore URL parse error and fall back to raw handling
  }

  // Fallback: If it doesn't match standard patterns, return as channel
  return { type: 'channel', id: trimmed }
}
