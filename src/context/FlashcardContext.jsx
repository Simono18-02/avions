// src/context/FlashcardContext.jsx
import { createContext, useReducer, useEffect, useState } from 'react';
import { flashcardService } from '../services/flashcardService';

// Création du contexte
export const FlashcardContext = createContext();

// Types d'actions
const ACTIONS = {
  SET_FLASHCARDS: 'SET_FLASHCARDS',
  ADD_FLASHCARD: 'ADD_FLASHCARD',
  UPDATE_FLASHCARD: 'UPDATE_FLASHCARD',
  DELETE_FLASHCARD: 'DELETE_FLASHCARD',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer pour gérer les états
const flashcardReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_FLASHCARDS:
      return {
        ...state,
        flashcards: action.payload,
        loading: false
      };
    case ACTIONS.ADD_FLASHCARD:
      return {
        ...state,
        flashcards: [...state.flashcards, action.payload],
        loading: false
      };
    case ACTIONS.UPDATE_FLASHCARD:
      return {
        ...state,
        flashcards: state.flashcards.map(flashcard => 
          flashcard.id === action.payload.id ? action.payload : flashcard
        ),
        loading: false
      };
    case ACTIONS.DELETE_FLASHCARD:
      return {
        ...state,
        flashcards: state.flashcards.filter(flashcard => flashcard.id !== action.payload),
        loading: false
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// État initial
const initialState = {
  flashcards: [],
  loading: true,
  error: null
};

// Provider Component
export const FlashcardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(flashcardReducer, initialState);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  
  // Charger les flashcards au démarrage
  useEffect(() => {
    const loadFlashcards = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const flashcards = await flashcardService.getAllFlashcards();
        dispatch({ type: ACTIONS.SET_FLASHCARDS, payload: flashcards });
      } catch (error) {
        console.error('Erreur lors du chargement des flashcards:', error);
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: 'Impossible de charger les flashcards. Veuillez réessayer.' 
        });
      }
    };

    loadFlashcards();
  }, []);
  
  // Filtrer les flashcards quand la catégorie sélectionnée change
  useEffect(() => {
    if (selectedCategoryId) {
      setFilteredFlashcards(
        state.flashcards.filter(flashcard => 
          flashcard.categoryIds.includes(selectedCategoryId)
        )
      );
    } else {
      setFilteredFlashcards(state.flashcards);
    }
  }, [selectedCategoryId, state.flashcards]);

  // Actions pour interagir avec les flashcards
  const addFlashcard = async (name, imageFile, categoryIds) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const id = await flashcardService.createFlashcard(name, imageFile, categoryIds);
      const newFlashcard = await flashcardService.getFlashcardById(id);
      dispatch({ type: ACTIONS.ADD_FLASHCARD, payload: newFlashcard });
      return id;
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une flashcard:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Impossible d\'ajouter la flashcard. Veuillez réessayer.' 
      });
      throw error;
    }
  };

  const updateFlashcard = async (id, name, imageFile, categoryIds) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await flashcardService.updateFlashcard(id, name, imageFile, categoryIds);
      const updatedFlashcard = await flashcardService.getFlashcardById(id);
      dispatch({ type: ACTIONS.UPDATE_FLASHCARD, payload: updatedFlashcard });
      return id;
    } catch (error) {
      console.error('Erreur lors de la mise à jour d\'une flashcard:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Impossible de mettre à jour la flashcard. Veuillez réessayer.' 
      });
      throw error;
    }
  };

  const deleteFlashcard = async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await flashcardService.deleteFlashcard(id);
      dispatch({ type: ACTIONS.DELETE_FLASHCARD, payload: id });
    } catch (error) {
      console.error('Erreur lors de la suppression d\'une flashcard:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Impossible de supprimer la flashcard. Veuillez réessayer.' 
      });
      throw error;
    }
  };

  const getRandomFlashcard = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const flashcard = await flashcardService.getRandomFlashcard();
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return flashcard;
    } catch (error) {
      console.error('Erreur lors de la récupération d\'une flashcard aléatoire:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Impossible de récupérer une flashcard aléatoire. Veuillez réessayer.' 
      });
      return null;
    }
  };

  const getFlashcardById = async (id) => {
    try {
      return await flashcardService.getFlashcardById(id);
    } catch (error) {
      console.error('Erreur lors de la récupération de la flashcard:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Impossible de récupérer la flashcard. Veuillez réessayer.' 
      });
      return null;
    }
  };

  const getFlashcardImageUrl = async (imageId) => {
    try {
      return await flashcardService.getFlashcardImageUrl(imageId);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'image:', error);
      return null;
    }
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  const selectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  // Valeur du contexte
  const value = {
    flashcards: state.flashcards,
    filteredFlashcards,
    loading: state.loading,
    error: state.error,
    selectedCategoryId,
    addFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getRandomFlashcard,
    getFlashcardById,
    getFlashcardImageUrl,
    clearError,
    selectCategory
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
};
