// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { FlashcardProvider } from './context/FlashcardContext.jsx';
import { CategoryProvider } from './context/CategoryContext.jsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CategoryProvider>
        <FlashcardProvider>
          <App />
        </FlashcardProvider>
      </CategoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
