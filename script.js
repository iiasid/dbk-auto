document.getElementById('brand').addEventListener('change', function() {
  var brand = this.value;
  var modelSelect = document.getElementById('model');
  
  // Réinitialiser les options du modèle
  modelSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';

  if (brand) {
    // Activer la sélection du modèle
    modelSelect.removeAttribute('disabled');
    
    // Définir les modèles disponibles selon la marque
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

    // Ajouter les options de modèles à la liste
    models.forEach(function(model) {
      var option = document.createElement('option');
      option.value = model;
      option.textContent = model;
      modelSelect.appendChild(option);
    });
  } else {
    // Si aucune marque n'est sélectionnée, désactiver le modèle
    modelSelect.setAttribute('disabled', true);
  }
});
