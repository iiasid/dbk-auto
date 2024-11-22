document.addEventListener('DOMContentLoaded', async function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  // Jeton d'accès personnel Airtable et URL statique
  const apiKey = 'patvWkfPXlYuM1jjN.cfb1c14a851bf57bd07ab645882e6362d9a88c833608abe53faffd1ddd6f1e44';
  const apiUrlAnnonces = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Annonces`;
  const apiUrlMarques = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Marques`;
  const apiUrlModeles = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Modèles`;

  let annonces = [];
  let marques = [];
  let modeles = [];

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
    annonces = await fetchData(apiUrlAnnonces);
    annonces = annonces.map(record => {
      let titre = record.fields['Titre'] || 'Titre non disponible';

      return {
        id: record.id,
        titre: titre,
        marque: record.fields['Marque'] ? record.fields['Marque'][0] : "",
        modele: record.fields['Modèle'] ? record.fields['Modèle'][0] : "",
        annee: record.fields['Année'],
        boite: record.fields['Boîte'] ? record.fields['Boîte'].toLowerCase().trim() : "",
        prix: record.fields['Prix'],
        image: record.fields['Image'] ? record.fields['Image'][0].url : 'images/placeholder.jpg'
      };
    });

    displayAnnonces(annonces);
  }

  // Charger les marques et remplir le filtre des marques
  async function loadBrands() {
    marques = await fetchData(apiUrlMarques);
    // Extraire les noms de marques uniques
    const uniqueMarques = [...new Set(marques.map(marque => marque.fields['Nom de la Marque']))].sort();

    // Vider les options précédentes
    brandSelect.innerHTML = '<option value="">-- Choisir une marque --</option>';

    // Ajouter les marques à la liste déroulante
    uniqueMarques.forEach(brand => {
      const option = document.createElement('option');
      option.value = brand.toLowerCase().trim();
      option.textContent = brand;
      brandSelect.appendChild(option);
    });

    // Ajouter l'événement pour mettre à jour les modèles
    brandSelect.addEventListener('change', loadModels);
  }

  // Charger les modèles en fonction de la marque sélectionnée
  async function loadModels() {
    const selectedBrand = brandSelect.value.toLowerCase().trim();
    console.log('Marque sélectionnée :', selectedBrand);

    if (selectedBrand) {
      modeles = await fetchData(apiUrlModeles);
      // Filtrer les modèles pour la marque sélectionnée
      const filteredModeles = modeles.filter(model => model.fields['Marque Associée'].toLowerCase().trim() === selectedBrand);
      const uniqueModels = [...new Set(filteredModeles.map(model => model.fields['Nom du Modèle']))].sort();

      // Vider la liste des modèles précédents
      modelSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';

      // Ajouter les modèles à la liste déroulante
      uniqueModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.toLowerCase().trim();
        option.textContent = model;
        modelSelect.appendChild(option);
      });

      // Activer le filtre des modèles s'il y a des modèles disponibles
      modelSelect.disabled = uniqueModels.length === 0;
    } else {
      // Si aucune marque n'est sélectionnée, désactiver le filtre des modèles
      modelSelect.disabled = true;
      modelSelect.innerHTML = '<option value="">-- Choisir un modèle --</option>';
    }
  }

  // Charger les annonces une seule fois au démarrage
  await fetchAnnonces();
  
  // Charger les marques une fois les annonces chargées
  await loadBrands();

  // Appliquer les filtres localement sur les annonces déjà récupérées
  filterButton.addEventListener('click', function (event) {
    event.preventDefault();
    console.log('Bouton "Appliquer les filtres" cliqué');

    // Appliquer les filtres sans recharger les données depuis Airtable
    applyFilters();
  });

  // Fonction pour appliquer les filtres localement
  function applyFilters() {
    const selectedBrand = brandSelect.value.toLowerCase().trim();
    const selectedModel = modelSelect.value.toLowerCase().trim();
    const selectedGearbox = gearboxSelect.value.toLowerCase().trim();
    const maxPrice = parseFloat(priceInput.value);

    // Filtrer les annonces en fonction des critères sélectionnés
    const filteredAnnonces = annonces.filter(annonce => {
      const matchesBrand = selectedBrand ? annonce.marque.toLowerCase().trim() === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.modele.toLowerCase().trim() === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.boite === selectedGearbox : true;
      const matchesPrice = !isNaN(maxPrice) ? annonce.prix <= maxPrice : true;

      return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
    });

    console.log('Annonces filtrées :', filteredAnnonces);
    displayAnnonces(filteredAnnonces);
  }

  // Fonction pour afficher les annonces
  function displayAnnonces(data) {
    annoncesDiv.innerHTML = ''; // Vider les annonces précédentes
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
});
