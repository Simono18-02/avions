// src/components/Home/HomeScreen.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useCategories } from '../../hooks/useCategories';
import FlashcardsList from './FlashcardsList';
import RandomFlashcardModal from './RandomFlashcardModal';
import CategoryChip from '../common/CategoryChip';
import Loading from '../common/Loading';

/**
 * Écran principal de l'application
 */
const HomeScreen = () => {
  const navigate = useNavigate();
  const { filteredFlashcards, loading, error, selectCategory, selectedCategoryId, getRandomFlashcard } = useFlashcards();
  const { categories } = useCategories();
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [randomFlashcard, setRandomFlashcard] = useState(null);
  const [randomLoading, setRandomLoading] = useState(false);

  const handleAddFlashcard = () => {
    navigate('/create');
  };

  const handleEditFlashcard = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleCategorySelect = (categoryId) => {
    if (categoryId === selectedCategoryId) {
      selectCategory(null); // Désélectionner si déjà sélectionnée
    } else {
      selectCategory(categoryId);
    }
  };

  const handleRandomFlashcard = async () => {
    setRandomLoading(true);
    setShowRandomModal(true);
    
    try {
      const flashcard = await getRandomFlashcard();
      setRandomFlashcard(flashcard);
    } catch (error) {
      console.error('Erreur lors de la récupération d\'une flashcard aléatoire:', error);
    } finally {
      setRandomLoading(false);
    }
  };

  const closeRandomModal = () => {
    setShowRandomModal(false);
    setRandomFlashcard(null);
  };

  if (loading) return <Loading />;

  return (
    <div className="home-screen">
      <div className="home-header">
        <h1>Mes Flashcards d'Avions</h1>
        <div className="action-buttons">
          <button onClick={handleAddFlashcard}>
            ➕ Nouvelle Flashcard
          </button>
          <button 
            onClick={handleRandomFlashcard}
            className="btn-secondary"
          >
            🎲 Flashcard Aléatoire
          </button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="categories-filter">
        <h3>Filtrer par catégorie:</h3>
        <div className="categories-list">
          <CategoryChip 
            category={{ id: 'all', name: 'Toutes', color: '#808080' }}
            selected={selectedCategoryId === null}
            onClick={() => selectCategory(null)}
          />
          {categories.map(category => (
            <CategoryChip 
              key={category.id}
              category={category}
              selected={category.id === selectedCategoryId}
              onClick={handleCategorySelect}
            />
          ))}
        </div>
      </div>

      <FlashcardsList 
        flashcards={filteredFlashcards}
        categories={categories}
        onEdit={handleEditFlashcard}
      />

      {showRandomModal && (
        <RandomFlashcardModal 
          flashcard={randomFlashcard}
          categories={categories}
          loading={randomLoading}
          onClose={closeRandomModal}
          onEdit={handleEditFlashcard}
          onNext={handleRandomFlashcard}
        />
      )}
    </div>
  );
};

export default HomeScreen;
