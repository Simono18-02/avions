// src/components/Settings/About.jsx
/**
 * Composant d'informations sur l'application
 */
const About = () => {
  return (
    <div className="about-section">
      <h2>À propos d'AvionCards</h2>
      
      <div className="app-info">
        <p>
          <strong>Version:</strong> 1.0.0
        </p>
        <p>
          <strong>Description:</strong> Application de flashcards sur le thème des avions
        </p>
        <p>
          <strong>Technologies:</strong> React, IndexedDB, Web Speech API
        </p>
        <p>
          <strong>Stockage:</strong> Toutes les données sont stockées localement dans votre navigateur
        </p>
      </div>
      
      <div className="app-features">
        <h3>Fonctionnalités principales</h3>
        <ul>
          <li>Création et gestion de flashcards d'avions</li>
          <li>Organisation par catégories personnalisables</li>
          <li>Mode quiz pour tester vos connaissances</li>
          <li>Synthèse vocale pour la prononciation des noms d'avions</li>
          <li>Sauvegarde et restauration des données</li>
        </ul>
      </div>
      
      <div className="app-credits">
        <p>
          © 2023 AvionCards - Tous droits réservés
        </p>
      </div>
    </div>
  );
};

export default About;