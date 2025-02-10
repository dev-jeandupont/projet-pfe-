const express = require('express');
const router = express.Router();
const enteteController = require('../Controllers/enteteController');

// Route pour créer une nouvelle entête
router.post('/creer', enteteController.createEntete);

// Route pour obtenir toutes les entêtes
router.get('/', enteteController.getEntetes);

// Route pour obtenir une entête spécifique par son ID
router.get('/:id', enteteController.getEnteteById);

// Route pour mettre à jour une entête spécifique
router.put('/:id', enteteController.updateEntete);

// Route pour supprimer une entête spécifique
router.delete('/:id', enteteController.deleteEntete);

module.exports = router;
