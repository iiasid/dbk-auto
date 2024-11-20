// Dictionnaire des modèles pour chaque marque
const brandToModels = {
  toyota: ["Yaris", "Corolla", "RAV4", "C-HR", "Aygo", "Camry", "Land Cruiser", "Supra", "Prius", "Avensis"],
  renault: ["Clio", "Twingo", "Express", "Megane", "Scenic", "Kangoo", "Kadjar", "Captur", "Laguna", "Zoe"],
  peugeot: ["208", "308", "3008", "5008", "508", "2008", "Partner", "Traveller", "Rifter", "Expert"],
  citroen: ["C1", "C3", "C4", "C5", "Berlingo", "Jumpy", "SpaceTourer", "E-Mehari", "Ami", "DS3"],
  volkswagen: ["Golf", "Polo", "Passat", "Tiguan", "T-Roc", "Arteon", "Touran", "Caddy", "Up", "Touareg"],
  bmw: ["X1", "X2", "X3", "X4", "X5", "3 Series", "5 Series", "7 Series", "Z4", "i3"],
  mercedes: ["C220", "A-Class", "B-Class", "E-Class", "S-Class", "CLA", "GLA", "GLC", "GLE", "GLS"],
  audi: ["A1", "A3", "A4", "A6", "Q2", "Q3", "Q5", "Q7", "Q8", "TT"],
  ford: ["Fiesta", "Focus", "Kuga", "Puma", "Mondeo", "Mustang", "Ranger", "Explorer", "Galaxy", "EcoSport"],
  nissan: ["Micra", "Qashqai", "Juke", "X-Trail", "Navara", "Leaf", "350Z", "370Z", "Note", "Pathfinder"]
};

// Fonction pour mettre à jour la liste des modèles en fonction de la marque
document.getElementById('brand').addEventListener('change', (e) => {
  const modelsDropdown = document.getElementById('model');
  const selectedBrand = e.target.value;

  // Vider le modèle actuel
  modelsDropdown.innerHTML = '<option value="">-- Choisir un modèle --</option>';

  // Si une marque est choisie, on ajoute les modèles correspondants
  if (selectedBrand && brandToModels[selectedBrand]) {
    brandToModels[selectedBrand].forEach(model => {
      const option = document.createElement('option');
      option.value = model.toLowerCase();
      option.textContent = model;
      modelsDropdown.appendChild(option);
    });

    // Afficher la section de sélection du modèle
    modelsDropdown.disabled = false;
  } else {
    modelsDropdown.disabled = true;
  }
});

// Fonction pour charger les annonces et appliquer les filtres
fetch('annonces.json')
  .then(response => response.json())
  .then(data => {
    const annoncesContainer = document.getElementById('annonces');
    const filterButton = document.getElementById('filter-btn');

    // Fonction pour afficher les annonces filtrées
    const renderAnnonces = (filteredData) => {
      annoncesContainer.innerHTML = '';
      filteredData.forEach(annonce => {
        const annonceDiv = document.createElement('div');
        annonceDiv.classList.add('car');
        annonceDiv.innerHTML = `
          <img src="${annonce.image}" alt="${annonce.marque} ${annonce.modele}">
          <h3>${annonce.marque} ${annonce.modele}</h3>
          <p>Année : ${annonce.annee}</p>
          <p>Boîte : ${annonce.boite}</p>
          <p>Prix : ${annonce.prix.toLocaleString()} €</p>
        `;
        annoncesContainer.appendChild(annonceDiv);
      });
    };

    // Appliquer les filtres lors de l'appui sur le bouton
    filterButton.addEventListener('click', () => {
      const brand = document.getElementById('brand').value.toLowerCase();
      const model = document.getElementById('model').value.toLowerCase();
      const gearbox = document.getElementById('gearbox').value.toLowerCase();
      const maxPrice = document.getElementById('price').value;

      const filteredData = data.filter(annonce => {
        const matchesBrand = !brand || annonce.marque.toLowerCase() === brand;
        const matchesModel = !model || annonce.modele.toLowerCase() === model;
        const matchesGearbox = !gearbox || annonce.boite.toLowerCase() === gearbox;
        const matchesPrice = !maxPrice || annonce.prix <= maxPrice;

        return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
      });

      renderAnnonces(filteredData);
    });

    // Charger les annonces initiales (sans filtre)
    renderAnnonces(data);
  })
  .catch(error => console.error('Erreur lors du chargement des annonces :', error));
