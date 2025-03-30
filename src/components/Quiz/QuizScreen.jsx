// src/components/Quiz/QuizScreen.jsx
import { useState, useEffect } from 'react';
import { useFlashcards } from '../../hooks/useFlashcards';
import { useCategories } from '../../hooks/useCategories';
import CategoryChip from '../common/CategoryChip';
import QuizCard from './QuizCard';
import Loading from '../common/Loading';

/**
 * Écran du mode quiz
 */
const QuizScreen = () => {
  const { flashcards, loading, error, selectedCategoryId, selectCategory } = useFlashcards();
  const { categories } = useCategories();
  
  // États du quiz
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [quizFlashcards, setQuizFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  
  // Préparation des flashcards pour le quiz
  useEffect(() => {
    if (isQuizStarted && flashcards.length > 0) {
      // Filtrer par catégorie si nécessaire
      let filteredCards = [...flashcards];
      if (selectedCategoryId) {
        filteredCards = flashcards.filter(card => 
          card.categoryIds.includes(selectedCategoryId)
        );
      }
      
      // Mélanger les flashcards
      const shuffled = [...filteredCards].sort(() => Math.random() - 0.5);
      setQuizFlashcards(shuffled);
      setCurrentIndex(0);
      setScore(0);
      setIsQuizFinished(false);
    }
  }, [isQuizStarted, flashcards, selectedCategoryId]);
  
  // Démarrer le quiz
  const startQuiz = () => {
    setIsQuizStarted(true);
  };
  
  // Passer à la question suivante
  const nextQuestion = () => {
    if (currentIndex < quizFlashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsQuizFinished(true);
    }
  };
  
  // Augmenter le score
  const increaseScore = () => {
    setScore(score + 1);
  };
  
  // Réinitialiser le quiz
  const resetQuiz = () => {
    setIsQuizStarted(false);
    setQuizFlashcards([]);
    setCurrentIndex(0);
    setScore(0);
    setIsQuizFinished(false);
  };
  
  // Gérer la sélection de catégorie
  const handleCategorySelect = (categoryId) => {
    if (categoryId === selectedCategoryId) {
      selectCategory(null); // Désélectionner si déjà sélectionnée
    } else {
      selectCategory(categoryId);
    }
  };
  
  if (loading) {
    return <Loading />;
  }
  
  // Écran de configuration avant de démarrer le quiz
  if (!isQuizStarted) {
    return (
      <div className="quiz-setup-screen">
        <h1>Mode Quiz</h1>
        
        {error && <p className="error-text">{error}</p>}
        
        <div className="quiz-instructions">
          <p>Testez vos connaissances ! Le quiz vous montrera une image d'avion et vous devrez deviner son nom.</p>
          <p>Vous pouvez filtrer par catégorie ou jouer avec toutes les flashcards.</p>
        </div>
        
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
        
        <button 
          onClick={startQuiz} 
          disabled={flashcards.length === 0}
          className="btn-primary btn-large"
        >
          Commencer le quiz
        </button>
        
        {flashcards.length === 0 && (
          <p className="info-text">
            Vous devez créer des flashcards avant de pouvoir démarrer un quiz.
          </p>
        )}
      </div>
    );
  }
  
  // Écran de résultat à la fin du quiz
  if (isQuizFinished) {
    const totalQuestions = quizFlashcards.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    let message = '';
    if (percentage >= 90) {
      message = 'Excellent ! Vous êtes un expert !';
    } else if (percentage >= 70) {
      message = 'Très bien ! Vous avez de bonnes connaissances !';
    } else if (percentage >= 50) {
      message = 'Pas mal ! Continuez à apprendre !';
    } else {
      message = 'Continuez à vous entraîner, vous allez progresser !';
    }
    
    return (
      <div className="quiz-results-screen">
        <h1>Résultats du quiz</h1>
        
        <div className="quiz-score-card">
          <h2>Score final</h2>
          <div className="score-display">
            <span className="score-value">{score}</span>
            <span className="score-separator">/</span>
            <span className="score-total">{totalQuestions}</span>
          </div>
          
          <div className="score-percentage">
            {percentage}%
          </div>
          
          <p className="score-message">{message}</p>
        </div>
        
        <div className="quiz-actions">
          <button 
            onClick={resetQuiz}
            className="btn-outline"
          >
            Retour à l'accueil du quiz
          </button>
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setIsQuizFinished(false);
              
              // Mélanger à nouveau les flashcards
              const shuffled = [...quizFlashcards].sort(() => Math.random() - 0.5);
              setQuizFlashcards(shuffled);
            }}
            className="btn-primary"
          >
            Recommencer
          </button>
        </div>
      </div>
    );
  }
  
  // Écran du quiz en cours
  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <h1>Mode Quiz</h1>
        <div className="quiz-progress">
          Question {currentIndex + 1} / {quizFlashcards.length}
        </div>
      </div>
      
      <div className="quiz-score">
        Score: {score}
      </div>
      
      {quizFlashcards.length > 0 && currentIndex < quizFlashcards.length ? (
        <QuizCard 
          flashcard={quizFlashcards[currentIndex]}
          onCorrectAnswer={increaseScore}
          onNext={nextQuestion}
        />
      ) : (
        <div className="empty-state">
          <p>Aucune flashcard disponible pour ce quiz.</p>
          <button onClick={resetQuiz}>
            Retour
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizScreen;