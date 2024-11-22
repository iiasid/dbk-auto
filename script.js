function displayAnnonces(data) {
  annoncesDiv.innerHTML = ''; // Vider les annonces précédentes
  if (data.length > 0) {
    data.forEach(annonce => {
      const marque = annonce.fields['Marque'];
      const modele = annonce.fields['Modèle'];
      const annee = annonce.fields['Année'];
      const boite = annonce.fields['Boîte'];
      const prix = annonce.fields['Prix'];
      const imageUrl = annonce.fields['Image'] ? annonce.fields['Image'][0].url : 'images/placeholder.jpg';

      // Vérifier que les valeurs existent et sont du bon type
      const marqueText = (typeof marque === 'string') ? marque.toUpperCase() : 'Marque inconnue';
      const modeleText = (typeof modele === 'string') ? modele : 'Modèle inconnu';

      if (marque && modele && annee && boite && prix) {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.innerHTML = `
          <img src="${imageUrl}" alt="${modeleText}" onerror="this.src='images/placeholder.jpg';" />
          <h3>${marqueText} ${modeleText}</h3>
          <p>Année : ${annee}</p>
          <p>Boîte : ${boite}</p>
          <p>Prix : ${prix.toLocaleString()} €</p>
        `;
        annoncesDiv.appendChild(card);
      } else {
        console.warn('Annonce manquante d\'informations nécessaires:', annonce);
      }
    });
  } else {
    annoncesDiv.innerHTML = '<p>Aucune annonce ne correspond à vos critères.</p>';
  }
}
