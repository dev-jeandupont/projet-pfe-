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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DocumentConsulter = ({ typeDocument }) => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [typeDocumentChoisi, setTypeDocumentChoisi] = useState("Bon Commande");
  const navigate = useNavigate();

  const itemsPerPage = 10;

  // Charger les documents
  useEffect(() => {
    const params = new URLSearchParams({
      type: typeDocument,
    });
    axios
      .get(`http://localhost:5000/entetes?${params}`)
      .then((response) => {
        setDocuments(response.data);
        setFilteredDocuments(response.data);
      })
      .catch((error) => {
        console.error("Erreur de chargement des documents", error);
      });
  }, [typeDocument]);

  // Filtrer les documents
  const handleFilter = () => {
    const filtered = documents.filter((document) => {
      return (
        document.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.client.raisonSociale.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredDocuments(filtered);
    setCurrentPage(1);
  };

  // Gérer la recherche
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredDocuments.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Calcul des documents à afficher
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDocuments = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  // Gérer la vue des détails
  const handleViewDetails = (id) => {
    navigate(`/${typeDocument}/${id}`);
  };

  // Gérer l'édition
  const handleEdit = (id) => {
    navigate(`/${typeDocument}/edit/${id}`);
  };

  // Gérer la suppression
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
          .delete(`http://localhost:5000/entetes/${id}`)
          .then(() => {
            setDocuments(documents.filter((doc) => doc._id !== id));
            setFilteredDocuments(filteredDocuments.filter((doc) => doc._id !== id));
            Swal.fire("Supprimé !", "Le document a été supprimé.", "success");
          })
          .catch((error) => {
            Swal.fire("Erreur", "Impossible de supprimer le document", "error");
            console.error("Erreur de suppression", error);
          });
      }
    });
  };

  // Télécharger le PDF
  const handleDownload = (id) => {
    axios
      .get(`http://localhost:5000/entetes/${id}/pdf`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${typeDocument}_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        Swal.fire("Erreur", "Impossible de télécharger le document", "error");
        console.error("Erreur de téléchargement", error);
      });
  };

  // Ajouter un document
  const handleAddDocument = () => {
    navigate(`/${typeDocument}/ajouter`);
  };

  // Générer une facture
  const genererFacture = (document) => {
    const { numero, date, client, refBCC, pointDeVente, typePaiement, totalHT, totalTTC, lignes, commentaire } = document;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(33, 150, 243);
    doc.text("Facture", 15, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Numéro: ${numero}`, 15, 30);
    doc.text(`Date: ${new Date(date).toLocaleDateString()}`, 15, 40);
    doc.text(`Client: ${client.raisonSociale}`, 15, 50);
    doc.text(`Réf. BCC: ${refBCC}`, 15, 60);
    doc.text(`Point de Vente: ${pointDeVente}`, 15, 70);
    doc.text(`Type de Paiement: ${typePaiement}`, 15, 80);
    doc.text(`Commentaire: ${commentaire}`, 15, 90);

    const tableData = lignes.map((ligne, index) => [
      index + 1,
      ligne.codeArticle,
      ligne.famille,
      ligne.libelleArticle,
      ligne.quantite,
      ligne.prixHT.toFixed(2),
      ligne.remise.toFixed(2),
      ligne.tva.toFixed(2),
      ligne.prixTTC.toFixed(2),
    ]);

    const headers = [
      "N°",
      "Code Article",
      "Famille",
      "Libellé Article",
      "Quantité",
      "Prix HT",
      "Remise",
      "TVA",
      "Prix TTC",
    ];

    autoTable(doc, {
      startY: 100,
      head: [headers],
      body: tableData,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 2,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [33, 150, 243],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.setFontSize(12);
    doc.text(`Total HT: ${totalHT.toFixed(2)}`, 15, doc.lastAutoTable.finalY + 10);
    doc.text(`Total TTC: ${totalTTC.toFixed(2)}`, 15, doc.lastAutoTable.finalY + 20);

    doc.save(`Facture_${numero}.pdf`);
  };

  // Ouvrir la fenêtre de génération
  const ouvrirFenetreGeneration = (document) => {
    setSelectedDocument(document);
    setOpenModal(true);
  };

  // Fermer la fenêtre modale
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Gérer la génération du bon de commande ou de livraison
  const handleGeneration = (typeDocumentChoisi) => {
    if (!selectedDocument) return;

    // Vérifier que tous les champs obligatoires sont présents
    if (
      !selectedDocument.numero ||
      !selectedDocument.date ||
      !selectedDocument.client ||
      !selectedDocument.totalHT ||
      !selectedDocument.totalTTC ||
      !selectedDocument.lignes ||
      selectedDocument.lignes.length === 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Données manquantes",
        text: "Veuillez vérifier que tous les champs obligatoires sont remplis.",
      });
      return;
    }

    // Préparer les données à passer
    const documentData = {
      typeDocument: typeDocumentChoisi,
      numero: typeDocumentChoisi === "Bon Commande" ? selectedDocument.numero.replace(/^DV/, "BC") : selectedDocument.numero.replace(/^DV/, "BL"),
      date: selectedDocument.date,
      client: {
        code: selectedDocument.client.code || "N/A",
        adresse: selectedDocument.client.adresse || "N/A",
        matricule: selectedDocument.client.matricule || "N/A",
        raisonSociale: selectedDocument.client.raisonSociale || "N/A",
        telephone: selectedDocument.client.telephone || "N/A",
      },
      totalHT: selectedDocument.totalHT,
      totalTTC: selectedDocument.totalTTC,
      lignes: selectedDocument.lignes.map((ligne) => ({
        codeArticle: ligne.codeArticle || "N/A",
        famille: ligne.famille || "N/A",
        libelleArticle: ligne.libelleArticle || "N/A",
        quantite: ligne.quantite || 0,
        prixHT: ligne.prixHT || 0,
        remise: ligne.remise || 0,
        tva: ligne.tva || 0,
        prixTTC: ligne.prixTTC || 0,
      })),
      refBCC: selectedDocument.refBCC ,
      pointDeVente: selectedDocument.pointDeVente ,
      typePaiement: selectedDocument.typePaiement ,
      commentaire: selectedDocument.commentaire ,
    };

    console.log("Données passées :", documentData);

    if (typeDocumentChoisi === "Bon Commande") {
      navigate("/bon-commande", { state: documentData });
    } else if (typeDocumentChoisi === "Bon de Livraison") {
      navigate("/bon-livraison", { state: documentData });
    }

    handleCloseModal();
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
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          if (typeDocument !== "Devis") {
                            genererFacture(document); // Générer directement la facture
                          } else {
                            ouvrirFenetreGeneration(document); // Ouvrir la fenêtre modale
                          }
                        }}
                        size="small"
                      >
                        Générer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination personnalisée */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>

            <Box>
              Page {currentPage} / {Math.ceil(filteredDocuments.length / itemsPerPage)}
            </Box>

            <Button
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(filteredDocuments.length / itemsPerPage)}
            >
              Suivant
            </Button>
          </Box>

          {/* Fenêtre modale pour choisir le type de document */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Choisir le type de document</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Type de document</InputLabel>
                <Select
                  value={typeDocumentChoisi}
                  onChange={(e) => setTypeDocumentChoisi(e.target.value)}
                  size="small"
                >
                  <MenuItem value="Bon Commande">Bon de Commande</MenuItem>
                  <MenuItem value="Bon de Livraison">Bon de Livraison</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} size="small">Annuler</Button>
              <Button onClick={() => handleGeneration(typeDocumentChoisi)} color="primary" size="small">Générer</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </>
  );
};

export default DocumentConsulter;