const express = require('express');
const router = express.Router();
const enteteController = require('../Controllers/enteteController'); 


router.get("/last-number", enteteController.getLastNumber);
// Créer un devis
router.post('/devis', enteteController.create);

// Transformer un devis en bon de commande
router.post('/devis/:id/transform-to-bc', enteteController.transformDevisToBonCommande);

// Transformer un devis en bon de livraison
router.post('/devis/:id/transform-to-bl', enteteController.transformDevisToBonLivraison);

//  Transformer un bon de commande en facture
router.post('/bc/:id/transform-to-facture', enteteController.transformBonCommandeToFacture);

//  Consulter tous les documents par type
router.get('', enteteController.getDocuments);

//  Voir les détails d’un document
router.get('/:id', enteteController.getDocumentById);

//  Éditer un document
router.put('/:id', enteteController.updateDocument);

// Supprimer un document
router.delete('/:id', enteteController.deleteDocument);

// Télécharger un document en PDF
router.get('/:id/pdf', enteteController.downloadDocumentPDF);

module.exports = router;
