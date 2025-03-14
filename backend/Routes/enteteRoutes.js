const express = require("express");
const router = express.Router();
const enteteController = require("../Controllers/enteteController");

// Créer un devis
router.post("/devis", enteteController.create);

// Transformer un devis en bon de commande

// Transformer un devis en bon de livraison

//  Transformer un bon de commande en facture

//  Consulter tous les documents par type
router.get("", enteteController.getDocuments);

//  Voir les détails d’un document
router.get("/:id", enteteController.getDocumentById);

//  Éditer un document

// Supprimer un document
router.delete("/:id", enteteController.deleteDocument);

// Télécharger un document en PDF
router.get("/:id/pdf", enteteController.downloadDocumentPDF);
router.put("/devis", enteteController.updateDocument);
module.exports = router;
