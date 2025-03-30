// src/components/Settings/ImportExport.jsx
import { useState, useRef } from 'react';
import { indexedDBAPI } from '../../api/indexedDBAPI';
import { jsonUtils } from '../../utils/jsonUtils';

/**
 * Composant de gestion de l'import/export des données
 */
const ImportExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Fonction pour exporter les données
  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    setExportSuccess(false);
    
    try {
      // Récupérer toutes les données
      const data = await indexedDBAPI.exportAllData();
      
      // Télécharger le fichier JSON
      jsonUtils.downloadJson(data, 'avioncards-export');
      
      setExportSuccess(true);
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Erreur lors de l\'export des données:', error);
      setError('Une erreur est survenue lors de l\'export des données. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  // Fonction pour déclencher la sélection de fichier
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // Fonction pour gérer l'import des données
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsImporting(true);
    setError(null);
    setImportSuccess(false);
    
    try {
      // Lire et analyser le fichier JSON
      const data = await jsonUtils.readJsonFile(file);
      
      // Vérifier la structure des données
      if (!data || !data.flashcards || !data.categories) {
        throw new Error('Format de fichier invalide');
      }
      
      // Importer les données
      await indexedDBAPI.importAllData(data);
      
      setImportSuccess(true);
      
      // Réinitialiser le message de succès après 3 secondes
      setTimeout(() => {
        setImportSuccess(false);
      }, 3000);
      
      // Recharger la page après un court délai
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de l\'import des données:', error);
      setError('Une erreur est survenue lors de l\'import des données. Veuillez vérifier le format du fichier.');
    } finally {
      setIsImporting(false);
      // Réinitialiser l'input file
      e.target.value = null;
    }
  };

  return (
    <div className="import-export-section">
      <h2>Import / Export des données</h2>
      
      <p>
        Exportez vos données pour les sauvegarder ou les importer dans une autre installation.
      </p>
      
      {error && (
        <p className="error-text">{error}</p>
      )}
      
      {exportSuccess && (
        <p className="success-text">
          Export réussi ! Le fichier a été téléchargé.
        </p>
      )}
      
      {importSuccess && (
        <p className="success-text">
          Import réussi ! La page va se recharger...
        </p>
      )}
      
      <div className="buttons-group">
        <button
          onClick={handleExport}
          disabled={isExporting || isImporting}
          className="btn-primary"
        >
          {isExporting ? 'Exportation...' : 'Exporter les données'}
        </button>
        
        <button
          onClick={handleImportClick}
          disabled={isExporting || isImporting}
          className="btn-secondary"
        >
          {isImporting ? 'Importation...' : 'Importer des données'}
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default ImportExport;