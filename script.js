document.addEventListener('DOMContentLoaded', async function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  // Jeton d'accès personnel Airtable et URL statique
  const apiKey = 'patvWkfPXlYuM1jjN.cfb1c14a851bf57bd07ab645882e6362d9a88c833608abe53faffd1ddd6f1e44';
  const apiUrl = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Annonces`;

  let annonces = [];

  // Fonction pour récupérer les annonces d'Airtable
  async function fetchAnnonces() {
    try {
      console.log('Tentative de récupération des annonces depuis Airtable...');
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Données récupérées depuis Airtable :', data);

      annonces = data.records.map(record => {
        let titre = "";
        if (record.fields.Titre) {
          titre = record.fields.Titre; // Utilisation du titre calculé directement
        }

        return {
          id: record.id,
          titre: titre,
          marque: record.fields.Marque ? (Array.isArray(record.fields.Marque) ? record.fields.Marque[0].toLowerCase().trim() : record.fields.Marque.toLowerCase().trim()) : "",
          modele: record.fields.Modèle ? (Array.isArray(record.fields.Modèle) ? record.fields.Modèle[0].toLowerCase().trim() : record.fields.Modèle.toLowerCase().trim()) : "",
          annee: record.fields.Année,
          boite: record.fields.Boîte ? record.fields.Boîte.toLowerCase().trim() : "",
          prix: record.fields.Prix,
          image: record.fields.Image ? record.fields.Image[0].url : 'images/placeholder.jpg'
        };
      });

      console.log('Annonces après traitement :', annonces);
      displayAnnonces(annonces); // Afficher toutes les annonces initialement

    } catch (error) {
      console.error('Erreur lors du chargement des annonces depuis Airtable :', error);
      annoncesDiv.innerHTML = '<p>Erreur lors du chargement des annonces. Veuillez réessayer plus tard.</p>';
    }
  }

  // Charger les annonces une seule fois au démarrage
  await fetchAnnonces();

  // Appliquer les filtres localement sur les annonces déjà récupérées
  filterButton.addEventListener('click', function (event) {
    event.preventDefault();
    console.log('Bouton "Appliquer les filtres" cliqué');

    const selectedBrand = brandSelect.value.toLowerCase().trim();
    const selectedModel = modelSelect.value.toLowerCase().trim();
    const selectedGearbox = gearboxSelect.value.toLowerCase().trim();
    const maxPrice = parseFloat(priceInput.value);

    // Filtrer les annonces en fonction des critères sélectionnés
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
          <h3>${annonce.titre ? annonce.titre : 'Titre non disponible'}</h3>
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
