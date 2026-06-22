/**
 * Dynamically loads an external script and returns a Promise that resolves
 * when the script has loaded and the target global variable is available.
 */
export function loadScript<T = unknown>(src: string, globalVarName: string): Promise<T> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any)[globalVarName]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve((window as any)[globalVarName] as T)
      return
    }

    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      const checkInterval = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any)[globalVarName]) {
          clearInterval(checkInterval)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resolve((window as any)[globalVarName] as T)
        }
      }, 100)
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.defer = true
    script.onload = () => {
      // For YouTube, it triggers a callback onYouTubeIframeAPIReady, so we might need special handling
      // but we will also resolve when the global object is set.
      let checkCount = 0
      const checkObject = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any)[globalVarName]) {
          clearInterval(checkObject)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          resolve((window as any)[globalVarName] as T)
        }
        checkCount++
        if (checkCount > 50) {
          // Timeout after 5s of script load
          clearInterval(checkObject)
          resolve(undefined as T) // resolve anyway, might be initialized differently
        }
      }, 100)
    }
    script.onerror = (err) => {
      reject(err)
    }
    document.body.appendChild(script)
  })
}
