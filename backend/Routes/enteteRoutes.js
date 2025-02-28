const express = require('express');
const router = express.Router();
const enteteController = require('../Controllers/enteteController'); 

// Créer un devis
router.post('/devis', enteteController.createDevis);

// Consulter tous les devis
router.get('/devis', enteteController.getDevis);

// Transformer un devis en bon de commande
router.post('/devis/:id/transform-to-bc', enteteController.transformDevisToBonCommande);

// Transformer un devis en bon de livraison
router.post('/devis/:id/transform-to-bl', enteteController.transformDevisToBonLivraison);

// Transformer un bon de commande en facture
router.post('/bc/:id/transform-to-facture', enteteController.transformBonCommandeToFacture);

// Consulter toutes les factures
router.get('/factures', enteteController.getFactures);

// Consulter les documents par type (Devis, BC, BL, Facture)
router.get('/documents', enteteController.getDocuments);

// Créer un bon de commande manuellement
router.post('/bc', enteteController.createBC);

// Consulter tous les bons de commande
router.get('/bc', enteteController.getBC);

// Créer un bon de livraison manuellement
router.post('/bl', enteteController.createBL);

// Consulter tous les bons de livraison
router.get('/bl', enteteController.getBL);

module.exports = router;