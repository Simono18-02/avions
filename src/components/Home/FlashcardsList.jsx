// src/components/Home/FlashcardsList.jsx
import { useState } from 'react';
import FlippableCard from '../common/FlippableCard';
import { useFlashcards } from '../../hooks/useFlashcards';

/**
 * Liste des flashcards avec confirmation de suppression
 * @param {Object} props - Propriétés du composant
 * @param {Array} props.flashcards - Liste des flashcards à afficher
 * @param {Array} props.categories - Liste des catégories
 * @param {Function} props.onEdit - Fonction d'édition
 */
const FlashcardsList = ({ flashcards, categories, onEdit }) => {
  const { deleteFlashcard } = useFlashcards();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    
    try {
      await deleteFlashcard(deletingId);
      setDeletingId(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  if (flashcards.length === 0) {
    return (
      <div className="empty-state">
        <p>Aucune flashcard disponible.</p>
        <p>Commencez par en créer une en appuyant sur le bouton "Nouvelle Flashcard" !</p>
      </div>
    );
  }

  return (
    <div className="flashcards-list">
      {flashcards.map(flashcard => (
        <FlippableCard 
          key={flashcard.id}
          flashcard={flashcard}
          categories={categories}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ))}

      {/* Modal de confirmation de suppression */}
      {deletingId && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer cette flashcard ?</p>
            <p>Cette action est irréversible.</p>
            <div className="delete-modal-actions">
              <button 
                onClick={cancelDelete}
                className="btn-outline"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                className="btn-danger"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsList;