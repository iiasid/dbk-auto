document.addEventListener('DOMContentLoaded', function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  let annonces = [];

  // Charger les annonces depuis le JSON
  fetch('annonces.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      annonces = data;
      displayAnnonces(annonces); // Afficher toutes les annonces par défaut
    })
    .catch(error => console.error('Erreur lors du chargement des annonces :', error));

  // Mettre à jour la liste des modèles selon la marque
  brandSelect.addEventListener('change', function () {
    const brand = brandSelect.value.toLowerCase();
    modelSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';
    modelSelect.disabled = true;

    if (brand) {
      modelSelect.disabled = false;

      const models = {
        toyota: ['Yaris', 'Corolla', 'Hilux', 'Land Cruiser', 'Auris'],
        bmw: ['X2', '3 Series', 'X5', 'M3', 'Z4'],
        renault: ['Twingo', 'Clio', 'Megane', 'Scenic', 'Express'],
        mercedes: ['C220', 'E-Class', 'S-Class', 'C-Class', 'A-Class'],
        peugeot: ['208', '3008', '508', '5008', 'Partner']
      };

      const selectedModels = models[brand] || [];
      selectedModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.toLowerCase();
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  });

  // Appliquer les filtres et afficher les annonces
  filterButton.addEventListener('click', function () {
    const selectedBrand = brandSelect.value.toLowerCase();
    const selectedModel = modelSelect.value.toLowerCase();
    const selectedGearbox = gearboxSelect.value.toLowerCase();
    const maxPrice = parseFloat(priceInput.value);

    const filteredAnnonces = annonces.filter(annonce => {
      const matchesBrand = selectedBrand ? annonce.marque === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.modele.toLowerCase() === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.boite === selectedGearbox : true;
      const matchesPrice = !isNaN(maxPrice) ? annonce.prix <= maxPrice : true;

      return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
    });

    displayAnnonces(filteredAnnonces);
  });

  function displayAnnonces(data) {
    annoncesDiv.innerHTML = '';
    if (data.length > 0) {
      data.forEach(annonce => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
          <img src="${annonce.image}" alt="${annonce.modele}" onerror="this.src='images/placeholder.jpg';" />
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
