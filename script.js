document.addEventListener('DOMContentLoaded', function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  // Les annonces intégrées directement dans le code JavaScript
  const annonces = [
    {
      "id": 1,
      "marque": "toyota",
      "modele": "Yaris",
      "annee": 2009,
      "boite": "manuelle",
      "prix": 6000,
      "image": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Toyota_Yaris_Hybrid_Premiere_Edition.jpg"
    },
    {
      "id": 2,
      "marque": "bmw",
      "modele": "X2",
      "annee": 2020,
      "boite": "automatique",
      "prix": 35000,
      "image": "https://upload.wikimedia.org/wikipedia/commons/f/f8/BMW_X2_M35i_%28F39%29_IMG_2178.jpg"
    },
    {
      "id": 3,
      "marque": "renault",
      "modele": "Twingo",
      "annee": 2018,
      "boite": "manuelle",
      "prix": 9000,
      "image": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Renault_Twingo_III_Zen_%E2%80%93_Frontansicht%2C_17._M%C3%A4rz_2014%2C_D%C3%BCsseldorf.jpg"
    },
    {
      "id": 4,
      "marque": "mercedes",
      "modele": "C220",
      "annee": 2009,
      "boite": "automatique",
      "prix": 24300,
      "image": "https://upload.wikimedia.org/wikipedia/commons/8/85/2011_Mercedes-Benz_C_220_CDI_Sport_Edition_%28W_204%29_sedan_%282011-10-28%29_01.jpg"
    },
    {
      "id": 5,
      "marque": "renault",
      "modele": "Express",
      "annee": 1990,
      "boite": "manuelle",
      "prix": 1500,
      "image": "https://upload.wikimedia.org/wikipedia/commons/3/38/Renault_Express_rear_20081120.jpg"
    }
  ];

  // Événement pour appliquer les filtres et afficher les annonces filtrées
  filterButton.addEventListener('click', function (event) {
    event.preventDefault(); // Empêche la page de se rafraîchir automatiquement
    console.log('Bouton "Appliquer les filtres" cliqué'); // Log pour vérifier que le clic est bien détecté

    const selectedBrand = brandSelect.value.toLowerCase();
    const selectedModel = modelSelect.value.toLowerCase();
    const selectedGearbox = gearboxSelect.value.toLowerCase();
    const maxPrice = parseFloat(priceInput.value);

    // Filtrer les annonces selon les critères sélectionnés
    const filteredAnnonces = annonces.filter(annonce => {
      const matchesBrand = selectedBrand ? annonce.marque === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.modele.toLowerCase() === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.boite.toLowerCase() === selectedGearbox : true;
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
