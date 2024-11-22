document.addEventListener('DOMContentLoaded', async function () {
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
        let marque = "";
        if (record.fields.Marque) {
          if (Array.isArray(record.fields.Marque) && record.fields.Marque.length > 0) {
            marque = record.fields.Marque[0].toLowerCase().trim();
          }
        }

        let modele = "";
        if (record.fields.Modèle) {
          if (Array.isArray(record.fields.Modèle) && record.fields.Modèle.length > 0) {
            modele = record.fields.Modèle[0].toLowerCase().trim();
          }
        }

        console.log(`Marque : ${marque}, Modèle : ${modele}`); // Log pour vérifier

        return {
          id: record.id,
          marque: marque,
          modele: modele,
          annee: record.fields.Année,
          boite: record.fields.Boîte ? record.fields.Boîte.toLowerCase().trim() : "",
          prix: record.fields.Prix,
          image: record.fields.Image ? record.fields.Image[0].url : 'images/placeholder.jpg'
        };
      });

      console.log('Annonces après traitement :', annonces);
      displayAnnonces(annonces); // Afficher toutes les annonces une première fois

    } catch (error) {
      console.error('Erreur lors du chargement des annonces depuis Airtable :', error);
      annoncesDiv.innerHTML = '<p>Erreur lors du chargement des annonces. Veuillez réessayer plus tard.</p>';
    }
  }

  // Charger les annonces une seule fois au démarrage
  await fetchAnnonces();

  // Appliquer les filtres sans recharger les annonces depuis Airtable
  filterButton.addEventListener('click', function (event) {
    event.preventDefault(); // Empêche la page de se rafraîchir automatiquement
    console.log('Bouton "Appliquer les filtres" cliqué');

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
          <h3>${annonce.marque ? annonce.marque.toUpperCase() : 'Marque inconnue'} ${annonce.modele ? annonce.modele : 'Modèle inconnu'}</h3>
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
