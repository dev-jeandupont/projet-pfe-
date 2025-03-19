import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  DialogContent,
  InputLabel,
  Select,
  DialogActions,
  DialogTitle,
  Dialog,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import { Info as InfoIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DocumentConsulter = ({ typeDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [typeAchat, setTypeAchat] = useState("Bon Commande");

  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/entetes?type=${typeDocument}`)
      .then((response) => {
        setDocuments(response.data);
        setFilteredDocuments(response.data);
      })
      .catch((error) => console.error("Erreur de chargement", error));
  }, [typeDocument]);

  const handleFilter = () => {
    setFilteredDocuments(
      documents.filter(
        (doc) =>
          doc.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.client.raisonSociale
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1);
  };

  const handleGeneration = () => {
    if (!selectedDocument) return;
    console.log(selectedDocument);
    const documentData = {
      typeDocument: typeAchat,
      id: selectedDocument._id,
      numero: selectedDocument.numero.replace(
        /^DV/,
        typeAchat === "Bon Commande" ? "BC" : "BL"
      ),
      date: selectedDocument.date,
      client: selectedDocument.client,
      totalHT: selectedDocument.totalHT,
      totalTTC: selectedDocument.totalTTC,
      lignes: selectedDocument.lignes || [],
      referenceCommande: selectedDocument.referenceCommande || "",
      pointVente: selectedDocument.pointVente || "",
      typePaiement: selectedDocument.typePaiement || "",
      commentaire: selectedDocument.commentaire || "",
    };
    console.log(documentData);
    navigate(`/${typeAchat.toLowerCase().replace(" ", "-")}`, {
      state: documentData,
    });
    setOpenModal(false);
  };

  const currentDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (id) => {
    navigate("/${typeDocument}/${id}");
  };

  const handleEdit = (id) => {
    navigate("/${typeDocument}/edit/${id}");
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("http://localhost:5000/entetes/${id}")
          .then(() => {
            setDocuments(documents.filter((doc) => doc._id !== id));
            setFilteredDocuments(
              filteredDocuments.filter((doc) => doc._id !== id)
            ); // Mettre à jour les documents filtrés
            Swal.fire("Supprimé !", "Le document a été supprimé.", "success");
          })
          .catch((error) => {
            Swal.fire("Erreur", "Impossible de supprimer le document", "error");
            console.error("Erreur de suppression", error);
          });
      }
    });
  };

  const handleDownload = (id) => {
    axios
      .get("http://localhost:5000/entetes/${id}/pdf", { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "${typeDocument}_${id}.pdf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        Swal.fire("Erreur", "Impossible de télécharger le document", "error");
        console.error("Erreur de téléchargement", error);
      });
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "350px" }}>
          <h1>Consultation {typeDocument}</h1>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/${typeDocument}/ajouter`)}
          >
            Ajouter
          </Button>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
            <TextField
              label="Rechercher"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
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
                {currentDocuments.map((doc) => (
                  <TableRow key={doc._id}>
                    <TableCell>{doc.numero}</TableCell>
                    <TableCell>
                      {new Date(doc.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{doc.client.raisonSociale}</TableCell>
                    <TableCell>{doc.totalHT.toFixed(2)}</TableCell>
                    <TableCell>{doc.totalTTC.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewDetails(document._id)}
                      >
                        <InfoIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(document._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleDelete(document._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        variant="contained"
                        color="primary"
                        onClick={() => handleDownload(document._id)}
                      >
                        <DownloadIcon />
                      </IconButton>
                      <Button
                        color="primary"
                        onClick={() =>
                          setSelectedDocument(doc) || setOpenModal(true)
                        }
                      >
                        Genere
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Dialog open={openModal} onClose={() => setOpenModal(false)}>
            <DialogTitle>Choisir le type de document</DialogTitle>
            <DialogContent>
              <FormControl fullWidth>
                <InputLabel>Type de document</InputLabel>
                <Select
                  value={typeAchat}
                  onChange={(e) => setTypeAchat(e.target.value)}
                >
                  <MenuItem value="Bon Commande">Bon de Commande</MenuItem>
                  <MenuItem value="Bon Livraison">Bon de Livraison</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Annuler</Button>
              <Button onClick={handleGeneration} color="primary">
                Générer
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default DocumentConsulter;
