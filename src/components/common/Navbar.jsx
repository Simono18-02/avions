// src/components/common/Navbar.jsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

/**
 * Barre de navigation principale
 */
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          AvionCards
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Menu">
          <span>☰</span>
        </button>

        <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <NavLink to="/" className="navbar-link" onClick={closeMenu}>
              Accueil
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/create" className="navbar-link" onClick={closeMenu}>
              Créer
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/categories" className="navbar-link" onClick={closeMenu}>
              Catégories
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/quiz" className="navbar-link" onClick={closeMenu}>
              Quiz
            </NavLink>
          </li>
          <li className="navbar-item">
            <NavLink to="/settings" className="navbar-link" onClick={closeMenu}>
              Paramètres
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;