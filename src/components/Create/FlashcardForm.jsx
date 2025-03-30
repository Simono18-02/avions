// src/components/Create/FlashcardForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useCategories } from '../../hooks/useCategories';
import ImagePicker from '../common/ImagePicker';
import CategoryChip from '../common/CategoryChip';
import Loading from '../common/Loading';

/**
 * Formulaire de création/édition de flashcard
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.initialFlashcard - Flashcard existante en mode édition
 * @param {string} props.initialImageUrl - URL de l'image existante
 * @param {Function} props.onBack - Fonction pour revenir en arrière
 */
const FlashcardForm = ({ initialFlashcard = null, initialImageUrl = null, onBack }) => {
  const navigate = useNavigate();
  const { addFlashcard, updateFlashcard, loading, error } = useFlashcards();
  const { categories } = useCategories();
  
  // État du formulaire
  const [name, setName] = useState(initialFlashcard?.name || '');
  const [imageFile, setImageFile] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(initialFlashcard?.categoryIds || []);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setFormError('Le nom de l\'avion est requis');
      return;
    }
    
    if (!imageFile && !initialFlashcard) {
      setFormError('Une image est requise');
      return;
    }
    
    setFormError('');
    setIsSubmitting(true);
    
    try {
      if (initialFlashcard) {
        // Mode édition
        await updateFlashcard(
          initialFlashcard.id,
          name.trim(),
          imageFile, // null si pas de nouvelle image
          selectedCategoryIds
        );
      } else {
        // Mode création
        await addFlashcard(
          name.trim(),
          imageFile,
          selectedCategoryIds
        );
      }
      
      // Redirection vers la page d'accueil
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setFormError('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion des catégories
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategoryIds(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Gestion de l'image
  const handleImageSelected = (file) => {
    setImageFile(file);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form onSubmit={handleSubmit} className="flashcard-form">
      {(error || formError) && (
        <div className="error-message">
          {error || formError}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="name">Nom de l'avion</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Rafale, Mirage 2000, A380..."
          required
        />
      </div>
      
      <div className="form-group">
        <label>Image de l'avion</label>
        <ImagePicker
          initialImageUrl={initialImageUrl}
          onImageSelected={handleImageSelected}
        />
      </div>
      
      <div className="form-group">
        <label>Catégories</label>
        <div className="categories-selection">
          {categories.length === 0 ? (
            <p className="info-text">
              Aucune catégorie disponible. Créez-en dans la section "Catégories".
            </p>
          ) : (
            categories.map(category => (
              <CategoryChip
                key={category.id}
                category={category}
                selected={selectedCategoryIds.includes(category.id)}
                onClick={handleCategoryToggle}
              />
            ))
          )}
        </div>
      </div>
      
      <div className="form-actions">
        <button
          type="button"
          onClick={onBack}
          className="btn-outline"
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim() || (!imageFile && !initialFlashcard)}
        >
          {isSubmitting
            ? 'Enregistrement...'
            : initialFlashcard
              ? 'Mettre à jour'
              : 'Créer'
          }
        </button>
      </div>
    </form>
  );
};

export default FlashcardForm;