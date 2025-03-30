// src/hooks/useSpeech.js
import { useState, useCallback, useEffect } from 'react';
import { speechService } from '../services/speechService';

/**
 * Hook personnalisé pour utiliser la synthèse vocale
 * @returns {Object} Fonctions et état pour la synthèse vocale
 */
export const useSpeech = () => {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  
  // Récupérer les voix disponibles
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechService.getVoices().filter(
        voice => voice.lang.startsWith('fr')
      );
      setVoices(availableVoices);
    };
    
    // Récupérer les voix immédiatement si elles sont déjà chargées
    loadVoices();
    
    // Sinon attendre qu'elles soient chargées
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  // Fonction pour parler
  const speak = useCallback((text, options = {}) => {
    if (!text) return;
    
    // Options par défaut pour favoriser les voix françaises
    const defaultOptions = {
      lang: 'fr-FR',
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false)
    };
    
    // Si on a trouvé une voix française, on l'utilise
    if (voices.length > 0) {
      defaultOptions.voice = voices[0].name;
    }
    
    // Fusionner les options
    const finalOptions = { ...defaultOptions, ...options };
    
    // Lancer la synthèse vocale
    speechService.speak(text, finalOptions);
  }, [voices]);
  
  // Fonction pour arrêter de parler
  const stop = useCallback(() => {
    speechService.stop();
    setSpeaking(false);
  }, []);
  
  return {
    speak,
    stop,
    speaking,
    voices
  };
};