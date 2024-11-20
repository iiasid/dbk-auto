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

const annoncesUrl = 'annonces.json';

document.getElementById('brand').addEventListener('change', (e) => {
  const modelsDropdown = document.getElementById('model');
  const selectedBrand = e.target.value;
  
  modelsDropdown.innerHTML = '<option value="">-- Tous --</option>';
  
  if (selectedBrand && brandToModels[selectedBrand]) {
    brandToModels[selectedBrand].forEach(model => {
      modelsDropdown.innerHTML += `<option value="${model.toLowerCase()}">${model}</option>`;
    });
  }
});

fetch(annoncesUrl)
  .then(response => response.json())
  .then(data => {
    const annoncesContainer = document.getElementById('annonces');
    const filterButton = document.getElementById('filter-btn');

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

    renderAnnonces(data);

    filterButton.addEventListener('click', () => {
      const brand = document.getElementById('brand').value.toLowerCase();
      const model = document.getElementById('
