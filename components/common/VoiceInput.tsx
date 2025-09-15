import React, { useState, useEffect, useRef } from 'react';
import { Icon } from './Icon';
import { useLocalization } from '../../contexts/LocalizationContext';

interface VoiceInputProps {
  onTranscriptChange: (transcript: string) => void;
  currentValue: string;
  disabled?: boolean;
}

// Extend window to include SpeechRecognition for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscriptChange, currentValue, disabled }) => {
  const { t } = useLocalization();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const baseTranscriptRef = useRef('');

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let interim_transcript = '';
      let final_transcript = '';

      // Go through all results from the beginning of this recognition session
      for (let i = 0; i < event.results.length; ++i) {
        // If this is the final part of the transcript, append it.
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          // Otherwise, it's interim. We only care about the last one.
          interim_transcript = event.results[i][0].transcript;
        }
      }

      // Update the input with the base text (from before recognition) plus the new transcript
      onTranscriptChange(baseTranscriptRef.current + final_transcript + interim_transcript);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscriptChange]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Store the current text when starting a new session.
      // Add a space if there's already text.
      baseTranscriptRef.current = currentValue.trim() ? currentValue.trim() + ' ' : '';
      recognitionRef.current.start();
    }
  };
  
  // Don't render if not supported
  if (!SpeechRecognition) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-700 focus-visible:ring-indigo-500 ${isListening ? 'text-red-400 bg-red-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isListening ? t('voice.stop') : t('voice.start')}
    >
      <Icon name="microphone" className="w-5 h-5" />
    </button>
  );
};

export default VoiceInput;
