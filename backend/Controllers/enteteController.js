const Entete = require('../Models/Entete');

// Créer une nouvelle entête
exports.createEntete = async (req, res) => {
    try {
        const entete = new Entete(req.body);
        await entete.save();
        res.status(201).send(entete);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Obtenir toutes les entêtes
exports.getEntetes = async (req, res) => {
    try {
        const entetes = await Entete.find().populate('client');
        res.status(200).send(entetes);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Obtenir une entête par ID
exports.getEnteteById = async (req, res) => {
    try {
        const entete = await Entete.findById(req.params.id).populate('client');
        if (!entete) {
            return res.status(404).send();
        }
        res.status(200).send(entete);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Mettre à jour une entête
exports.updateEntete = async (req, res) => {
    try {
        const entete = await Entete.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!entete) {
            return res.status(404).send();
        }
        res.status(200).send(entete);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Supprimer une entête
exports.deleteEntete = async (req, res) => {
    try {
        const entete = await Entete.findByIdAndDelete(req.params.id);
        if (!entete) {
            return res.status(404).send();
        }
        res.status(200).send(entete);
    } catch (error) {
        res.status(500).send(error);
    }
};