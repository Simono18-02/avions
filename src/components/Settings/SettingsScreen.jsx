// src/components/Settings/SettingsScreen.jsx
import { useState } from 'react';
import ImportExport from './ImportExport';
import About from './About';
import { indexedDBAPI } from '../../api/indexedDBAPI';

/**
 * Écran des paramètres de l'application
 */
const SettingsScreen = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetData = async () => {
    setIsResetting(true);
    setResetError(null);
    
    try {
      await indexedDBAPI.clearAllData();
      setResetSuccess(true);
      setIsResetModalOpen(false);
      
      // Recharger la page après un court délai
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des données:', error);
      setResetError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="settings-screen">
      <h1>Paramètres</h1>

      <div className="settings-section">
        <ImportExport />
      </div>

      <div className="settings-section">
        <h2>Réinitialisation des données</h2>
        <p>
          Cette action supprimera toutes vos flashcards et catégories. Cette opération est irréversible.
        </p>
        <button 
          onClick={() => setIsResetModalOpen(true)}
          className="btn-danger"
        >
          Réinitialiser toutes les données
        </button>
        
        {resetSuccess && (
          <p className="success-text">
            Toutes les données ont été réinitialisées avec succès. La page va se recharger...
          </p>
        )}
      </div>

      <div className="settings-section">
        <About />
      </div>

      {/* Modal de confirmation de réinitialisation */}
      {isResetModalOpen && (
        <div className="modal-overlay">
          <div className="modal danger-modal">
            <div className="modal-header">
              <h2>Réinitialiser toutes les données ?</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setIsResetModalOpen(false)}
                disabled={isResetting}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <p>
                <strong>Attention :</strong> Cette action va supprimer définitivement toutes vos flashcards 
                et catégories. Cette opération ne peut pas être annulée.
              </p>
              
              <p>
                Êtes-vous absolument sûr de vouloir réinitialiser toutes les données ?
              </p>

              {resetError && (
                <p className="error-text">{resetError}</p>
              )}
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setIsResetModalOpen(false)}
                className="btn-outline"
                disabled={isResetting}
              >
                Annuler
              </button>
              <button 
                onClick={handleResetData}
                className="btn-danger"
                disabled={isResetting}
              >
                {isResetting ? 'Réinitialisation...' : 'Réinitialiser'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen;