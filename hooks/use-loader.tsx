"use client"

import * as React from "react"
import { HashLoader } from "react-spinners"

interface LoaderContextValue {
  isLoading: boolean
  showLoader: () => void
  hideLoader: () => void
  toggleLoader: (state?: boolean) => void
}

const LoaderContext = React.createContext<LoaderContextValue | null>(null)

let externalToggle: ((state?: boolean) => void) | null = null

function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(false)

  const showLoader = React.useCallback(() => setIsLoading(true), [])
  const hideLoader = React.useCallback(() => setIsLoading(false), [])
  const toggleLoader = React.useCallback((state?: boolean) => {
    setIsLoading((prev) => (state !== undefined ? state : !prev))
  }, [])

  React.useEffect(() => {
    externalToggle = toggleLoader
    return () => {
      externalToggle = null
    }
  }, [toggleLoader])

  React.useEffect(() => {
    const html = document.documentElement
    if (isLoading) {
      html.style.overflow = "hidden"
    } else {
      html.style.overflow = ""
    }
    return () => {
      html.style.overflow = ""
    }
  }, [isLoading])

  const value = React.useMemo(
    () => ({ isLoading, showLoader, hideLoader, toggleLoader }),
    [isLoading, showLoader, hideLoader, toggleLoader]
  )

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-10000 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <HashLoader color="#155dfb" size={100} />
          </div>
        </div>
      )}
    </LoaderContext.Provider>
  )
}

function useLoader() {
  const context = React.useContext(LoaderContext)
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider")
  }
  return context
}

const loader = {
  show: () => externalToggle?.(true),
  hide: () => externalToggle?.(false),
  toggle: (state?: boolean) => externalToggle?.(state),
}

export { LoaderProvider, useLoader, loader }
