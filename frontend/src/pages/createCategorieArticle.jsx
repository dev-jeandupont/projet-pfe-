import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Grid, Box, Typography } from "@mui/material";
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";

export default function CreateCategorieArticle() {
  const [formData, setFormData] = useState({
    designationCategorie: "",
  });

  // Gère les changements dans les champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Crée une nouvelle catégorie d'articles
  const createCategorieArticle = async (e) => {
    e.preventDefault(); // Évite le rechargement de la page

    try {
      await axios.post("http://localhost:5000/categorie", formData);
      alert("Catégorie d'article créée avec succès !");
      setFormData({
        designationCategorie: "",
      });
    } catch (error) {
      console.error(
        "Erreur lors de la création de la catégorie :",
        error.response ? error.response.data : error
      );
      alert(
        "Une erreur s'est produite lors de la création. Voir la console pour plus de détails."
      );
    }
  };

  return (
    <>
      <Navbar />
      <Box height={100} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            overflow: "auto",
            maxHeight: "100vh",
          }}
        >
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: "#fff",
              paddingBottom: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Créer une Catégorie d'Articles
            </Typography>
          </Box>

          <form onSubmit={createCategorieArticle}>
            <Grid container spacing={2}>
              <Grid item xs={10}>
                <TextField
                  name="designationCategorie"
                  label="Désignation de la Catégorie"
                  fullWidth
                  margin="normal"
                  value={formData.designationCategorie}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={10} sx={{ textAlign: "right" }}>
                <Button type="submit" color="primary" variant="contained">
                  Créer
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </>
  );
}
