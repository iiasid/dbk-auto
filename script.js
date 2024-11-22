document.addEventListener('DOMContentLoaded', function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  // Charger les annonces depuis le JSON
  let annonces = [];

  fetch('annonces.json')
    .then(response => response.json())
    .then(data => {
      annonces = data;
    })
    .catch(error => console.error('Erreur lors du chargement des annonces :', error));

  // Remplir la liste des modèles en fonction de la marque
  brandSelect.addEventListener('change', function () {
    const brand = brandSelect.value;
    modelSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';
    modelSelect.disabled = true;

    if (brand) {
      modelSelect.disabled = false;
      let models = [];

      switch (brand) {
        case 'toyota':
          models = ['Yaris', 'Corolla', 'Hilux', 'Land Cruiser', 'Auris'];
          break;
        case 'bmw':
          models = ['X2', '3 Series', 'X5', 'M3', 'Z4'];
          break;
        case 'renault':
          models = ['Twingo', 'Clio', 'Megane', 'Scenic', 'Express'];
          break;
        case 'mercedes':
          models = ['C220', 'E-Class', 'S-Class', 'C-Class', 'A-Class'];
          break;
        default:
          models = [];
      }

      models.forEach(function (model) {
        const option = document.createElement('option');
        option.value = model.toLowerCase();
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  });

  // Appliquer les filtres et afficher les annonces
  filterButton.addEventListener('click', function () {
    const selectedBrand = brandSelect.value;
    const selectedModel = modelSelect.value;
    const selectedGearbox = gearboxSelect.value;
    const maxPrice = parseFloat(priceInput.value);

    // Filtrer les annonces
    const filteredAnnonces = annonces.filter(function (annonce) {
      const matchesBrand = selectedBrand ? annonce.marque === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.modele.toLowerCase() === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.boite === selectedGearbox : true;
      const matchesPrice = !isNaN(maxPrice) ? annonce.prix <= maxPrice : true;

      return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
    });

    // Afficher les annonces filtrées
    displayAnnonces(filteredAnnonces);
  });

  // Fonction pour afficher les annonces
  function displayAnnonces(data) {
    annoncesDiv.innerHTML = '';

    if (data.length > 0) {
      data.forEach(function (annonce) {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
          <img src="${annonce.image}" alt="${annonce.modele}" />
          <h3>${annonce.marque.toUpperCase()} ${annonce.modele}</h3>
          <p>Année : ${annonce.annee}</p>
          <p>Boîte : ${annonce.boite}</p>
          <p>Prix : ${annonce.prix.toLocaleString()} €</p>
        `;
        annoncesDiv.appendChild(card);
      });
    } else {
      annoncesDiv.innerHTML = '<p>Aucune annonce ne correspond à vos critères.</p>';
    }
  }
});
