document.addEventListener('DOMContentLoaded', function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  const annonces = [
    { brand: 'Toyota', model: 'Yaris', year: 2009, gearbox: 'manuelle', price: 6000, img: 'toyota-yaris.jpg' },
    { brand: 'BMW', model: 'X2', year: 2020, gearbox: 'automatique', price: 35000, img: 'bmw-x2.jpg' },
    { brand: 'Renault', model: 'Twingo', year: 2018, gearbox: 'manuelle', price: 9000, img: 'renault-twingo.jpg' },
    { brand: 'Mercedes', model: 'C220', year: 2009, gearbox: 'automatique', price: 24300, img: 'mercedes-c220.jpg' },
    { brand: 'Renault', model: 'Express', year: 1990, gearbox: 'manuelle', price: 1500, img: 'renault-express.jpg' },
  ];

  // Populate model options dynamically based on brand selection
  brandSelect.addEventListener('change', function () {
    const brand = brandSelect.value;
    modelSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';
    modelSelect.disabled = true;

    if (brand) {
      modelSelect.disabled = false;
      let models = [];

      switch (brand) {
        case 'Toyota':
          models = ['Yaris', 'Corolla', 'Hilux', 'Land Cruiser', 'Auris'];
          break;
        case 'BMW':
          models = ['X2', '3 Series', 'X5', 'M3', 'Z4'];
          break;
        case 'Renault':
          models = ['Twingo', 'Clio', 'Megane', 'Scenic', 'Express'];
          break;
        case 'Mercedes':
          models = ['C-Class', 'E-Class', 'S-Class', 'C220', 'A-Class'];
          break;
        default:
          models = [];
      }

      models.forEach(function (model) {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
    }
  });

  // Function to filter and display results
  filterButton.addEventListener('click', function () {
    const selectedBrand = brandSelect.value;
    const selectedModel = modelSelect.value;
    const selectedGearbox = gearboxSelect.value;
    const maxPrice = parseFloat(priceInput.value);

    // Clear previous results
    annoncesDiv.innerHTML = '';

    // Filter annonces based on selected criteria
    const filteredAnnonces = annonces.filter(function (annonce) {
      const matchesBrand = selectedBrand ? annonce.brand === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.model === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.gearbox === selectedGearbox : true;
      const matchesPrice = !isNaN(maxPrice) ? annonce.price <= maxPrice : true;

      return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
    });

    // Display results
    if (filteredAnnonces.length > 0) {
      filteredAnnonces.forEach(function (annonce) {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
          <img src="images/${annonce.img}" alt="${annonce.model}" />
          <h3>${annonce.brand} ${annonce.model}</h3>
          <p>Année: ${annonce.year}</p>
          <p>Boîte: ${annonce.gearbox}</p>
          <p>Prix: ${annonce.price} €</p>
        `;
        annoncesDiv.appendChild(card);
      });
    } else {
      annoncesDiv.innerHTML = '<p>Aucune annonce ne correspond à vos critères.</p>';
    }
  });
});
