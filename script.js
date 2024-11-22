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

      let marque = "";
      if (record.fields['Marque']) {
        if (Array.isArray(record.fields['Marque']) && record.fields['Marque'].length > 0) {
          marque = record.fields['Marque'][0].toLowerCase().trim(); // Extraction correcte du champ lié
        } else if (typeof record.fields['Marque'] === 'string') {
          marque = record.fields['Marque'].toLowerCase().trim();
        }
      }

      let modele = "";
      if (record.fields['Modèle']) {
        if (Array.isArray(record.fields['Modèle']) && record.fields['Modèle'].length > 0) {
          modele = record.fields['Modèle'][0].toLowerCase().trim(); // Extraction correcte du champ lié
        } else if (typeof record.fields['Modèle'] === 'string') {
          modele = record.fields['Modèle'].toLowerCase().trim();
        }
      }

      return {
        id: record.id,
        titre: titre,
        marque: marque,
        modele: modele,
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
    // Extrair
