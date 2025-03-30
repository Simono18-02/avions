// src/components/Home/RandomFlashcardModal.jsx
import FlippableCard from '../common/FlippableCard';
import Loading from '../common/Loading';

/**
 * Modal affichant une flashcard aléatoire
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.flashcard - Flashcard à afficher
 * @param {Array} props.categories - Liste des catégories
 * @param {boolean} props.loading - État de chargement
 * @param {Function} props.onClose - Fonction de fermeture
 * @param {Function} props.onEdit - Fonction d'édition
 * @param {Function} props.onNext - Fonction pour passer à la suivante
 */
const RandomFlashcardModal = ({ 
  flashcard, 
  categories, 
  loading, 
  onClose, 
  onEdit,
  onNext
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Flashcard Aléatoire</h2>
          <button 
            className="modal-close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="modal-content">
          {loading ? (
            <Loading />
          ) : flashcard ? (
            <FlippableCard 
              flashcard={flashcard}
              categories={categories}
              onEdit={(id) => {
                onClose();
                onEdit(id);
              }}
              onDelete={() => {}}
            />
          ) : (
            <div className="empty-state">
              <p>Aucune flashcard disponible.</p>
              <p>Commencez par en créer une !</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button 
            onClick={onClose}
            className="btn-outline"
          >
            Fermer
          </button>
          {flashcard && (
            <button 
              onClick={onNext}
              className="btn-secondary"
            >
              Autre aléatoire
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RandomFlashcardModal;