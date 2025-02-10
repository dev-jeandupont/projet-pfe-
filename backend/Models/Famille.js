const mongoose = require('mongoose');

// Définition du schéma pour Famille
const FamilleSchema = new mongoose.Schema({
    codeFamille: {
        type: String,
        required: true,
        unique: true, 
      },
      designationFamille: {
        type: String,
        required: true,
      },
});

// Création du modèle Famille
const Famille = mongoose.model('Famille', FamilleSchema);

module.exports = Famille;
