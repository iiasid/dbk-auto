document.addEventListener('DOMContentLoaded', function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  // Jeton d'accès personnel Airtable et ID de la base
  const apiKey = 'patLyS8zsrdPL46Q4.1d111902f9b96763a3f74e5c3aaa07003672b80e67486965609cfa02e741fdb3';
  const baseId = 'appXXXXXXXXXXXXXXXX'; // Remplacez par l'ID de votre base Airtable
  const tableName = 'Cars'; // Nom de la table dans Airtable
  const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  let annonces = [];

  // Fonction pour récupérer les données depuis Airtable
  async function fetchAnnonces() {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      annonces = data.records.map(record => {
        return {
          id: record.id,
          marque: record.fields.Marque.toLowerCase(),
          modele: record.fields.Modèle.toLowerCase(),
          annee: record.fields.Année,
          boite: record.fields.Boîte.toLowerCase(),
          prix: record.fields.Prix,
          image: record.fields.Image ? record.fields.Image[0].url : 'images/placeholder.jpg'
        };
      });
      console.log('Annonces récupérées depuis Airtable :', annonces);
    } catch (error) {
      console.error('Erreur lors du chargement des annonces depuis Airtable :', error);
      annoncesDiv.innerHTML = '<p>Erreur lors du chargement des annonces. Veuillez réessayer plus tard.</p>';
    }
  }

  // Événement pour appliquer les filtres et afficher les annonces filtrées
  filterButton.addEventListener('click', async function (event) {
    event.preventDefault(); // Empêche la page de se rafraîchir automatiquement
    console.log('Bouton "Appliquer les filtres" cliqué');

    await fetchAnnonces(); // Assurez-vous de récupérer les annonces avant de filtrer

    const selectedBrand = brandSelect.value.toLowerCase();
    const selectedModel = modelSelect.value.toLowerCase();
    const selectedGearbox = gearboxSelect.value.toLowerCase();
    const maxPrice = parseFloat(priceInput.value);

    // Filtrer les annonces selon les critères sélectionnés
    const filteredAnnonces = annonces.filter(annonce => {
      const matchesBrand = selectedBrand ? annonce.marque === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.modele === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.boite === selectedGearbox : true;
      const matchesPrice = !isNaN(maxPrice) ? annonce.prix <= maxPrice : true;

      return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
    });

    console.log('Annonces filtrées :', filteredAnnonces); // Log pour vérifier les annonces filtrées
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
