// src/components/common/ImagePicker.jsx
import { useState, useRef } from 'react';

/**
 * Sélecteur d'image avec prévisualisation
 * @param {Object} props - Propriétés du composant
 * @param {string} props.initialImageUrl - URL de l'image initiale (optionnelle)
 * @param {Function} props.onImageSelected - Fonction appelée quand une image est sélectionnée
 */
const ImagePicker = ({ initialImageUrl = null, onImageSelected }) => {
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Veuillez sélectionner une image valide (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Vérifier la taille (max 5 Mo)
    const maxSize = 5 * 1024 * 1024; // 5 Mo
    if (file.size > maxSize) {
      alert('L\'image est trop volumineuse. Taille maximale: 5 Mo');
      return;
    }

    // Créer une URL pour la prévisualisation
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Appeler la fonction de callback avec le fichier
    onImageSelected(file);

    // Nettoyer l'URL de prévisualisation quand le composant sera démonté
    return () => URL.revokeObjectURL(objectUrl);
  };

  return (
    <div className="image-picker">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      <div 
        className="image-preview" 
        onClick={handleButtonClick}
        style={{ 
          backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
          backgroundColor: previewUrl ? 'transparent' : '#f0f0f0'
        }}
      >
        {!previewUrl && (
          <div className="image-placeholder">
            <span>📷</span>
            <p>Cliquez pour choisir une image</p>
          </div>
        )}
      </div>
      
      <button 
        type="button" 
        className="btn-outline image-select-btn"
        onClick={handleButtonClick}
      >
        {previewUrl ? 'Changer l\'image' : 'Sélectionner une image'}
      </button>
    </div>
  );
};

export default ImagePicker;