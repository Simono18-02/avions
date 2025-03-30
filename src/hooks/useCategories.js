// src/hooks/useCategories.js
import { useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';

/**
 * Hook personnalisé pour accéder au contexte des catégories
 * @returns {Object} Accès au contexte des catégories
 */
export const useCategories = () => {
  const context = useContext(CategoryContext);
  
  if (!context) {
    throw new Error('useCategories doit être utilisé à l\'intérieur d\'un CategoryProvider');
  }
  
  return context;
};
