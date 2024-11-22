document.addEventListener('DOMContentLoaded', function () {
  const brandSelect = document.getElementById('brand');
  const modelSelect = document.getElementById('model');
  const gearboxSelect = document.getElementById('gearbox');
  const priceInput = document.getElementById('price');
  const filterButton = document.getElementById('filter-btn');
  const annoncesDiv = document.getElementById('annonces');

  const apiKey = 'patvWkfPXlYuM1jjN.cfb1c14a851bf57bd07ab645882e6362d9a88c833608abe53faffd1ddd6f1e44';
  const baseId = 'apprRBKlK2tlPjFa4';
  const marquesUrl = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Marques`;
  const modelesUrl = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Modèles`;
  const annoncesUrl = `https://api.airtable.com/v0/apprRBKlK2tlPjFa4/Annonces`;

  let annonces = [];

  async function fetchData(url) {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer patvWkfPXlYuM1jjN.cfb1c14a851bf57bd07ab645882e6362d9a88c833608abe53faffd1ddd6f1e44`
        }
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.records;
    } catch (error) {
      console.error('Erreur lors du chargement des données depuis Airtable :', error);
      return [];
    }
  }

  async function loadBrands() {
    const marques = await fetchData(marquesUrl);
    brandSelect.innerHTML = '<option value="">Toutes les marques</option>';
    marques.forEach(marque => {
      const option = document.createElement('option');
      option.value = marque.fields['Nom de la Marque'].toLowerCase();
      option.textContent = marque.fields['Nom de la Marque'];
      brandSelect.appendChild(option);
    });
  }

  async function loadModels(brand = '') {
    const modeles = await fetchData(modelesUrl);
    modelSelect.innerHTML = '<option value="">Tous les modèles</option>';
    const filteredModels = brand
      ? modeles.filter(modele => modele.fields['Marque Associée'].toLowerCase() === brand)
      : modeles;

    filteredModels.forEach(modele => {
      const option = document.createElement('option');
      option.value = modele.fields['Nom du Modèle'].toLowerCase();
      option.textContent = modele.fields['Nom du Modèle'];
      modelSelect.appendChild(option);
    });

    modelSelect.disabled = filteredModels.length === 0;
  }

  async function loadAnnonces() {
    annonces = await fetchData(annoncesUrl);
  }

  function displayAnnonces(data) {
    annoncesDiv.innerHTML = '';
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

  filterButton.addEventListener('click', function (event) {
    event.preventDefault();
    const selectedBrand = brandSelect.value.toLowerCase().trim();
    const selectedModel = modelSelect.value.toLowerCase().trim();
    const selectedGearbox = gearboxSelect.value.toLowerCase().trim();
    const maxPrice = parseFloat(priceInput.value);

    const filteredAnnonces = annonces.filter(annonce => {
      const matchesBrand = selectedBrand ? annonce.fields.Marque.toLowerCase() === selectedBrand : true;
      const matchesModel = selectedModel ? annonce.fields.Modèle.toLowerCase() === selectedModel : true;
      const matchesGearbox = selectedGearbox ? annonce.fields.Boîte.toLowerCase() === selectedGearbox : true;
      const matchesPrice = !isNaN(maxPrice) ? annonce.fields.Prix <= maxPrice : true;
      return matchesBrand && matchesModel && matchesGearbox && matchesPrice;
    });

    displayAnnonces(filteredAnnonces);
  });

  loadBrands();
  loadModels();
  loadAnnonces();

  brandSelect.addEventListener('change', function () {
    const selectedBrand = brandSelect.value.toLowerCase().trim();
    loadModels(selectedBrand);
  });
});
