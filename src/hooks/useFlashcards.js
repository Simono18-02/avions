// src/hooks/useFlashcards.js
import { useContext } from 'react';
import { FlashcardContext } from '../context/FlashcardContext';

/**
 * Hook personnalisé pour accéder au contexte des flashcards
 * @returns {Object} Accès au contexte des flashcards
 */
export const useFlashcards = () => {
  const context = useContext(FlashcardContext);
  
  if (!context) {
    throw new Error('useFlashcards doit être utilisé à l\'intérieur d\'un FlashcardProvider');
  }
  
  return context;
};