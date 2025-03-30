// src/services/flashcardService.js
import { indexedDBAPI } from '../api/indexedDBAPI';
import { Flashcard } from '../models/Flashcard';
import { imageService } from './imageService';

/**
 * Service de gestion des flashcards
 */
export const flashcardService = {
  /**
   * Récupère toutes les flashcards
   * @returns {Promise<Array>} Liste des flashcards
   */
  getAllFlashcards: async () => {
    const flashcards = await indexedDBAPI.flashcards.getAll();
    return flashcards.map(f => Flashcard.fromObject(f));
  },
  
  /**
   * Récupère une flashcard par son ID
   * @param {string} id - ID de la flashcard
   * @returns {Promise<Flashcard|null>} La flashcard ou null
   */
  getFlashcardById: async (id) => {
    const flashcard = await indexedDBAPI.flashcards.getById(id);
    return flashcard ? Flashcard.fromObject(flashcard) : null;
  },
  
  /**
   * Récupère les flashcards par catégorie
   * @param {string} categoryId - ID de la catégorie
   * @returns {Promise<Array>} Liste des flashcards
   */
  getFlashcardsByCategory: async (categoryId) => {
    const flashcards = await indexedDBAPI.flashcards.getByCategoryId(categoryId);
    return flashcards.map(f => Flashcard.fromObject(f));
  },
  
  /**
   * Crée une nouvelle flashcard
   * @param {string} name - Nom de l'avion
   * @param {File|Blob} imageFile - Fichier image
   * @param {Array} categoryIds - Liste des IDs de catégories
   * @returns {Promise<string>} ID de la flashcard créée
   */
  createFlashcard: async (name, imageFile, categoryIds) => {
    // Convertir l'image en Data URL
    const dataUrl = await imageService.fileToDataUrl(imageFile);
    
    // Redimensionner l'image pour économiser de l'espace
    const resizedDataUrl = await imageService.resizeImage(dataUrl);
    
    // Créer un ID unique pour l'image
    const imageId = `img_${Date.now()}`;
    
    // Sauvegarder l'image
    await indexedDBAPI.images.save(imageId, resizedDataUrl);
    
    // Créer la flashcard
    const flashcard = new Flashcard(name, imageId, categoryIds);
    
    // Sauvegarder la flashcard
    return indexedDBAPI.flashcards.save(flashcard);
  },
  
  /**
   * Met à jour une flashcard existante
   * @param {string} id - ID de la flashcard
   * @param {string} name - Nom de l'avion
   * @param {File|Blob|null} imageFile - Fichier image (null si inchangé)
   * @param {Array} categoryIds - Liste des IDs de catégories
   * @returns {Promise<string>} ID de la flashcard mise à jour
   */
  updateFlashcard: async (id, name, imageFile, categoryIds) => {
    // Récupérer la flashcard existante
    const existingFlashcard = await flashcardService.getFlashcardById(id);
    if (!existingFlashcard) {
      throw new Error('Flashcard non trouvée');
    }
    
    let imageId = existingFlashcard.imagePath;
    
    // Si une nouvelle image est fournie, la traiter
    if (imageFile) {
      // Supprimer l'ancienne image si elle existe
      if (existingFlashcard.imagePath) {
        await indexedDBAPI.images.delete(existingFlashcard.imagePath);
      }
      
      // Convertir la nouvelle image en Data URL
      const dataUrl = await imageService.fileToDataUrl(imageFile);
      
      // Redimensionner l'image
      const resizedDataUrl = await imageService.resizeImage(dataUrl);
      
      // Créer un ID unique pour la nouvelle image
      imageId = `img_${Date.now()}`;
      
      // Sauvegarder la nouvelle image
      await indexedDBAPI.images.save(imageId, resizedDataUrl);
    }
    
    // Mettre à jour la flashcard
    existingFlashcard.update(name, imageId, categoryIds);
    
    // Sauvegarder la flashcard mise à jour
    return indexedDBAPI.flashcards.save(existingFlashcard);
  },
  
  /**
   * Supprime une flashcard et son image associée
   * @param {string} id - ID de la flashcard à supprimer
   * @returns {Promise<void>}
   */
  deleteFlashcard: async (id) => {
    // Récupérer la flashcard
    const flashcard = await flashcardService.getFlashcardById(id);
    if (!flashcard) return;
    
    // Supprimer l'image associée
    if (flashcard.imagePath) {
      await indexedDBAPI.images.delete(flashcard.imagePath);
    }
    
    // Supprimer la flashcard
    await indexedDBAPI.flashcards.delete(id);
  },
  
  /**
   * Récupère une flashcard aléatoire
   * @returns {Promise<Flashcard|null>} Une flashcard aléatoire ou null
   */
  getRandomFlashcard: async () => {
    const flashcard = await indexedDBAPI.flashcards.getRandom();
    return flashcard ? Flashcard.fromObject(flashcard) : null;
  },
  
  /**
   * Récupère l'URL de l'image d'une flashcard
   * @param {string} imageId - ID de l'image
   * @returns {Promise<string|null>} URL de l'image ou null
   */
  getFlashcardImageUrl: async (imageId) => {
    return indexedDBAPI.images.getById(imageId);
  }
};