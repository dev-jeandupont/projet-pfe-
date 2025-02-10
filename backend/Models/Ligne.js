// models/Ligne.js
const mongoose = require('mongoose');

const ligneSchema = new mongoose.Schema({
    entete: { type: mongoose.Schema.Types.ObjectId, ref: 'Entete', required: true },
    description: { type: String, required: true },
    quantite: { type: Number, required: true },
    prixUnitaire: { type: Number, required: true },
    remise : { type: Number, required: true },
    taxe : { type: Number, required: true },
    totalLigne: { type: Number, required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },  // Référence à Article
}, { timestamps: true });

module.exports = mongoose.model('Ligne', ligneSchema);
