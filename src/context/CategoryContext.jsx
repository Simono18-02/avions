// src/context/CategoryContext.jsx
import { createContext, useReducer, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

// Création du contexte
export const CategoryContext = createContext();

// Types d'actions
const ACTIONS = {
  SET_CATEGORIES: 'SET_CATEGORIES',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer pour gérer les états
const categoryReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        loading: false
      };
    case ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        loading: false
      };
    case ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        ),
        loading: false
      };
    case ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
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
  categories: [],
  loading: true,
  error: null
};

// Provider Component
export const CategoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(categoryReducer, initialState);

  // Charger les catégories au démarrage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const categories = await categoryService.getAllCategories();
        dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories });
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: 'Impossible de charger les catégories. Veuillez réessayer.' 
        });
      }
    };

    loadCategories();
  }, []);

  // Actions pour interagir avec les catégories
  const addCategory = async (name, color) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const id = await categoryService.createCategory(name, color);
      const newCategory = await categoryService.getCategoryById(id);
      dispatch({ type: ACTIONS.ADD_CATEGORY, payload: newCategory });
      return id;
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une catégorie:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Impossible d\'ajouter la catégorie. Veuillez réessayer.' 
      });
      throw error;
    }
  };
  
  // Continuation de src/context/CategoryContext.jsx

  const updateCategory = async (id, name, color) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await categoryService.updateCategory(id, name, color);
      const updatedCategory = await categoryService.getCategoryById(id);
      dispatch({ type: ACTIONS.UPDATE_CATEGORY, payload: updatedCategory });
      return id;
    } catch (error) {
      console.error('Erreur lors de la mise à jour d\'une catégorie:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Impossible de mettre à jour la catégorie. Veuillez réessayer.' 
      });
      throw error;
    }
  };

  const deleteCategory = async (id) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      await categoryService.deleteCategory(id);
      dispatch({ type: ACTIONS.DELETE_CATEGORY, payload: id });
    } catch (error) {
      console.error('Erreur lors de la suppression d\'une catégorie:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Impossible de supprimer la catégorie. Veuillez réessayer.' 
      });
      throw error;
    }
  };

  const getCategoryById = async (id) => {
    try {
      return await categoryService.getCategoryById(id);
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'Impossible de récupérer la catégorie. Veuillez réessayer.' 
      });
      return null;
    }
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  };

  // Valeur du contexte
  const value = {
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    clearError
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};