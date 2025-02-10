const express = require('express');
const router = express.Router();
const ligneController = require('../Controllers/ligneController');

// Route pour ajouter une ligne
router.post('/ajouter', ligneController.addLigne);

// Route pour mettre à jour une ligne existante
router.put('/mettre-a-jour/:ligneId', ligneController.updateLigne);

// Route pour supprimer une ligne
router.delete('/supprimer/:ligneId', ligneController.deleteLigne);

// Route pour récupérer une ligne spécifique par son ID
router.get('/details/:ligneId', ligneController.getLigne);

// Route pour récupérer toutes les lignes d'un document (entête) spécifique
router.get('/par-entete/:enteteId', ligneController.getLignesByEntete);

module.exports = router;
