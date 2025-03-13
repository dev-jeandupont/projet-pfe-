import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import { Button, TextField } from "@mui/material";

const BonLivraisonPage = () => {
  const location = useLocation();
  const {
    numero, // Ce numéro sera ajusté pour commencer par "BL"
    date,
    client,
    totalHT,
    totalTTC,
    lignes,
    refBCC,
    pointDeVente,
    typePaiement,
    commentaire,
  } = location.state;

  // Ajuster le numéro pour commencer par "BL" si ce n'est pas déjà le cas
  const numeroLivraison = numero.startsWith("BL") ? numero : numero.replace(/^DV|^BC/, "BL");

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "350px" }}>
          <h1>Bon de Livraison</h1>
          <div className="document-form">
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <h3>Client</h3>
                <TextField label="Code" fullWidth margin="normal" size="small" value={client.code} />
                <TextField label="Adresse" fullWidth margin="normal" size="small" value={client.adresse} />
                <TextField label="Matricule" fullWidth margin="normal" size="small" value={client.matricule} />
                <TextField label="Raison Sociale" fullWidth margin="normal" size="small" value={client.raisonSociale} />
                <TextField label="Téléphone" fullWidth margin="normal" size="small" value={client.telephone} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <h3>Général</h3>
                <TextField label="Numéro" fullWidth margin="normal" value={numeroLivraison} size="small" />
                <TextField label="Date" type="date" fullWidth margin="normal" value={date} InputLabelProps={{ shrink: true }} size="small" />
                <TextField label="Réf. BCC" fullWidth margin="normal" value={refBCC} size="small" />
                <TextField label="Point de Vente" fullWidth margin="normal" value={pointDeVente} size="small" />
                <TextField label="Type de Paiement" fullWidth margin="normal" value={typePaiement} size="small" />
                <TextField label="Commentaire" fullWidth margin="normal" value={commentaire} multiline rows={4} size="small" />
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
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ligne.codeArticle}</td>
                    <td>{ligne.famille}</td>
                    <td>{ligne.libelleArticle}</td>
                    <td>{ligne.quantite}</td>
                    <td>{ligne.prixHT}</td>
                    <td>{ligne.remise}</td>
                    <td>{ligne.tva}</td>
                    <td>{ligne.prixTTC.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Total HT : {totalHT.toFixed(2)}</h3>
            <h3>Total TTC : {totalTTC.toFixed(2)}</h3>

            <Button variant="contained" color="primary" size="small">Enregistrer</Button>
            <Button variant="contained" color="primary" size="small">Annuler</Button>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default BonLivraisonPage;