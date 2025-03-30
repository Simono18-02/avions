// src/components/Categories/CategoryForm.jsx
import { useState, useEffect } from 'react';
import { useCategories } from '../../hooks/useCategories';

// Couleurs prédéfinies pour les catégories
const PREDEFINED_COLORS = [
  '#1A73E8', // Bleu
  '#F57C00', // Orange
  '#4CAF50', // Vert
  '#F44336', // Rouge
  '#9C27B0', // Violet
  '#FFEB3B', // Jaune
  '#607D8B', // Gris bleu
  '#E91E63', // Rose
  '#795548', // Marron
  '#009688', // Turquoise
  '#3F51B5', // Indigo
  '#FF5722'  // Orange foncé
];

/**
 * Formulaire d'ajout/édition de catégorie
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.category - Catégorie existante en mode édition
 * @param {Function} props.onCancel - Fonction d'annulation
 * @param {Function} props.onSaveSuccess - Callback après sauvegarde réussie
 */
const CategoryForm = ({ category = null, onCancel, onSaveSuccess }) => {
  const { addCategory, updateCategory, error } = useCategories();
  
  // État du formulaire
  const [name, setName] = useState(category?.name || '');
  const [color, setColor] = useState(category?.color || PREDEFINED_COLORS[0]);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setFormError('Le nom de la catégorie est requis');
      return;
    }
    
    setFormError('');
    setIsSubmitting(true);
    
    try {
      if (category) {
        // Mode édition
        await updateCategory(category.id, name.trim(), color);
      } else {
        // Mode création
        await addCategory(name.trim(), color);
      }
      
      onSaveSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setFormError('Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="category-form card">
      <h2>{category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
      
      {(error || formError) && (
        <div className="error-message">
          {error || formError}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="category-name">Nom de la catégorie</label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Avions français, Avions militaires, XXe siècle..."
          required
        />
      </div>
      
      <div className="form-group">
        <label>Couleur</label>
        <div className="color-picker">
          {PREDEFINED_COLORS.map(predefinedColor => (
            <div
              key={predefinedColor}
              className={`color-option ${color === predefinedColor ? 'selected' : ''}`}
              style={{ backgroundColor: predefinedColor }}
              onClick={() => setColor(predefinedColor)}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
          disabled={isSubmitting}
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
        >
          {isSubmitting
            ? 'Enregistrement...'
            : category
              ? 'Mettre à jour'
              : 'Créer'
          }
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;