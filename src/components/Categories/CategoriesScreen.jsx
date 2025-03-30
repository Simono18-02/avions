// src/components/Categories/CategoriesScreen.jsx
import { useState } from 'react';
import { useCategories } from '../../hooks/useCategories';
import CategoryForm from './CategoryForm';
import Loading from '../common/Loading';

/**
 * Écran de gestion des catégories
 */
const CategoriesScreen = () => {
  const { categories, loading, error, deleteCategory } = useCategories();
  const [isAdding, setIsAdding] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const handleAdd = () => {
    setCategoryToEdit(null);
    setIsAdding(true);
  };

  const handleEdit = (category) => {
    setCategoryToEdit(category);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setCategoryToEdit(null);
    setIsAdding(false);
  };

  const handleSaveSuccess = () => {
    setCategoryToEdit(null);
    setIsAdding(false);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const cancelDelete = () => {
    setCategoryToDelete(null);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="categories-screen">
      <div className="categories-header">
        <h1>Gérer les catégories</h1>
        {!isAdding && (
          <button onClick={handleAdd}>
            ➕ Nouvelle catégorie
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {isAdding && (
        <CategoryForm
          category={categoryToEdit}
          onCancel={handleCancel}
          onSaveSuccess={handleSaveSuccess}
        />
      )}

      <div className="categories-list-container">
        <h2>Catégories existantes</h2>
        
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>Aucune catégorie n'a été créée.</p>
            <p>Créez votre première catégorie en cliquant sur "Nouvelle catégorie".</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map(category => (
              <div 
                key={category.id}
                className="category-card"
                style={{ borderColor: category.color }}
              >
                <div 
                  className="category-color" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                </div>
                <div className="category-actions">
                  <button 
                    onClick={() => handleEdit(category)}
                    className="btn-icon"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(category)}
                    className="btn-icon"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {categoryToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirmer la suppression</h3>
            <p>Êtes-vous sûr de vouloir supprimer la catégorie "{categoryToDelete.name}" ?</p>
            <p>Cette action retirera cette catégorie de toutes les flashcards associées.</p>
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

export default CategoriesScreen;