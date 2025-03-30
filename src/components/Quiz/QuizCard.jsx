// src/components/Quiz/QuizCard.jsx
import { useState, useEffect } from 'react';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useSpeech } from '../../hooks/useSpeech';

/**
 * Carte de quiz pour deviner le nom d'un avion
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.flashcard - Flashcard à deviner
 * @param {Function} props.onCorrectAnswer - Callback en cas de bonne réponse
 * @param {Function} props.onNext - Callback pour passer à la question suivante
 */
const QuizCard = ({ flashcard, onCorrectAnswer, onNext }) => {
  const [guess, setGuess] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { getFlashcardImageUrl } = useFlashcards();
  const { speak } = useSpeech();
  
  // Charger l'image de la flashcard
  useEffect(() => {
    const loadImage = async () => {
      if (flashcard?.imagePath) {
        const url = await getFlashcardImageUrl(flashcard.imagePath);
        setImageUrl(url);
      }
    };
    
    loadImage();
    
    // Réinitialiser l'état à chaque nouvelle flashcard
    setGuess('');
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [flashcard, getFlashcardImageUrl]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!guess.trim() || isSubmitted) return;
    
    // Vérifier la réponse (en ignorant la casse et les espaces supplémentaires)
    const isAnswerCorrect = guess.trim().toLowerCase() === flashcard.name.toLowerCase();
    
    setIsCorrect(isAnswerCorrect);
    setIsSubmitted(true);
    
    if (isAnswerCorrect) {
      onCorrectAnswer();
    }
    
    // Prononcer le nom correct
    speak(flashcard.name);
  };
  
  const handleNext = () => {
    onNext();
  };
  
  return (
    <div className="quiz-card">
      <div className="quiz-image-container">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Avion à identifier"
            className="quiz-image"
          />
        ) : (
          <div className="loading-placeholder">
            Chargement de l'image...
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="quiz-form">
        <label htmlFor="guess">Quel est le nom de cet avion ?</label>
        <div className="quiz-input-group">
          <input
            id="guess"
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Entrez le nom de l'avion"
            disabled={isSubmitted}
            autoComplete="off"
          />
          {!isSubmitted && (
            <button 
              type="submit"
              disabled={!guess.trim()}
            >
              Valider
            </button>
          )}
        </div>
      </form>
      
      {isSubmitted && (
        <div className={`quiz-result ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="result-icon">
            {isCorrect ? '✓' : '✗'}
          </div>
          <div className="result-message">
            {isCorrect 
              ? 'Correct !' 
              : `Incorrect. La réponse était : ${flashcard.name}`
            }
          </div>
          <button 
            onClick={handleNext}
            className="btn-primary"
          >
            Question suivante
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizCard;