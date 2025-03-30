// src/components/common/CategoryChip.jsx
/**
 * Puce de catégorie sélectionnable
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.category - Catégorie à afficher
 * @param {boolean} props.selected - État de sélection
 * @param {Function} props.onClick - Fonction appelée au clic
 * @param {Function} props.onDelete - Fonction de suppression (optionnelle)
 */
const CategoryChip = ({ category, selected = false, onClick, onDelete = null }) => {
  // Convertir la couleur en style CSS avec opacité adaptée
  const chipStyle = {
    backgroundColor: `${category.color}${selected ? 'DD' : '33'}`,
    borderColor: category.color
  };

  const handleClick = (e) => {
    onClick(category.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(category.id);
  };

  return (
    <div 
      className={`category-chip ${selected ? 'selected' : ''}`} 
      style={chipStyle}
      onClick={handleClick}
    >
      <span className="category-chip-text">{category.name}</span>
      {onDelete && (
        <span className="category-chip-close" onClick={handleDelete}>
          ✕
        </span>
      )}
    </div>
  );
};

export default CategoryChip;