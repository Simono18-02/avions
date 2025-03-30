// src/App.jsx
import { Suspense, lazy } from 'react';
import Navbar from './components/common/Navbar';
import Loading from './components/common/Loading';

// Import paresseux des routes pour optimiser le chargement
const AppRoutes = lazy(() => import('./routes/AppRoutes'));

/**
 * Composant principal de l'application
 */
function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Suspense fallback={<Loading />}>
          <AppRoutes />
        </Suspense>
      </main>
    </>
  );
}

export default App;