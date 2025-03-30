// src/services/speechService.js
/**
 * Service pour la synthèse vocale
 */
export const speechService = {
  speak: (text, options = {}) => {
    // Vérifier si la synthèse vocale est supportée
    if (!('speechSynthesis' in window)) {
      console.error('La synthèse vocale n\'est pas supportée par ce navigateur.');
      return false;
    }
    
    // Arrêter toute synthèse vocale en cours
    window.speechSynthesis.cancel();
    
    // Créer un nouvel énoncé
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Options par défaut
    utterance.lang = options.lang || 'fr-FR';
    utterance.volume = options.volume || 1; // 0 à 1
    utterance.rate = options.rate || 1; // 0.1 à 10
    utterance.pitch = options.pitch || 1; // 0 à 2
    
    // Ajouter des gestionnaires d'événements si fournis
    if (options.onStart) utterance.onstart = options.onStart;
    if (options.onEnd) utterance.onend = options.onEnd;
    if (options.onError) utterance.onerror = options.onError;
    if (options.onPause) utterance.onpause = options.onPause;
    if (options.onResume) utterance.onresume = options.onResume;
    
    // Si une voix spécifique est demandée et disponible
    if (options.voice) {
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.name === options.voice || voice.lang === options.voice
      );
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    
    // Démarrer la synthèse vocale
    window.speechSynthesis.speak(utterance);
    
    return true;
  },
  
  stop: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      return true;
    }
    return false;
  },
  
  getVoices: () => {
    if (!('speechSynthesis' in window)) {
      return [];
    }
    return window.speechSynthesis.getVoices();
  }
};