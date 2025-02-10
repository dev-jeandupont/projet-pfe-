const Ligne = require('../Models/Ligne');
const Entete = require('../Models/Entete');

exports.addLigne = async (req, res) => {
    try {
        const { enteteId, description, quantite, prixUnitaire, article } = req.body;
        const totalLigne = quantite * prixUnitaire;

        const nouvelleLigne = new Ligne({
            entete: enteteId,
            description,
            quantite,
            prixUnitaire,
            totalLigne,
            article
        });

        // Sauvegarder la nouvelle ligne
        const ligneSauvegardee = await nouvelleLigne.save();

        // Ajouter la ligne au document concerné
        await Entete.findByIdAndUpdate(enteteId, { $push: { lignes: ligneSauvegardee._id } });

        // Recalculer le total HT et TTC de l'entête
        const entete = await Entete.findById(enteteId).populate('lignes');
        const totalHT = entete.lignes.reduce((sum, ligne) => sum + ligne.totalLigne, 0);
        const totalTTC = totalHT * 1.2; // Appliquons une TVA de 20%

        // Mettre à jour l'entête avec les nouveaux totaux
        await Entete.findByIdAndUpdate(enteteId, { totalHT, totalTTC });

        res.status(201).json(ligneSauvegardee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLigne = async (req, res) => {
    try {
        const { ligneId } = req.params;
        const { description, quantite, prixUnitaire, article } = req.body;

        const ligne = await Ligne.findById(ligneId);
        if (!ligne) {
            return res.status(404).json({ message: "Ligne non trouvée" });
        }

        // Calculer le nouveau total pour la ligne
        const totalLigne = quantite * prixUnitaire;

        // Mettre à jour la ligne
        ligne.description = description || ligne.description;
        ligne.quantite = quantite || ligne.quantite;
        ligne.prixUnitaire = prixUnitaire || ligne.prixUnitaire;
        ligne.totalLigne = totalLigne;

        // Sauvegarder la ligne mise à jour
        const ligneMiseAJour = await ligne.save();

        // Recalculer les totaux dans l'entête
        const entete = await Entete.findById(ligne.entete).populate('lignes');
        const totalHT = entete.lignes.reduce((sum, ligne) => sum + ligne.totalLigne, 0);
        const totalTTC = totalHT * 1.2; // TVA de 20%

        // Mettre à jour l'entête
        await Entete.findByIdAndUpdate(ligne.entete, { totalHT, totalTTC });

        res.status(200).json(ligneMiseAJour);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteLigne = async (req, res) => {
    try {
        const { ligneId } = req.params;

        // Trouver la ligne à supprimer
        const ligne = await Ligne.findById(ligneId);
        if (!ligne) {
            return res.status(404).json({ message: "Ligne non trouvée" });
        }

        // Supprimer la ligne
        await Ligne.findByIdAndDelete(ligneId);

        // Enlever la ligne de l'entête
        await Entete.findByIdAndUpdate(ligne.entete, { $pull: { lignes: ligneId } });

        // Recalculer les totaux dans l'entête
        const entete = await Entete.findById(ligne.entete).populate('lignes');
        const totalHT = entete.lignes.reduce((sum, ligne) => sum + ligne.totalLigne, 0);
        const totalTTC = totalHT * 1.2; // TVA de 20%

        // Mettre à jour l'entête
        await Entete.findByIdAndUpdate(ligne.entete, { totalHT, totalTTC });

        res.status(200).json({ message: "Ligne supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLigne = async (req, res) => {
    try {
        const { ligneId } = req.params;

        // Trouver la ligne
        const ligne = await Ligne.findById(ligneId).populate('article');
        if (!ligne) {
            return res.status(404).json({ message: "Ligne non trouvée" });
        }

        res.status(200).json(ligne);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getLignesByEntete = async (req, res) => {
    try {
        const { enteteId } = req.params;

        // Trouver l'entête et peupler les lignes
        const entete = await Entete.findById(enteteId).populate('lignes');
        if (!entete) {
            return res.status(404).json({ message: "Entête non trouvée" });
        }

        res.status(200).json(entete.lignes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
