import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, InputAdornment } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import { Info as InfoIcon } from '@mui/icons-material';
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search"; // Icône pour le filtre
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Icône Précédent
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"; // Icône Suivant

const DocumentConsulter = ({ typeDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]); // Documents filtrés
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const navigate = useNavigate();

  const itemsPerPage = 10; // Nombre d'éléments par page

  useEffect(() => {
    const params = new URLSearchParams({
      type: typeDocument,
    });
    console.log(typeDocument);
    axios.get(`http://localhost:5000/entetes?${params}`)
      .then(response => {
        console.log(response.data);
        setDocuments(response.data);
        setFilteredDocuments(response.data); // Initialiser les documents filtrés
      })
      .catch(error => {
        console.error("Erreur de chargement des documents", error);
      });
  }, [typeDocument]);

  // Fonction pour filtrer les documents
  const handleFilter = () => {
    const filtered = documents.filter((document) => {
      return (
        document.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.client.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredDocuments(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après le filtrage
  };

  // Fonction pour gérer la saisie dans le champ de recherche
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Fonction pour aller à la page précédente
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fonction pour aller à la page suivante
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredDocuments.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calcul des documents à afficher pour la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  const handleViewDetails = (id) => {
    navigate(`/${typeDocument}/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/${typeDocument}/edit/${id}`);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/entetes/${id}`)
          .then(() => {
            setDocuments(documents.filter(doc => doc._id !== id));
            setFilteredDocuments(filteredDocuments.filter(doc => doc._id !== id)); // Mettre à jour les documents filtrés
            Swal.fire("Supprimé !", "Le document a été supprimé.", "success");
          })
          .catch(error => {
            Swal.fire("Erreur", "Impossible de supprimer le document", "error");
            console.error("Erreur de suppression", error);
          });
      }
    });
  };

  const handleDownload = (id) => {
    axios.get(`http://localhost:5000/entetes/${id}/pdf`, { responseType: "blob" })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${typeDocument}_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => {
        Swal.fire("Erreur", "Impossible de télécharger le document", "error");
        console.error("Erreur de téléchargement", error);
      });
  };

  const handleAddDocument = () => {
    navigate(`/${typeDocument}/ajouter`);
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "350px" }}>
          <h1>Consultation {typeDocument}</h1>
          {/* Bouton Ajouter */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddDocument}
            sx={{ mb: 2 }}
          >
            Ajouter
          </Button>

          {/* Champ de recherche et bouton de filtre */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <TextField
              label="Rechercher par numéro ou client"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleFilter}
              startIcon={<SearchIcon />}
            >
              Filtrer
            </Button>
          </Box>

          {/* Tableau des documents */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Numéro</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Total HT</TableCell>
                  <TableCell>Total TTC</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentDocuments.map((document) => (
                  <TableRow key={document._id}>
                    <TableCell>{document.numero}</TableCell>
                    <TableCell>{new Date(document.date).toLocaleDateString()}</TableCell>
                    <TableCell>{document.client.raisonSociale}</TableCell>
                    <TableCell>{document.totalHT.toFixed(2)}</TableCell>
                    <TableCell>{document.totalTTC.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleViewDetails(document._id)}>
                        <InfoIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={() => handleEdit(document._id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="primary" onClick={() => handleDelete(document._id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton variant="contained" color="primary" onClick={() => handleDownload(document._id)}>
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination personnalisée */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 2 }}>
            {/* Bouton Précédent */}
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handlePreviousPage}
              disabled={currentPage === 1} // Désactiver si on est sur la première page
            >
              Précédent
            </Button>

            {/* Indicateur de page */}
            <Box>
              Page {currentPage} / {Math.ceil(filteredDocuments.length / itemsPerPage)}
            </Box>

            {/* Bouton Suivant */}
            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(filteredDocuments.length / itemsPerPage)} // Désactiver si on est sur la dernière page
            >
              Suivant
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DocumentConsulter;