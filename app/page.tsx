"use client"

import { useEffect, useState } from "react"
import { Detection } from "@mediapipe/tasks-vision"

// --- SYSTEM HOOKS ---
import { useCameraStream } from "@/hooks/useCameraStream"
import { useDrishtiWorker } from "@/hooks/useDrishtiWorker"
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant"
import { useTacticalAlerts } from "@/hooks/useTacticalAlerts"
import { useAutoLog } from "@/hooks/useAutoLog" // Persistent Dexie Database
import {
  getVideoOverlayMetrics,
  projectPixelBoxToViewport,
  VideoOverlayMetrics,
} from "@/lib/utils/videoOverlay"

// --- UI COMPONENTS ---
import TopHeader from "@/components/layout/TopHeader"
import Sidebar from "@/components/layout/Sidebar"
import KavachPanel from "@/components/hud/KavachPanel"
import VyuhaTelemetry from "@/components/hud/VyuhaTelemetry"
import CenterReticle from "@/components/hud/CenterReticle"
import BottomConsole from "@/components/hud/BottomConsole"
import YantraDashboard from "@/components/hud/YantraDashboard"
import FaceTargeting from "@/components/hud/FaceTargeting"

export default function DrishtiHUD() {
  const [activeView, setActiveView] = useState("TELEMETRY")
  const [overlayMetrics, setOverlayMetrics] = useState<VideoOverlayMetrics | null>(
    null,
  )

  // 1. Initialize Optics Feed (Auto-flips for S23 Back Camera vs HP WebCam)
  const { videoRef, error: cameraError, isMirrored } = useCameraStream()

  // 2. Initialize the Native Webpack AI Worker
  const { detections, faces, isReady } = useDrishtiWorker(videoRef)

  // 3. Tactical Systems & Background Logging
  const alert = useTacticalAlerts(detections, faces)
  useAutoLog(detections) // Silently logs targets > 85% confidence to local DB

  // 4. Bilingual Audio Intelligence
  const { isListening, transcript, aiResponse, startListening } =
    useVoiceAssistant(detections, faces)

  useEffect(() => {
    let animationFrameId: number | null = null

    const updateMetrics = () => {
      const nextMetrics = getVideoOverlayMetrics(videoRef.current)

      setOverlayMetrics((currentMetrics) => {
        if (
          currentMetrics &&
          nextMetrics &&
          currentMetrics.left === nextMetrics.left &&
          currentMetrics.top === nextMetrics.top &&
          currentMetrics.width === nextMetrics.width &&
          currentMetrics.height === nextMetrics.height &&
          currentMetrics.videoWidth === nextMetrics.videoWidth &&
          currentMetrics.videoHeight === nextMetrics.videoHeight
        ) {
          return currentMetrics
        }

        return nextMetrics
      })

      animationFrameId = window.requestAnimationFrame(updateMetrics)
    }

    updateMetrics()

    return () => {
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId)
      }
    }
  }, [videoRef])

  const isDashboardOpen = activeView === "YANTRA"

  return (
    <main className="relative w-screen h-screen bg-[#050508] text-white overflow-hidden font-mono select-none">
      {/* --- LAYER 0: OPTICS FEED --- */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
        style={{ filter: "brightness(0.85) contrast(1.15)" }} // Tactical lens effect
      />

      {/* CRITICAL SYSTEM FAILURE MODAL */}
      {cameraError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 text-[#FF9933] text-center p-4">
          <div className="border-2 border-[#FF9933] p-8 bg-[#FF9933]/5 shadow-[0_0_40px_rgba(255,153,51,0.4)]">
            <h2 className="text-2xl font-black mb-4 tracking-tighter">
              PRANA_LINK_FAILURE
            </h2>
            <p className="text-xs opacity-70 mb-6 max-w-xs">{cameraError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#FF9933] text-black font-bold text-xs uppercase hover:bg-white transition-all"
            >
              Reboot Drishti
            </button>
          </div>
        </div>
      )}

      {/* --- LAYER 1: ATMOSPHERIC FX --- */}
      {/* Red pulse vignette when tactical alert is active */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none transition-all duration-700 
        ${alert ? "bg-[radial-gradient(circle,transparent_40%,rgba(255,153,51,0.2)_100%)] border-[15px] border-[#FF9933]/10" : "bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.6)_100%)]"}`}
      />
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,153,51,0.01)_1px,transparent_1px)] bg-[size:100%_4px] mix-blend-overlay z-10" />

      {/* --- LAYER 2: NAVIGATION CHASSIS --- */}
      <TopHeader />
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* --- LAYER 3: DYNAMIC HUD OVERLAY --- */}
      <div
        className={`absolute inset-0 md:pl-20 pt-24 p-4 md:p-8 z-20 flex flex-col pointer-events-none transition-all duration-500 
        ${isDashboardOpen ? "opacity-10 scale-95 blur-sm" : "opacity-100 scale-100 blur-0"}`}
      >
        {/* Priority Alert Banner */}
        {alert && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-[#FF9933] text-black px-5 py-1.5 font-bold text-[10px] tracking-[0.4em] animate-pulse uppercase shadow-[0_0_25px_rgba(255,153,51,0.6)]">
            {alert}
          </div>
        )}

        {/* Telemetry & Target History */}
        <div className="flex flex-col md:flex-row justify-between w-full items-start gap-4">
          <KavachPanel detections={detections} />
          <VyuhaTelemetry
            isReady={isReady}
            objectCount={detections?.length || 0}
          />
        </div>

        {/* Central Spatial Compass */}
        <CenterReticle />

        {/* Interaction & Audio Dock */}
        <BottomConsole
          objectCount={detections?.length || 0}
          isListening={isListening}
          transcript={transcript}
          aiResponse={aiResponse}
          onMicClick={startListening}
        />
      </div>

      <div className="absolute inset-0 z-30 pointer-events-none">
        <FaceTargeting
          faces={faces}
          isMirrored={isMirrored}
          overlayMetrics={overlayMetrics}
        />

        {detections?.map((det: Detection, index: number) => {
          if (!overlayMetrics || !det.boundingBox || det.categories.length === 0) {
            return null
          }

          const projectedBox = projectPixelBoxToViewport(
            overlayMetrics,
            {
              x: det.boundingBox.originX,
              y: det.boundingBox.originY,
              width: det.boundingBox.width,
              height: det.boundingBox.height,
            },
            isMirrored,
          )

          if (!projectedBox) {
            return null
          }

          return (
            <div
              key={`obj-${index}`}
              className="absolute border-[1.5px] border-[#FF9933] bg-[#FF9933]/10 shadow-[0_0_15px_rgba(255,153,51,0.3)] transition-all duration-75"
              style={{
                top: projectedBox.top,
                left: projectedBox.left,
                width: projectedBox.width,
                height: projectedBox.height,
              }}
            >
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FF9933] -mt-[2px] -ml-[2px]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FF9933] -mb-[2px] -mr-[2px]" />

              <div className="absolute -top-5 left-0 bg-[#FF9933] text-black text-[9px] font-bold px-2 py-0.5 whitespace-nowrap uppercase tracking-tighter shadow-md">
                {det.categories[0].categoryName} [
                {Math.round(det.categories[0].score * 100)}%]
              </div>
            </div>
          )
        })}
      </div>

      {/* --- LAYER 4: SETTINGS DASHBOARD --- */}
      {isDashboardOpen && (
        <YantraDashboard onClose={() => setActiveView("TELEMETRY")} />
      )}
    </main>
  )
}
