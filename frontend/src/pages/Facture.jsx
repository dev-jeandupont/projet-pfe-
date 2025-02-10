import React from "react";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import { Button } from "@mui/material";  // Import du bouton de Material UI
import { useNavigate } from "react-router-dom";  // Import pour la navigation
import DocumentForm from "../components/DocumentForm";

export default function Facture() {
  const navigate = useNavigate(); // Hook pour la navigation

  // Fonction pour naviguer vers la page du formulaire
  const handleNavigate = () => {
    navigate("/documents/nouveau");  // Remplace "/document-form" par le chemin de ta page
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div>
            <h1>📜 Factures</h1>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleNavigate} // Action du bouton
            >
              Créer une Facture
            </Button>

          </div>
        </Box>
      </Box>
    </>
  );
}
