const mongoose = require('mongoose');

// Définition du schéma pour Categorie
const CategorieSchema = new mongoose.Schema({
    codeCategorie: {
        type: Number,
        required: true,
        unique: true
    },
    designationCategorie: {
        type: String,
        required: true
    }
});

// Création du modèle Categorie
const Categorie = mongoose.model('Categorie', CategorieSchema);

module.exports = Categorie;
