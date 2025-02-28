const Entete = require('../Models/Entete');
const Ligne = require('../Models/Ligne');


exports.create = async (req, res) => {
    const { client, referenceCommande, pointVente, typePaiement, commentaire, totalHT, totalTTC, lignes,type_achat,type_date } = req.body;

    try {
        const entete = new Entete({
            typeDocument: type_achat,
            numero: `${type_date}-${Date.now()}`,
            date: new Date(),
            client,
            referenceCommande,
            pointVente, 
            typePaiement,
            commentaire,
            totalHT,
            totalTTC,
        });

        const savedEntete = await entete.save();
        const savedLignes = await Promise.all(lignes.map(async (ligne) => {
            const newLigne = new Ligne({
                entete: savedEntete._id,
                article: ligne.article,
                famille: ligne.famille,
                libelleArticle: ligne.libelleArticle,
                quantite: ligne.quantite,
                prixHT: ligne.prixHT,
                remise: ligne.remise,
                tva: ligne.tva,
                prixTTC: ligne.prixTTC
            });

            return await newLigne.save();
        }));

        savedEntete.lignes = savedLignes.map(ligne => ligne._id);
        await savedEntete.save();

        res.status(201).json(savedEntete);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Consulter un devis
exports.getDevis = async (req, res) => {
    try {
        const devis = await Entete.find({ typeDocument: 'Devis' }).populate('client').populate({
            path: 'lignes',
            populate: {
                path: 'article',
                populate: {
                    path: 'libelleFamille' // Utilisation correcte du champ
                }
            }
        })
        ;
        res.status(200).json(devis);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Consulter toutes les factures
exports.getFactures = async (req, res) => {
    try {
        const factures = await Entete.find({ typeDocument: 'Facture' }).populate('client').populate('lignes');
        res.status(200).json(factures);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Transformer un devis en bon de commande
exports.transformDevisToBonCommande = async (req, res) => {
    try {
        const devis = await Entete.findById(req.params.id).populate('lignes');
        if (!devis || devis.typeDocument !== "Devis") {
            return res.status(404).json({ message: "Devis non trouvé" });
        }

        const bonCommande = new Entete({
            numero: `BC-${Date.now()}`,
            date: new Date(),
            client: devis.client,
            referenceCommande: devis.referenceCommande,
            pointVente: devis.pointVente,
            typePaiement: devis.typePaiement,
            commentaire: devis.commentaire,
            totalHT: devis.totalHT,
            totalTTC: devis.totalTTCz
        });

        const savedBC = await bonCommande.save();

        const newLignes = await Promise.all(devis.lignes.map(async (ligne) => {
            const newLigne = new Ligne({
                entete: savedBC._id,
                article: ligne.article,
                famille: ligne.famille,
                libelleArticle: ligne.libelleArticle,
                quantite: ligne.quantite,
                prixHT: ligne.prixHT,
                remise: ligne.remise,
                tva: ligne.tva,
                prixTTC: ligne.prixTTC
            });

            return await newLigne.save();
        }));

        savedBC.lignes = newLignes.map(ligne => ligne._id);
        await savedBC.save();

        res.status(200).json(savedBC);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

// Transformer un devis en bon de livraison
exports.transformDevisToBonLivraison = async (req, res) => {
    try {
        const devis = await Entete.findById(req.params.id).populate('lignes');
        if (!devis || devis.typeDocument !== "Devis") {
            return res.status(404).json({ message: "Devis non trouvé" });
        }

        const bonLivraison = new Entete({
            typeDocument: "Bon de Livraison",
            numero: `BL-${Date.now()}`,
            date: new Date(),
            client: devis.client,
            referenceCommande: devis.referenceCommande,
            pointVente: devis.pointVente,
            typePaiement: devis.typePaiement,
            commentaire: devis.commentaire,
            totalHT: devis.totalHT,
            totalTTC: devis.totalTTC
        });

        const savedBL = await bonLivraison.save();

        const newLignes = await Promise.all(devis.lignes.map(async (ligne) => {
            const newLigne = new Ligne({
                entete: savedBL._id,
                article: ligne.article,
                famille: ligne.famille,
                libelleArticle: ligne.libelleArticle,
                quantite: ligne.quantite,
                prixHT: ligne.prixHT,
                remise: ligne.remise,
                tva: ligne.tva,
                prixTTC: ligne.prixTTC
            });

            return await newLigne.save();
        }));

        savedBL.lignes = newLignes.map(ligne => ligne._id);
        await savedBL.save();

        res.status(200).json(savedBL);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Transformer un bon de commande en facture
exports.transformBonCommandeToFacture = async (req, res) => {
    try {
        const bonCommande = await Entete.findById(req.params.id).populate('lignes');
        if (!bonCommande || bonCommande.typeDocument !== "Bon de Commande") {
            return res.status(404).json({ message: "Bon de commande non trouvé" });
        }

        const facture = new Entete({
            typeDocument: "Facture",
            numero: `FACT-${Date.now()}`,
            date: new Date(),
            client: bonCommande.client,
            referenceCommande: bonCommande.referenceCommande,
            pointVente: bonCommande.pointVente,
            typePaiement: bonCommande.typePaiement,
            commentaire: bonCommande.commentaire,
            totalHT: bonCommande.totalHT,
            totalTTC: bonCommande.totalTTC
        });

        const savedFacture = await facture.save();

        const newLignes = await Promise.all(bonCommande.lignes.map(async (ligne) => {
            const newLigne = new Ligne({
                entete: savedFacture._id,
                article: ligne.article,
                famille: ligne.famille,
                libelleArticle: ligne.libelleArticle,
                quantite: ligne.quantite,
                prixHT: ligne.prixHT,
                remise: ligne.remise,
                tva: ligne.tva,
                prixTTC: ligne.prixTTC
            });

            return await newLigne.save();
        }));

        savedFacture.lignes = newLignes.map(ligne => ligne._id);
        await savedFacture.save();

        res.status(200).json(savedFacture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Consulter tous les documents par type
exports.getDocuments = async (req, res) => {
    const { type } = req.query;
    try {
        const documents = await Entete.find({ typeDocument: type }).populate('client').populate('lignes');
        res.status(200).json(documents);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Consulter les bons de commande
exports.getBC = async (req, res) => {
    try {
        const bcs = await Entete.find({ typeDocument: 'Bon de Commande' }).populate('client').populate('lignes');
        res.status(200).json(bcs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};



// Consulter les bons de livraison
exports.getBL = async (req, res) => {
    try {
        const bls = await Entete.find({ typeDocument: 'Bon de Livraison' }).populate('client').populate('lignes');
        res.status(200).json(bls);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
