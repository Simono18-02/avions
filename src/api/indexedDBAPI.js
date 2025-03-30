// src/api/indexedDBAPI.js
import { openDB } from 'idb';

const DB_NAME = 'avioncards-db';
const DB_VERSION = 1;

const FLASHCARDS_STORE = 'flashcards';
const CATEGORIES_STORE = 'categories';
const IMAGES_STORE = 'images';

/**
 * Initialise et retourne une instance de la base de données IndexedDB
 * @returns {Promise<IDBDatabase>} Instance de la base de données
 */
async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Créer les object stores si ils n'existent pas déjà
      if (!db.objectStoreNames.contains(FLASHCARDS_STORE)) {
        const flashcardsStore = db.createObjectStore(FLASHCARDS_STORE, { keyPath: 'id' });
        flashcardsStore.createIndex('createdAt', 'createdAt', { unique: false });
        flashcardsStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        flashcardsStore.createIndex('categoryIds', 'categoryIds', { unique: false, multiEntry: true });
      }
      
      if (!db.objectStoreNames.contains(CATEGORIES_STORE)) {
        db.createObjectStore(CATEGORIES_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(IMAGES_STORE)) {
        db.createObjectStore(IMAGES_STORE, { keyPath: 'id' });
      }
    }
  });
}

/**
 * API pour interagir avec IndexedDB
 */
export const indexedDBAPI = {
  // Méthodes pour les flashcards
  flashcards: {
    /**
     * Récupère toutes les flashcards
     * @returns {Promise<Array>} Liste des flashcards
     */
    getAll: async () => {
      const db = await initDB();
      return db.getAll(FLASHCARDS_STORE);
    },
    
    /**
     * Récupère une flashcard par son ID
     * @param {string} id - ID de la flashcard
     * @returns {Promise<Object|undefined>} La flashcard trouvée ou undefined
     */
    getById: async (id) => {
      const db = await initDB();
      return db.get(FLASHCARDS_STORE, id);
    },
    
    /**
     * Récupère les flashcards par catégorie
     * @param {string} categoryId - ID de la catégorie
     * @returns {Promise<Array>} Liste des flashcards dans cette catégorie
     */
    getByCategoryId: async (categoryId) => {
      const db = await initDB();
      const index = db.transaction(FLASHCARDS_STORE).store.index('categoryIds');
      return index.getAll(categoryId);
    },
    
    /**
     * Ajoute ou met à jour une flashcard
     * @param {Object} flashcard - La flashcard à sauvegarder
     * @returns {Promise<string>} L'ID de la flashcard
     */
    save: async (flashcard) => {
      const db = await initDB();
      await db.put(FLASHCARDS_STORE, flashcard);
      return flashcard.id;
    },
    
    /**
     * Supprime une flashcard
     * @param {string} id - ID de la flashcard à supprimer
     * @returns {Promise<void>}
     */
    delete: async (id) => {
      const db = await initDB();
      await db.delete(FLASHCARDS_STORE, id);
    },
    
    /**
     * Récupère une flashcard aléatoire
     * @returns {Promise<Object|undefined>} Une flashcard aléatoire ou undefined
     */
    getRandom: async () => {
      const db = await initDB();
      const allFlashcards = await db.getAll(FLASHCARDS_STORE);
      if (allFlashcards.length === 0) return undefined;
      
      const randomIndex = Math.floor(Math.random() * allFlashcards.length);
      return allFlashcards[randomIndex];
    }
  },
  
  // Méthodes pour les catégories
  categories: {
    /**
     * Récupère toutes les catégories
     * @returns {Promise<Array>} Liste des catégories
     */
    getAll: async () => {
      const db = await initDB();
      return db.getAll(CATEGORIES_STORE);
    },
    
    /**
     * Récupère une catégorie par son ID
     * @param {string} id - ID de la catégorie
     * @returns {Promise<Object|undefined>} La catégorie trouvée ou undefined
     */
    getById: async (id) => {
      const db = await initDB();
      return db.get(CATEGORIES_STORE, id);
    },
    
    /**
     * Ajoute ou met à jour une catégorie
     * @param {Object} category - La catégorie à sauvegarder
     * @returns {Promise<string>} L'ID de la catégorie
     */
    save: async (category) => {
      const db = await initDB();
      await db.put(CATEGORIES_STORE, category);
      return category.id;
    },
    
    /**
     * Supprime une catégorie
     * @param {string} id - ID de la catégorie à supprimer
     * @returns {Promise<void>}
     */
    delete: async (id) => {
      const db = await initDB();
      
      // Supprimer la catégorie des flashcards qui l'utilisent
      const tx = db.transaction([FLASHCARDS_STORE, CATEGORIES_STORE], 'readwrite');
      const flashcardsStore = tx.objectStore(FLASHCARDS_STORE);
      
      // Récupérer les flashcards qui contiennent cette catégorie
      const index = flashcardsStore.index('categoryIds');
      const flashcardsWithCategory = await index.getAll(id);
      
      // Mettre à jour chaque flashcard pour retirer cette catégorie
      const updatePromises = flashcardsWithCategory.map(flashcard => {
        flashcard.categoryIds = flashcard.categoryIds.filter(catId => catId !== id);
        flashcard.updatedAt = new Date().toISOString();
        return flashcardsStore.put(flashcard);
      });
      
      // Supprimer la catégorie
      await Promise.all([...updatePromises, tx.objectStore(CATEGORIES_STORE).delete(id)]);
      await tx.done;
    }
  },
  
  // Méthodes pour les images
  images: {
    /**
     * Enregistre une image
     * @param {string} id - ID unique pour l'image
     * @param {string} dataUrl - Data URL de l'image
     * @returns {Promise<string>} L'ID de l'image
     */
    save: async (id, dataUrl) => {
      const db = await initDB();
      await db.put(IMAGES_STORE, { id, dataUrl });
      return id;
    },
    
    /**
     * Récupère une image par son ID
     * @param {string} id - ID de l'image
     * @returns {Promise<string|null>} Data URL de l'image ou null
     */
    getById: async (id) => {
      const db = await initDB();
      const result = await db.get(IMAGES_STORE, id);
      return result ? result.dataUrl : null;
    },
    
    /**
     * Supprime une image
     * @param {string} id - ID de l'image à supprimer
     * @returns {Promise<void>}
     */
    delete: async (id) => {
      const db = await initDB();
      await db.delete(IMAGES_STORE, id);
    }
  },
  
  // Méthodes générales
  /**
   * Exporte toutes les données
   * @returns {Promise<Object>} Toutes les données
   */
  exportAllData: async () => {
    const db = await initDB();
    
    const [flashcards, categories, images] = await Promise.all([
      db.getAll(FLASHCARDS_STORE),
      db.getAll(CATEGORIES_STORE),
      db.getAll(IMAGES_STORE)
    ]);
    
    return {
      flashcards,
      categories,
      images,
      exportDate: new Date().toISOString()
    };
  },
  
  /**
   * Importe toutes les données
   * @param {Object} data - Données à importer
   * @returns {Promise<void>}
   */
  importAllData: async (data) => {
    if (!data || !data.flashcards || !data.categories) {
      throw new Error('Format de données invalide pour l\'import');
    }
    
    const db = await initDB();
    const tx = db.transaction([FLASHCARDS_STORE, CATEGORIES_STORE, IMAGES_STORE], 'readwrite');
    
    // Effacer les données existantes
    await Promise.all([
      tx.objectStore(FLASHCARDS_STORE).clear(),
      tx.objectStore(CATEGORIES_STORE).clear(),
      tx.objectStore(IMAGES_STORE).clear()
    ]);
    
    // Importer les nouvelles données
    const promises = [
      ...data.flashcards.map(f => tx.objectStore(FLASHCARDS_STORE).put(f)),
      ...data.categories.map(c => tx.objectStore(CATEGORIES_STORE).put(c))
    ];
    
    // Importer les images si présentes
    if (data.images) {
      promises.push(...data.images.map(img => tx.objectStore(IMAGES_STORE).put(img)));
    }
    
    await Promise.all(promises);
    await tx.done;
  },
  
  /**
   * Efface toutes les données
   * @returns {Promise<void>}
   */
  clearAllData: async () => {
    const db = await initDB();
    const tx = db.transaction([FLASHCARDS_STORE, CATEGORIES_STORE, IMAGES_STORE], 'readwrite');
    
    await Promise.all([
      tx.objectStore(FLASHCARDS_STORE).clear(),
      tx.objectStore(CATEGORIES_STORE).clear(),
      tx.objectStore(IMAGES_STORE).clear()
    ]);
    
    await tx.done;
  }
};
