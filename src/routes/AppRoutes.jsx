// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from '../components/Home/HomeScreen';
import CreateFlashcardScreen from '../components/Create/CreateFlashcardScreen';
import CategoriesScreen from '../components/Categories/CategoriesScreen';
import QuizScreen from '../components/Quiz/QuizScreen';
import SettingsScreen from '../components/Settings/SettingsScreen';

/**
 * Configuration des routes de l'application
 */
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/create" element={<CreateFlashcardScreen />} />
      <Route path="/edit/:id" element={<CreateFlashcardScreen />} />
      <Route path="/categories" element={<CategoriesScreen />} />
      <Route path="/quiz" element={<QuizScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
