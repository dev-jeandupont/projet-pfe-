import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const DocumentForm = () => {
  const navigate = useNavigate(); 

  const [numero, setNumero] = useState("");
  const [date, setDate] = useState("");
  const [client, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [typeDocument, setTypeDocument] = useState("facture");
  const [statut, setStatut] = useState("en_attente");
  const [lignes, setLignes] = useState([]);
  const [totalHT, setTotalHT] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [articles, setArticles] = useState([]); // Récupérer les articles

  useEffect(() => {
    // Récupérer les clients
    axios.get("http://localhost:5000/clients/All")
      .then(response => setClients(Array.isArray(response.data) ? response.data : []))
      .catch(error => console.error("Erreur de chargement des clients :", error));

    // Récupérer les articles
    axios.get("http://localhost:5000/articles/All")
      .then(response => setArticles(Array.isArray(response.data) ? response.data : []))
      .catch(error => console.error("Erreur de chargement des articles :", error));
  }, []);

  const ajouterLigne = () => {
    setLignes([...lignes, { description: "", quantite: 1, prixUnitaire: 0, remise: 0, taxe: 0, totalLigne: 0, article: "" }]);
  };

  const supprimerLigne = (index) => {
    const nouvellesLignes = lignes.filter((_, i) => i !== index);
    setLignes(nouvellesLignes);
    calculerTotal(nouvellesLignes);
  };

  const mettreAJourLigne = (index, key, value) => {
    const nouvellesLignes = [...lignes];
    nouvellesLignes[index][key] = value;
  
    // Si un article a été sélectionné, récupérer les informations de l'article
    if (key === "article") {
      const article = articles.find(a => a._id === value);
      if (article) {
        nouvellesLignes[index].prixUnitaire = article.prix_brut;  // Assigner le prix de l'article
        nouvellesLignes[index].libelleArticle = article.libelle;  // Ajouter le libellé de l'article
        nouvellesLignes[index].tva = article.tva || 20;    
        nouvellesLignes[index].codeArticle = article.code;        
        // Affecter la remise de l'article si aucune remise n'est définie pour la ligne
        if (nouvellesLignes[index].remise === 0 || nouvellesLignes[index].remise === "") {
          nouvellesLignes[index].remise = article.remise || 0;  // Remise par défaut de l'Article
        }
      }
    }
  
    const { quantite, prixUnitaire, remise, taxe } = nouvellesLignes[index];
  
    // Vérification des valeurs numériques
    if (isNaN(quantite) || isNaN(prixUnitaire) || isNaN(remise) || isNaN(taxe)) {
      console.error("Valeur incorrecte dans les champs quantite, prixUnitaire, remise ou taxe.");
      return;
    }
  
    // Calcul du total pour la ligne
    let total = quantite * prixUnitaire;
    total -= (total * remise) / 100;  // Appliquer la remise de la ligne
    total += (total * taxe) / 100;    // Appliquer la taxe
  
    nouvellesLignes[index].totalLigne = total.toFixed(2);  // Arrondir à 2 décimales
  
    setLignes(nouvellesLignes);
    calculerTotal(nouvellesLignes);
  };
  

  const calculerTotal = (lignes) => {
    const totalHT = lignes.reduce((acc, ligne) => acc + ligne.totalLigne, 0);
    setTotalHT(totalHT);
    setTotalTTC(totalHT * 1.2);
  };

  const enregistrerDocument = () => {
    const documentData = { numero, date, client, typeDocument, statut, totalHT, totalTTC, lignes };
    axios.post("http://localhost:5000/entetes/creer", documentData)
      .then(() => navigate("/factures")) 
      .catch(error => console.error("Erreur lors de l'enregistrement", error));
  };

  const handleCancel = () => {
    navigate("/factures"); 
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Création d'un Document</h1>
          <div className="document-form">
            <TextField label="🏷️ Numéro" value={numero} onChange={(e) => setNumero(e.target.value)} fullWidth margin="normal" />
            <TextField label="📅 Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} fullWidth margin="normal" InputLabelProps={{ shrink: true }} />

            <FormControl fullWidth margin="normal">
              <InputLabel>👤 Client</InputLabel>
              <Select value={client} onChange={(e) => setClient(e.target.value)}>
                <MenuItem value="">Sélectionner un client</MenuItem>
                {clients.map(c => (
                  <MenuItem key={c._id} value={c._id}>{c.nom_prenom || "(Nom inconnu)"}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>📜 Type</InputLabel>
              <Select value={typeDocument} onChange={(e) => setTypeDocument(e.target.value)}>
                <MenuItem value="facture">Facture</MenuItem>
                <MenuItem value="devis">Devis</MenuItem>
                <MenuItem value="bon_commande">Bon de commande</MenuItem>
                <MenuItem value="bon_livraison">Bon de livraison</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>💰 Statut</InputLabel>
              <Select value={statut} onChange={(e) => setStatut(e.target.value)}>
                <MenuItem value="en_attente">En attente</MenuItem>
                <MenuItem value="valide">Validé</MenuItem>
                <MenuItem value="annule">Annulé</MenuItem>
              </Select>
            </FormControl>

            <h3>🛒 Lignes du document :</h3>
            <table>
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Code Article</th>
                  <th>Produit</th>
                  <th>Description</th>
                  <th>Quantité</th>
                  <th>PU</th>
                  <th>Remise (%)</th>
                  <th>Taxe (%)</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ligne.codeArticle}</td>
                    <td>
                      <FormControl fullWidth>
                        <Select value={ligne.article} onChange={(e) => mettreAJourLigne(index, "article", e.target.value)}>
                          <MenuItem value="">Sélectionner un article</MenuItem>
                          {articles.map(article => (
                            <MenuItem key={article._id} value={article._id}>{article.nom}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </td>
                    <td>
                      <TextField value={ligne.description} onChange={(e) => mettreAJourLigne(index, "description", e.target.value)} />
                    </td>
                    <td>
                      <TextField type="number" value={ligne.quantite} onChange={(e) => mettreAJourLigne(index, "quantite", parseInt(e.target.value))} />
                    </td>
                    <td>
                      <TextField type="number" value={ligne.prixUnitaire} onChange={(e) => mettreAJourLigne(index, "prixUnitaire", parseFloat(e.target.value))} />
                    </td>
                    <td>
                      <TextField type="number" value={ligne.remise} onChange={(e) => mettreAJourLigne(index, "remise", parseFloat(e.target.value))} />
                    </td>
                    <td>
                      <TextField type="number" value={ligne.taxe} onChange={(e) => mettreAJourLigne(index, "taxe", parseFloat(e.target.value))} />
                    </td>
                    <td>{ligne.totalLigne.toFixed(2)}€</td>
                    <td>
                      <Button onClick={() => supprimerLigne(index)}>❌</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant="contained" onClick={ajouterLigne}>+ Ajouter une ligne</Button>
            <h3>💲 Total HT : {totalHT.toFixed(2)}€</h3>
            <h3>💲 Total TTC : {totalTTC.toFixed(2)}€</h3>

            <Button variant="contained" color="primary" onClick={enregistrerDocument}>✅ Enregistrer</Button>
            <Button variant="contained" color="secondary" onClick={handleCancel}>❌ Annuler</Button>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default DocumentForm;
