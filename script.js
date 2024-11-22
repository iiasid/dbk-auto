document.addEventListener('DOMContentLoaded', async function () {
  // Sélection des éléments du DOM
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  // Informations d'accès Airtable
  const apiKey = 'patvWkfPXlYuM1jjN.cfb1c14a851bf57bd07ab645882e6362d9a88c833608abe53faffd1ddd6f1e44';
  const apiUrlAnnonces = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Annonces`;
  const apiUrlMarques = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Marques`;
  const apiUrlModeles = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Modèles`;

  // Stockage des annonces et des filtres
  let annonces = [];
  let marquesList = [];
  let modelesList = [];

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

  // Charger les annonces depuis Airtable
  async function fetchAnnonces() {
    const records = await fetchData(apiUrlAnnonces);
    annonces = records.map(record => {
      return {
        id: record.id,
        titre: record.fields['Titre'] || 'Titre non disponible',
        marque: Array.isArray(record.fields['Marque']) ? record.fields['Marque'][0] : record.fields['Marque'],
        modele: Array.isArray(record.fields['Modèle']) ? record.fields['Modèle'][0] : record.fields['Modèle'],
        annee: record.fields['Année'],
        boite: record.fields['Boîte'] || "",
        prix: record.fields['Prix'],
        image: record.fields['Image'] ? record.fields['Image'][0].url : 'images/placeholder.jpg'
      };
    });
    displayAnnonces(annonces); // Afficher les annonces initialement
  }

  // Charger les marques et remplir le filtre des marques
  async function loadBrands() {
    const records = await fetchData(apiUrlMarques);
    marquesList = [...new Set(records.map(marque => marque.fields['Nom de la Marque']))].sort();
    
    brandSelect.innerHTML = '<option value="">-- Choisir une marque --</option>';
    marquesList.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand;
      option.textContent = brand;
      brandSelect.appendChild(option);
    });

    // Charger les modèles lorsque la marque est sélectionnée
    brandSelect.addEventListener('change', loadModels);
  }

  // Charger les modèles en fonction de la marque sélectionnée
  async function loadModels() {
    const selectedBrand = brandSelect.value;
    modelSelect.disabled = true;

    if (selectedBrand) {
      const records = await fetchData(apiUrlModeles);
      modelesList = records.filter(model => model.fields['Marque Associée'] === selectedBrand)
                           .map(model => model.fields['Nom du Modèle'])
                           .sort();

      modelSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';
      modelesList.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });

      modelSelect.disabled = modelesList.length === 0;
    } else {
      modelSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';
      modelSelect.disabled = true;
    }
  }

  // Appliquer les filtres aux annonces déjà récupérées
  filterButton.addEventListener('click', function (event) {
    event.preventDefault();
    applyFilters();
  });

  // Fonction pour appliquer les filtres localement
  function applyFilters() {
    const selectedBrand = brandSelect.value.trim();
    const selectedModel = modelSelect.value.trim();
    const selectedGearbox = gearboxSelect.value.trim();
    const maxPrice = parseFloat(priceInput.value);

    console.log('Filtres sélectionnés :', {
      selectedBrand,
      selectedModel,
      selectedGearbox,
      maxPrice
    });

    // Filtrer les annonces en fonction des critères sélectionnés
    const filteredAnnonces = annonces.filter(annonce => {
      const matchesBrand = selectedBrand ? annonce.marque === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.modele === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.boite.toLowerCase() === selectedGearbox.toLowerCase() : true;
      const matchesPrice = !isNaN(maxPrice) ? annonce.prix <= maxPrice : true;

      return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
    });

    console.log('Annonces filtrées :', filteredAnnonces);
    displayAnnonces(filteredAnnonces);
  }

  // Fonction pour afficher les annonces
  function displayAnnonces(data) {
    annoncesDiv.innerHTML = '';
    if (data.length > 0) {
      data.forEach(annonce => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
          <img src="${annonce.image}" alt="${annonce.modele}" onerror="this.src='images/placeholder.jpg';" />
          <h3>${annonce.titre}</h3>
          <p>Année : ${annonce.annee}</p>
          <p>Boîte : ${annonce.boite}</p>
          <p>Prix : ${typeof annonce.prix === 'number' ? annonce.prix.toLocaleString() : 'Prix non disponible'} €</p>
        `;
        annoncesDiv.appendChild(card);
      });
    } else {
      annoncesDiv.innerHTML = '<p>Aucune annonce ne correspond à vos critères.</p>';
    }
  }

  // Charger les annonces et les marques au démarrage
  await fetchAnnonces();
  await loadBrands();
});
