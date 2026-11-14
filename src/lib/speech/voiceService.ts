/**
 * StudyQuest AI — Voice Learning & Pluggable Speech Engine
 * Provides browser-based speech recognition and synthesis with fallback handling,
 * audio playback controls (pause/resume/rate/replay), and pluggable adapter interface
 * for future server-side real-time streaming voice services.
 */

export interface VoicePlaybackOptions {
  rate?: number; // 0.5 to 2.0
  pitch?: number; // 0.8 to 1.2
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export interface VoiceServiceProvider {
  name: string;
  isRecognitionSupported(): boolean;
  isSynthesisSupported(): boolean;
  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd?: () => void
  ): boolean;
  stopListening(): void;
  speak(text: string, options?: VoicePlaybackOptions): boolean;
  pauseSpeech(): void;
  resumeSpeech(): void;
  cancelSpeech(): void;
  isSpeaking(): boolean;
}

// Browser implementation using Web Speech API
class BrowserSpeechProvider implements VoiceServiceProvider {
  public name = "BrowserWebSpeech";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isListeningActive = false;

  constructor() {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          this.recognition = new SpeechRec();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = "en-US";
        } catch (e) {
          console.warn("SpeechRecognition init error:", e);
        }
      }
    }
  }

  isRecognitionSupported(): boolean {
    return Boolean(this.recognition);
  }

  isSynthesisSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      onError("Speech recognition is not supported on this browser/device. Please use text typing fallback.");
      return false;
    }

    if (this.isListeningActive) {
      this.stopListening();
    }

    try {
      this.isListeningActive = true;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onresult = (event: any) => {
        let transcript = "";
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        onResult(transcript, isFinal);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.recognition.onerror = (event: any) => {
        this.isListeningActive = false;
        onError(event.error ? `Speech recognition error: ${event.error}` : "Microphone input interrupted.");
      };

      this.recognition.onend = () => {
        this.isListeningActive = false;
        if (onEnd) onEnd();
      };

      this.recognition.start();
      return true;
    } catch (err: unknown) {
      this.isListeningActive = false;
      onError(`Failed to start speech input: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListeningActive) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn("SpeechRecognition stop error:", e);
      }
      this.isListeningActive = false;
    }
  }

  speak(text: string, options: VoicePlaybackOptions = {}): boolean {
    if (!this.isSynthesisSupported()) {
      if (options.onError) options.onError("Speech synthesis is not supported in this browser.");
      return false;
    }

    try {
      this.cancelSpeech();

      // Clean markdown tags, emojis, and symbols for natural voice narration
      const spokenText = text
        .replace(/[*_#`~>[\]]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\n{2,}/g, ". ")
        .replace(/\n/g, " ")
        .trim();

      if (!spokenText) return false;

      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.lang = options.lang ?? "en-US";

      if (options.onStart) utterance.onstart = () => options.onStart!();
      if (options.onEnd) utterance.onend = () => options.onEnd!();
      if (options.onError) utterance.onerror = (e) => options.onError!(e.error || "Speech error");

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err: unknown) {
      if (options.onError) {
        options.onError(`Speech output error: ${err instanceof Error ? err.message : String(err)}`);
      }
      return false;
    }
  }

  pauseSpeech(): void {
    if (this.isSynthesisSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  resumeSpeech(): void {
    if (this.isSynthesisSupported() && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  cancelSpeech(): void {
    if (this.isSynthesisSupported()) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  isSpeaking(): boolean {
    return this.isSynthesisSupported() && (window.speechSynthesis.speaking || window.speechSynthesis.pending);
  }
}

// Export singleton instance with pluggable replacement method
export const speechService: VoiceServiceProvider = new BrowserSpeechProvider();
