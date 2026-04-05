"use client"

import { useState, useEffect, useCallback } from "react"

// Fallback for browser implementations
const SpeechRecognition =
  typeof window !== "undefined" &&
  ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)

export function useVoiceAssistant(detections: any[], faces: any) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("DRISHTI SYSTEMS ONLINE")

  // --- TEXT TO SPEECH (AI TALKING) ---
  const speak = useCallback((text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)

      const voices = window.speechSynthesis.getVoices()
      // Try to find an Indian English or Malayalam voice
      const preferredVoice =
        voices.find((v) => v.lang === "ml-IN" || v.lang === "en-IN") ||
        voices[0]
      if (preferredVoice) utterance.voice = preferredVoice

      utterance.pitch = 0.85 // Deep, tactical tone
      utterance.rate = 1.05

      setAiResponse(text.toUpperCase())
      window.speechSynthesis.speak(utterance)
    }
  }, [])

  // --- SPEECH TO TEXT (USER TALKING) ---
  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      setAiResponse("ERROR: AUDIO HARDWARE NOT FOUND")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "ml-IN" // Set to Malayalam (India) to pick up regional words

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript("")
      setAiResponse("LISTENING...")
    }

    recognition.onresult = (event: any) => {
      const current = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("")
      setTranscript(current)
    }

    recognition.onerror = () => {
      setIsListening(false)
      setAiResponse("INTERFACE DISRUPTED")
    }

    recognition.onend = () => setIsListening(false)

    try {
      recognition.start()
    } catch (e) {
      console.warn("Recognition active")
    }
  }, [])

  // --- COMMAND PROCESSOR (ENGLISH & MALAYALAM) ---
  useEffect(() => {
    if (!isListening && transcript.length > 0) {
      const command = transcript.toLowerCase()
      const faceCount = faces?.faceLandmarks?.length || 0
      const objCount = detections?.length || 0

      // 1. Tactical Status Command
      if (
        command.includes("എന്തൊക്കെ ഉണ്ട്") ||
        command.includes("update") ||
        command.includes("status")
      ) {
        const summary =
          objCount > 0
            ? `ഇപ്പോൾ ${objCount} ഒബ്‌ജെക്റ്റുകൾ കാണുന്നുണ്ട്.`
            : "Visual field clear. No active targets detected."
        speak(summary)
      }
      // 2. Biometric Command
      else if (
        command.includes("ആരാണ്") ||
        command.includes("who") ||
        command.includes("face")
      ) {
        speak(
          faceCount > 0
            ? "ഒരു മുഖം തിരിച്ചറിഞ്ഞിട്ടുണ്ട്."
            : "ആരെയും കാണുന്നില്ല. (No faces detected.)",
        )
      }
      // 3. Greeting
      else if (
        command.includes("hello") ||
        command.includes("drishti") ||
        command.includes("നമസ്കാരം")
      ) {
        speak(
          "Drishti HUD online. All protocols green. Awaiting command, Operator.",
        )
      } else {
        speak("Command ignored. Awaiting valid tactical query.")
      }

      // Clear transcript after processing
      setTimeout(() => setTranscript(""), 2000)
    }
  }, [isListening, transcript, detections, faces, speak])

  return { isListening, transcript, aiResponse, startListening }
}
