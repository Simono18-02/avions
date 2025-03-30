// src/utils/jsonUtils.js
/**
 * Utilitaire pour l'export/import des données en JSON
 */
export const jsonUtils = {
  /**
   * Exporte les données en JSON
   * @param {Object} data - Données à exporter
   * @returns {string} - Chaîne JSON
   */
  exportToJson: (data) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Erreur lors de l\'export en JSON:', error);
      throw new Error('Impossible d\'exporter les données en JSON');
    }
  },
  
  /**
   * Crée un fichier de téléchargement pour les données JSON
   * @param {Object} data - Données à exporter
   * @param {string} filename - Nom du fichier sans extension
   */
  downloadJson: (data, filename = 'avioncards-export') => {
    try {
      const jsonString = jsonUtils.exportToJson(data);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}-${new Date().toISOString().substring(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement JSON:', error);
      throw new Error('Impossible de créer le fichier d\'export');
    }
  },
  
  /**
   * Importe des données à partir d'une chaîne JSON
   * @param {string} jsonString - Chaîne JSON
   * @returns {Object} - Données importées
   */
  importFromJson: (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Erreur lors de l\'import JSON:', error);
      throw new Error('Format de fichier JSON invalide');
    }
  },
  
  /**
   * Lit un fichier JSON et retourne son contenu
   * @param {File} file - Fichier JSON
   * @returns {Promise<Object>} - Données importées
   */
  readJsonFile: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const jsonData = jsonUtils.importFromJson(event.target.result);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      
      reader.readAsText(file);
    });
  }
};