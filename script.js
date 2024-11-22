document.addEventListener('DOMContentLoaded', function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  // Jeton d'accès personnel Airtable et URL de l'API
  const apiKey = 'patvWkfPXlYuM1jjN.cfb1c14a851bf57bd07ab645882e6362d9a88c833608abe53faffd1ddd6f1e44';
  const baseId = 'apprRBKlK2tlPjFa4';
  const marquesUrl = `https://api.airtable.com/v0/${baseId}/Marques`;
  const modelesUrl = `https://api.airtable.com/v0/${baseId}/Modèles`;
  const annoncesUrl = `https://api.airtable.com/v0/${baseId}/Annonces`;

  let annonces = [];

  // Fonction pour récupérer les données depuis Airtable
  async function fetchData(url) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.records;

    } catch (error) {
      console.error('Erreur lors du chargement des données depuis Airtable :', error);
      return [];
    }
  }

  // Charger les marques et remplir le filtre des marques
  async function loadBrands() {
    const marques = await fetchData(marquesUrl);
    brandSelect.innerHTML = '<option value="">Toutes les marques</option>'; // Option par défaut

    marques.forEach(marque => {
      const option = document.createElement('option');
      option.value = marque.fields['Nom de la Marque'].toLowerCase();
      option.textContent = marque.fields['Nom de la Marque'];
      brandSelect.appendChild(option);
    });
  }

  // Charger les modèles et remplir le filtre des modèles
  async function loadModels(brand = '') {
    const modeles = await fetchData(modelesUrl);
    modelSelect.innerHTML = '<option value="">Tous les modèles</option>'; // Option par défaut

    // Filtrer les modèles selon la marque sélectionnée
    const filteredModels = brand
      ? modeles.filter(modele => modele.fields['Marque Associée'].toLowerCase() === brand)
      : modeles;

    filteredModels.forEach(modele => {
      const option = document.createElement('option');
      option.value = modele.fields['Nom du Modèle'].toLowerCase();
      option.textContent = modele.fields['Nom du Modèle'];
      modelSelect.appendChild(option);
    });

    // Activer le filtre des modèles
    modelSelect.disabled = filteredModels.length === 0;
  }

  // Charger les annonces
  async function loadAnnonces() {
    annonces = await fetchData(annoncesUrl);
  }

  // Fonction pour afficher les annonces
  function displayAnnonces(data) {
    annoncesDiv.innerHTML = ''; // Vider les annonces précédentes
    if (data.length > 0) {
      data.forEach(annonce => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
          <img src="${annonce.fields.Image ? annonce.fields.Image[0].url : 'images/placeholder.jpg'}" alt="${annonce.fields.Modèle}" onerror="this.src='images/placeholder.jpg';" />
          <h3>${annonce.fields.Marque.toUpperCase()} ${annonce.fields.Modèle}</h3>
          <p>Année : ${annonce.fields.Année}</p>
          <p>Boîte : ${annonce.fields.Boîte}</p>
          <p>Prix : ${annonce.fields.Prix.toLocaleString()} €</p>
        `;
        annoncesDiv.appendChild(card);
      });
    } else {
      annoncesDiv.innerHTML = '<p>Aucune annonce ne correspond à vos critères.</p>';
    }
  }

  // Appliquer les filtres
  filterButton.addEventListener('click', function (event) {
    event.preventDefault(); // Empêche la page de se rafraîchir automatiquement
    console.log('Bouton "Appliquer les filtres" cliqué');

    const selectedBrand = brandSelect.value.toLowerCase().trim();
    const selectedModel = modelSelect.value.toLowerCase().trim();
    const selectedGearbox = gearboxSelect.value.toLowerCase().trim();
    const maxPrice = parseFloat(priceInput.value);

    // Filtrer les annonces selon les critères sélectionnés
    const filteredAnnonces = annonces.filter(annonce => {
      const matchesBrand = selectedBrand ? annonce.fields.Marque.toLowerCase() === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.fields.Modèle.toLowerCase() === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.fields.Boîte.toLowerCase() === selectedGearbox : true;
      const matchesPrice = !isNaN(maxPrice) ? annonce.fields.Prix <= maxPrice : true;

      return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
    });

    console.log('Annonces filtrées :', filteredAnnonces);
    displayAnnonces(filteredAnnonces);
  });

  // Charger les marques, les modèles et les annonces au démarrage
  loadBrands();
  loadModels(); // Charger tous les modèles au départ
  loadAnnonces();

  // Mettre à jour les modèles lorsque la marque change
  brandSelect.addEventListener('change', function () {
    const selectedBrand = brandSelect.value.toLowerCase().trim();
    loadModels(selectedBrand);
  });
});
