// src/services/imageService.js
/**
 * Service de gestion des images
 */
export const imageService = {
  /**
   * Convertit un File ou Blob en Data URL base64
   * @param {File|Blob} file - Fichier image
   * @returns {Promise<string>} - Data URL base64
   */
  fileToDataUrl: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * Crée une image de prévisualisation à partir d'une Data URL
   * @param {string} dataUrl - Data URL base64
   * @returns {Promise<HTMLImageElement>} - Élément Image
   */
  createPreviewImage: async (dataUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = dataUrl;
    });
  },

  /**
   * Redimensionne une image pour réduire sa taille
   * @param {string} dataUrl - Data URL base64 de l'image
   * @param {number} maxWidth - Largeur maximale
   * @param {number} maxHeight - Hauteur maximale
   * @param {number} quality - Qualité de compression (0-1)
   * @returns {Promise<string>} - Data URL de l'image redimensionnée
   */
  resizeImage: async (dataUrl, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    const img = await imageService.createPreviewImage(dataUrl);
    
    // Calculer les dimensions
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      height = Math.round(height * (maxWidth / width));
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = Math.round(width * (maxHeight / height));
      height = maxHeight;
    }
    
    // Créer un canvas et redimensionner
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convertir en data URL avec compression
    return canvas.toDataURL('image/jpeg', quality);
  }
};