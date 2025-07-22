"use client"

import { useState, useEffect, useCallback } from "react"
import type SpeechRecognition from "speech-recognition"

interface VoiceSettings {
  enabled: boolean
  language: string
  autoStart: boolean
  continuous: boolean
}

export function useVoice() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: false,
    language: "en-US",
    autoStart: false,
    continuous: false,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        setIsSupported(true)
        const recognitionInstance = new SpeechRecognition()
        recognitionInstance.continuous = settings.continuous
        recognitionInstance.interimResults = true
        recognitionInstance.lang = settings.language

        recognitionInstance.onstart = () => {
          setIsListening(true)
        }

        recognitionInstance.onend = () => {
          setIsListening(false)
        }

        recognitionInstance.onresult = (event) => {
          let finalTranscript = ""
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            }
          }
          if (finalTranscript) {
            setTranscript(finalTranscript)
          }
        }

        recognitionInstance.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        setRecognition(recognitionInstance)
      }
    }
  }, [settings.continuous, settings.language])

  const startListening = useCallback(() => {
    if (recognition && settings.enabled) {
      recognition.start()
    }
  }, [recognition, settings.enabled])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
    }
  }, [recognition])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const updateSettings = (newSettings: Partial<VoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = settings.language
      speechSynthesis.speak(utterance)
    }
  }

  return {
    isListening,
    transcript,
    isSupported,
    settings,
    startListening,
    stopListening,
    toggleListening,
    updateSettings,
    speak,
    clearTranscript: () => setTranscript(""),
  }
}
