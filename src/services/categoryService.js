// src/services/categoryService.js
import { indexedDBAPI } from '../api/indexedDBAPI';
import { Category } from '../models/Category';

/**
 * Service de gestion des catégories
 */
export const categoryService = {
  /**
   * Récupère toutes les catégories
   * @returns {Promise<Array>} Liste des catégories
   */
  getAllCategories: async () => {
    const categories = await indexedDBAPI.categories.getAll();
    return categories.map(c => Category.fromObject(c));
  },
  
  /**
   * Récupère une catégorie par son ID
   * @param {string} id - ID de la catégorie
   * @returns {Promise<Category|null>} La catégorie ou null
   */
  getCategoryById: async (id) => {
    const category = await indexedDBAPI.categories.getById(id);
    return category ? Category.fromObject(category) : null;
  },
  
  /**
   * Crée une nouvelle catégorie
   * @param {string} name - Nom de la catégorie
   * @param {string} color - Couleur en format hexadécimal
   * @returns {Promise<string>} ID de la catégorie créée
   */
  createCategory: async (name, color) => {
    const category = new Category(name, color);
    return indexedDBAPI.categories.save(category);
  },
  
  /**
   * Met à jour une catégorie existante
   * @param {string} id - ID de la catégorie
   * @param {string} name - Nouveau nom
   * @param {string} color - Nouvelle couleur
   * @returns {Promise<string>} ID de la catégorie mise à jour
   */
  updateCategory: async (id, name, color) => {
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      throw new Error('Catégorie non trouvée');
    }
    
    category.name = name;
    category.color = color;
    
    return indexedDBAPI.categories.save(category);
  },
  
  /**
   * Supprime une catégorie
   * @param {string} id - ID de la catégorie à supprimer
   * @returns {Promise<void>}
   */
  deleteCategory: async (id) => {
    await indexedDBAPI.categories.delete(id);
  }
};