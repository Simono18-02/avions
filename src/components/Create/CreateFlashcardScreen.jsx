// src/components/Create/CreateFlashcardScreen.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFlashcards } from '../../hooks/useFlashcards';
import FlashcardForm from './FlashcardForm';
import Loading from '../common/Loading';

/**
 * Écran de création/édition de flashcard
 */
const CreateFlashcardScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, getFlashcardById, getFlashcardImageUrl } = useFlashcards();
  const [flashcard, setFlashcard] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(id ? true : false);

  // Si on est en mode édition, charger la flashcard existante
  useEffect(() => {
    const loadFlashcard = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const loadedFlashcard = await getFlashcardById(id);
        
        if (!loadedFlashcard) {
          navigate('/create', { replace: true });
          return;
        }
        
        setFlashcard(loadedFlashcard);
        
        // Charger l'URL de l'image
        if (loadedFlashcard.imagePath) {
          const url = await getFlashcardImageUrl(loadedFlashcard.imagePath);
          setImageUrl(url);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la flashcard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFlashcard();
  }, [id, getFlashcardById, getFlashcardImageUrl, navigate]);
  // Suite de src/components/Create/CreateFlashcardScreen.jsx
  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="create-screen">
      <h1>{id ? 'Modifier la flashcard' : 'Créer une nouvelle flashcard'}</h1>
      
      <FlashcardForm 
        initialFlashcard={flashcard}
        initialImageUrl={imageUrl}
        onBack={handleBack}
      />
    </div>
  );
};

export default CreateFlashcardScreen;