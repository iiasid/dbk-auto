document.addEventListener('DOMContentLoaded', function() {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');

  // Fonction qui gère l'activation du champ modèle selon la marque
  brandSelect.addEventListener('change', function() {
    const brand = brandSelect.value;
    
    // Réinitialiser les modèles et désactiver la liste modèle
    modelSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';
    
    if (brand) {
      modelSelect.removeAttribute('disabled'); // Activer le modèle
      let models = [];

      switch (brand) {
        case 'Toyota':
          models = ['Yaris', 'Corolla', 'Hilux', 'Land Cruiser', 'Auris'];
          break;
        case 'BMW':
          models = ['X2', '3 Series', 'X5', 'M3', 'Z4'];
          break;
        case 'Renault':
          models = ['Twingo', 'Clio', 'Megane', 'Scenic', 'Kangoo'];
          break;
        case 'Mercedes':
          models = ['A-Class', 'B-Class', 'C-Class', 'E-Class', 'S-Class'];
          break;
        case 'Peugeot':
          models = ['208', '3008', '508', '5008', 'Partner'];
          break;
        case 'Volkswagen':
          models = ['Golf', 'Polo', 'Passat', 'Tiguan', 'Jetta'];
          break;
        case 'Audi':
          models = ['A1', 'A3', 'A4', 'Q5', 'Q7'];
          break;
        case 'Ford':
          models = ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'EcoSport'];
          break;
        case 'Fiat':
          models = ['500', 'Panda', 'Tipo', 'Doblo', 'Ulysse'];
          break;
        case 'Citroën':
          models = ['C3', 'C4', 'C5 Aircross', 'Berlingo', 'DS3'];
          break;
        default:
          models = [];
      }

      // Ajouter les modèles à la liste déroulante du modèle
      models.forEach(function(model) {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    } else {
      modelSelect.setAttribute('disabled', true); // Désactiver le modèle si aucune marque sélectionnée
    }
  });

  // S'assurer que le modèle est désactivé au départ
  modelSelect.setAttribute('disabled', true);
});
