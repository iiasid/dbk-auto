document.addEventListener('DOMContentLoaded', function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  // Jeton d'accès personnel Airtable et URL statique pour vérifier le problème
  const apiKey = 'patvWkfPXlYuM1jjN.cfb1c14a851bf57bd07ab645882e6362d9a88c833608abe53faffd1ddd6f1e44';
  const apiUrl = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Annonces`; // URL complète avec baseId et tableName

  let annonces = [];

  // Fonction pour récupérer les données depuis Airtable
  async function fetchAnnonces() {
    try {
      console.log('Tentative de récupération des annonces depuis Airtable...');
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      console.log('Réponse reçue :', response);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Données récupérées depuis Airtable :', data);
      
      annonces = data.records.map(record => {
        return {
          id: record.id,
          marque: record.fields.Marque ? record.fields.Marque.toLowerCase().trim() : "",
          modele: record.fields.Modèle ? record.fields.Modèle.toLowerCase().trim() : "",
          annee: record.fields.Année,
          boite: record.fields.Boîte ? record.fields.Boîte.toLowerCase().trim() : "",
          prix: record.fields.Prix,
          image: record.fields.Image ? record.fields.Image[0].url : 'images/placeholder.jpg'
        };
      });

      console.log('Annonces après traitement :', annonces);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces depuis Airtable :', error);
      annoncesDiv.innerHTML = '<p>Erreur lors du chargement des annonces. Veuillez réessayer plus tard.</p>';
    }
  }

  // Activer le filtre des modèles en fonction de la marque sélectionnée
  brandSelect.addEventListener('change', function () {
    const selectedBrand = brandSelect.value.toLowerCase().trim();
    console.log('Marque sélectionnée :', selectedBrand);

    // Vider la liste des modèles précédents
    modelSelect.innerHTML = '';

    // Filtrer les annonces pour obtenir les modèles disponibles pour la marque sélectionnée
    const models = annonces
      .filter(annonce => annonce.marque === selectedBrand)
      .map(annonce => annonce.modele);

    // Supprimer les doublons et trier les modèles
    const uniqueModels = [...new Set(models)].sort();

    // Ajouter une option vide par défaut
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Choisir un modèle';
    modelSelect.appendChild(defaultOption);

    // Ajouter les modèles à la liste déroulante
    uniqueModels.forEach(model => {
      const option = document.createElement('option');
      option.value = model;
      option.textContent = model.charAt(0).toUpperCase() + model.slice(1);
      modelSelect.appendChild(option);
    });

    // Activer le filtre des modèles
    modelSelect.disabled = uniqueModels.length === 0;
    console.log('Modèles disponibles mis à jour :', uniqueModels);
  });

  // Événement pour appliquer les filtres et afficher les annonces filtrées
  filterButton.addEventListener('click', async function (event) {
    event.preventDefault(); // Empêche la page de se rafraîchir automatiquement
    console.log('Bouton "Appliquer les filtres" cliqué');

    await fetchAnnonces(); // Assurez-vous de récupérer les annonces avant de filtrer

    const selectedBrand = brandSelect.value.toLowerCase().trim();
    const selectedModel = modelSelect.value.toLowerCase().trim();
    const selectedGearbox = gearboxSelect.value.toLowerCase().trim();
    const maxPrice = parseFloat(priceInput.value);

    // Filtrer les annonces selon les critères sélectionnés
    const filteredAnnonces = annonces.filter(annonce => {
      const matchesBrand = selectedBrand ? annonce.marque === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.modele === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.boite === selectedGearbox : true;
      const matchesPrice = !isNaN(maxPrice) ? annonce.prix <= maxPrice : true;

      return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
    });

    console.log('Annonces filtrées :', filteredAnnonces);
    displayAnnonces(filteredAnnonces);
  });

  // Fonction pour afficher les annonces
  function displayAnnonces(data) {
    annoncesDiv.innerHTML = ''; // Vider les annonces précédentes
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
