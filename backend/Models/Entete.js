
const mongoose = require('mongoose');

const enteteSchema = new mongoose.Schema({
    typeDocument: { type: String, required: true, enum: ['facture', 'devis', 'bon_commande', 'bon_livraison'] },
    numero: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    totalHT: { type: Number, required: true },
    totalTTC: { type: Number, required: true },
    statut: { type: String, required: true, enum: ['en_attente', 'valide', 'annule'] },
    paiement: { type: String, enum: ['payé', 'impayé'], default: 'impayé' },
    lignes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ligne' }]  // Ajout des lignes
}, { timestamps: true });

module.exports = mongoose.model('Entete', enteteSchema);