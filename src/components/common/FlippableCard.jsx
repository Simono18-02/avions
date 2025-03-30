// src/components/common/FlippableCard.jsx
import { useState } from 'react';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSpeech } from '../../hooks/useSpeech';

/**
 * Carte à retourner pour les flashcards
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.flashcard - Flashcard à afficher
 * @param {Array} props.categories - Liste des catégories
 * @param {Function} props.onEdit - Fonction d'édition
 * @param {Function} props.onDelete - Fonction de suppression
 */
const FlippableCard = ({ flashcard, categories, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { getFlashcardImageUrl } = useFlashcards();
  const { speak, speaking } = useSpeech();

  // Charger l'image de la flashcard
  useState(() => {
    const loadImage = async () => {
      const url = await getFlashcardImageUrl(flashcard.imagePath);
      setImageUrl(url);
    };
    
    loadImage();
  }, [flashcard.imagePath, getFlashcardImageUrl]);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeakClick = (e) => {
    e.stopPropagation();
    speak(flashcard.name);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(flashcard.id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(flashcard.id);
  };

  // Trouver les catégories associées à cette flashcard
  const flashcardCategories = categories.filter(cat => 
    flashcard.categoryIds.includes(cat.id)
  );

  return (
    <div className="flippable-card-container">
      <div 
        className={`flippable-card ${isFlipped ? 'flipped' : ''}`} 
        onClick={handleCardClick}
      >
        {/* Face avant */}
        <div className="card-face card-front">
          <h3>{flashcard.name}</h3>
          
          <div className="card-categories">
            {flashcardCategories.map(category => (
              <CategoryChip 
                key={category.id} 
                category={category} 
                selected={true}
                onClick={() => {}}
              />
            ))}
          </div>
          
          <div className="card-actions">
            <button 
              onClick={handleSpeakClick}
              className="btn-icon"
              disabled={speaking}
              title="Prononcer"
            >
              🔊
            </button>
            <button 
              onClick={handleEditClick}
              className="btn-icon"
              title="Modifier"
            >
              ✏️
            </button>
            <button 
              onClick={handleDeleteClick}
              className="btn-icon"
              title="Supprimer"
            >
              🗑️
            </button>
          </div>
        </div>
        
        {/* Face arrière */}
        <div className="card-face card-back">
          {imageUrl ? (
            <img src={imageUrl} alt={flashcard.name} />
          ) : (
            <p>Chargement de l'image...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlippableCard;