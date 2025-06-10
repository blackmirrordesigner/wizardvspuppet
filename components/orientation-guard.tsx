"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"

interface OrientationGuardProps {
  children: React.ReactNode
}

export function OrientationGuard({ children }: OrientationGuardProps) {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth <= 768
      const isPortraitMode = window.innerHeight > window.innerWidth
      setIsPortrait(isMobile && isPortraitMode)
    }

    checkOrientation()
    window.addEventListener("resize", checkOrientation)
    window.addEventListener("orientationchange", checkOrientation)

    return () => {
      window.removeEventListener("resize", checkOrientation)
      window.removeEventListener("orientationchange", checkOrientation)
    }
  }, [])

  if (isPortrait) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-center p-8">
          <RotateCcw className="w-16 h-16 text-white mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-2 font-heading">Rotate Your Device</h2>
          <p className="text-gray-300 font-body">Rock Paper Fire is best experienced in landscape mode</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
