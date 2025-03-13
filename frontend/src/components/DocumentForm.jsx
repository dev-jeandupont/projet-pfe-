import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import { Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const DocumentForm = ({ typeDocument }) => {
  const navigate = useNavigate();
  const [numero, setNumero] = useState("");
  const [date, setDate] = useState("");
  const [client, setClient] = useState("");
  const [totalHT, setTotalHT] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);
  const [familles, setFamilles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [type_achat, setType_achat] = useState(typeDocument);
  const [enregistrementReussi, setEnregistrementReussi] = useState(false);

  // Ajout des nouveaux champs
  const [refBCC, setRefBCC] = useState("");
  const [pointDeVente, setPointDeVente] = useState("");
  const [typePaiement, setTypePaiement] = useState("");
  const [commentaire, setCommentaire] = useState("");

  const [clientDetails, setClientDetails] = useState({
    code: "",
    adresse: "",
    matricule: "",
    raisonSociale: "",
    telephone: "",
  });

  const [lignes, setLignes] = useState([
    {
      quantite: 1,
      prixHT: 0,
      remise: 0,
      tva: 0,
      prixTTC: 0,
      famille: "",
      libelleArticle: "",
      codeArticle: "",
    },
  ]);

  useEffect(() => {
    axios.get("http://localhost:5000/famille")
      .then(response => {
        console.log("Familles récupérées :", response.data);
        setFamilles(response.data);
      })
      .catch(error => console.error("Erreur de chargement des familles", error));
  }, []);

  useEffect(() => {
    handelnumero(date);
  }, [date, type_achat]);

  const handelnumero = (date) => {
    if (date) {
      const today = new Date(date);
      const year = today.getFullYear().toString().slice(-2);
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      let entete = null;
      if (type_achat === "Devis") {
        entete = "DV";
      } else if (type_achat === "Bon Commande") {
        entete = "BC";
      } else {
        entete = "BL";
      }
      setNumero(`${entete}${year}${month}${day}0001`);
    }
  };

  const ajouterLigne = () => {
    const nouvelleLigne = {
      quantite: 1,
      prixHT: 0,
      remise: 0,
      tva: 0,
      prixTTC: 0,
      famille: "",
      libelleArticle: "",
      codeArticle: "",
    };
    setLignes([...lignes, nouvelleLigne]);
  };

  const supprimerLigne = (index) => {
    if (index === 0) return;
    const nouvellesLignes = lignes.filter((_, i) => i !== index);
    setLignes(nouvellesLignes);
    calculerTotal(nouvellesLignes);
  };

  const calculerPrixTTC = (prixHT, remise, tva) => {
    const prixApresRemise = prixHT * (1 - remise / 100);
    return prixApresRemise * (1 + tva / 100);
  };

  const mettreAJourLigne = (index, key, value) => {
    const nouvellesLignes = [...lignes];
    nouvellesLignes[index][key] = value;

    if (key === "codeArticle" && value.length > 0) {
      fetchArticleByCode(value, index);
    }

    const { prixHT, remise, tva } = nouvellesLignes[index];
    nouvellesLignes[index].prixTTC = calculerPrixTTC(prixHT, remise, tva);

    setLignes(nouvellesLignes);
    calculerTotal(nouvellesLignes);
  };

  const calculerTotal = (lignes) => {
    const totalHT = lignes.reduce((acc, ligne) => acc + (ligne.prixHT * ligne.quantite * (1 - ligne.remise / 100)), 0);
    const totalTTC = totalHT * (1 + lignes[0]?.tva / 100);
    setTotalHT(totalHT);
    setTotalTTC(totalTTC);
  };

  const enregistrerDocument = () => {
    const documentData = {
      typeDocument: type_achat,
      numero,
      date,
      client,
      totalHT,
      totalTTC,
      lignes,
      refBCC,
      pointDeVente,
      typePaiement,
      commentaire,
    };

    axios.post("http://localhost:5000/entetes/devis", documentData)
      .then(response => {
        console.log("Succès :", response.data);
        setEnregistrementReussi(true);
      })
      .catch(error => {
        console.error("Erreur Axios :", error);
        if (error.response) {
          console.log("Détails de l'erreur :", error.response.data);
        }
      });
  };

  const handleCancel = () => {
    navigate("/Home");
  };

  const ouvrirFenetreGeneration = () => {
    if (enregistrementReussi) {
      setOpenModal(true);
    } else {
      alert("Veuillez d'abord enregistrer le document.");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleGeneration = (typeDocumentChoisi) => {
    const documentData = {
      typeDocument: typeDocumentChoisi,
      numero: typeDocumentChoisi === "Bon Commande" ? numero.replace(/^DV/, "BC") : numero.replace(/^DV/, "BL"),
      date,
      client: clientDetails,
      totalHT,
      totalTTC,
      lignes,
      refBCC,
      pointDeVente,
      typePaiement,
      commentaire,
    };

    if (typeDocumentChoisi === "Bon Commande") {
      navigate("/bon-commande", { state: documentData });
    } else if (typeDocumentChoisi === "Bon de Livraison") {
      navigate("/bon-livraison", { state: documentData });
    }

    handleCloseModal();
  };

  const fetchClientByCode = (code) => {
    axios.get(`http://localhost:5000/clients/code/${code}`)
      .then(response => {
        const client = response.data;
        setClientDetails({
          code: client.code,
          adresse: client.adresse,
          matricule: client.matricule_fiscale,
          raisonSociale: client.raison_social,
          telephone: client.telephone,
        });
        setClient(client._id);
      })
      .catch(error => {
        console.error("Erreur de chargement des détails du client", error);
        setClientDetails({
          code: code,
          adresse: "",
          matricule: "",
          raisonSociale: "",
          telephone: "",
        });
        setClient("");
      });
  };

  const fetchArticleByCode = (code, index) => {
    axios.get(`http://localhost:5000/articles/code/${code}`)
      .then(response => {
        const article = response.data;
        axios.get(`http://localhost:5000/famille/${article.libelleFamille}`)
          .then(familleResponse => {
            const famille = familleResponse.data;
            const nouvellesLignes = [...lignes];
            nouvellesLignes[index] = {
              ...nouvellesLignes[index],
              libelleArticle: article.libelle,
              prixHT: article.prix_brut,
              tva: article.tva,
              famille: famille.designationFamille,
              prixTTC: calculerPrixTTC(article.prix_brut, nouvellesLignes[index].remise, article.tva),
            };
            setLignes(nouvellesLignes);
            calculerTotal(nouvellesLignes);
          })
          .catch(error => console.error("Erreur de chargement des détails de la famille", error));
      })
      .catch(error => {
        console.error("Erreur de chargement des détails de l'article", error);
        const nouvellesLignes = [...lignes];
        nouvellesLignes[index] = {
          ...nouvellesLignes[index],
          libelleArticle: "",
          prixHT: 0,
          tva: 0,
          famille: null,
          prixTTC: 0,
        };
        setLignes(nouvellesLignes);
        calculerTotal(nouvellesLignes);
      });
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "350px" }}>
          <h1>{typeDocument}</h1>
          <div className="document-form">
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <h3>Client</h3>
                <TextField
                  label="Code"
                  fullWidth
                  margin="normal"
                  size="small"
                  value={clientDetails.code}
                  onChange={(e) => {
                    const code = e.target.value;
                    setClientDetails({ ...clientDetails, code });
                    if (code.length > 0) {
                      fetchClientByCode(code);
                    }
                  }}
                />
                <TextField label="Adresse" fullWidth margin="normal" size="small" value={clientDetails.adresse} />
                <TextField label="Matricule" fullWidth margin="normal" size="small" value={clientDetails.matricule} />
                <TextField label="Raison Sociale" fullWidth margin="normal" size="small" value={clientDetails.raisonSociale} />
                <TextField label="Téléphone" fullWidth margin="normal" size="small" value={clientDetails.telephone} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <h3>Général</h3>
                <TextField label="Numéro" fullWidth margin="normal" value={numero} size="small" />
                <TextField label="Date" type="date" fullWidth margin="normal" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} size="small" />
                <TextField label="Réf. BCC" fullWidth margin="normal" value={refBCC} onChange={(e) => setRefBCC(e.target.value)} size="small" />
                <TextField label="Point de Vente" fullWidth margin="normal" value={pointDeVente} onChange={(e) => setPointDeVente(e.target.value)} size="small" />
                <TextField label="Type de Paiement" fullWidth margin="normal" value={typePaiement} onChange={(e) => setTypePaiement(e.target.value)} size="small" />
                <TextField label="Commentaire" fullWidth margin="normal" value={commentaire} onChange={(e) => setCommentaire(e.target.value)} multiline rows={4} size="small" />
              </Box>
            </Box>

            <h3>Lignes du document :</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>N°</th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>Code Article</th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>Famille</th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>Libelle Article</th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>Quantité</th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>Prix HT</th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>Remise</th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>TVA</th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>Prix TTC</th>
                  <th style={{ padding: "5px", border: "1px solid #ccc" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <TextField
                        value={ligne.codeArticle}
                        onChange={(e) => mettreAJourLigne(index, "codeArticle", e.target.value)}
                        size="small"
                      />
                    </td>
                    <td>
                      <TextField value={ligne.famille || ''} size="small" />
                    </td>
                    <td>
                      <TextField value={ligne.libelleArticle} size="small" />
                    </td>
                    <td>
                      <TextField
                        type="number"
                        value={ligne.quantite}
                        onChange={(e) => mettreAJourLigne(index, "quantite", e.target.value)}
                        size="small"
                      />
                    </td>
                    <td>
                      <TextField value={ligne.prixHT} size="small" />
                    </td>
                    <td>
                      <TextField
                        type="number"
                        value={ligne.remise}
                        onChange={(e) => mettreAJourLigne(index, "remise", e.target.value)}
                        size="small"
                      />
                    </td>
                    <td>
                      <TextField value={ligne.tva} size="small" />
                    </td>
                    <td>
                      <TextField value={ligne.prixTTC.toFixed(2)} size="small" />
                    </td>
                    <td>
                      <Button onClick={() => supprimerLigne(index)} size="small">Supprimer</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Button variant="contained" onClick={ajouterLigne} size="small">Ajouter une ligne</Button>

            <h3>Total HT : {totalHT.toFixed(2)}</h3>
            <h3>Total TTC : {totalTTC.toFixed(2)}</h3>

            <Button variant="contained" color="primary" onClick={enregistrerDocument} size="small">Enregistrer</Button>
            <Button variant="contained" color="primary" onClick={ouvrirFenetreGeneration} size="small">Générer</Button>
            <Button variant="contained" color="primary" onClick={handleCancel} size="small">Annuler</Button>

            <Dialog open={openModal} onClose={handleCloseModal}>
              <DialogTitle>Choisir le type de document</DialogTitle>
              <DialogContent>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Type de document</InputLabel>
                  <Select
                    value={type_achat}
                    onChange={(e) => setType_achat(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="Bon Commande">Bon de Commande</MenuItem>
                    <MenuItem value="Bon de Livraison">Bon de Livraison</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} size="small">Annuler</Button>
                <Button onClick={() => handleGeneration(type_achat)} color="primary" size="small">Générer</Button>
              </DialogActions>
            </Dialog>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default DocumentForm;