import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress } from '@mui/material'; 
import { Delete, Edit, Add, Visibility } from '@mui/icons-material';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClients();
  }, [page]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/clients', { params: { page } });
      setClients(response.data.clients);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erreur lors du chargement des clients', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/clients/${id}`);
      fetchClients();
    } catch (error) {
      console.error('Erreur lors de la suppression du client', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4">Liste des Clients</Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to="/clients/new"
        startIcon={<Add />}
        style={{ marginTop: '10px' }}
      >
        Ajouter un client
      </Button>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </div>
      ) : (
        <Table style={{ marginTop: '20px' }}>
          <TableHead>
            <TableRow>
              {['Nom & Prénom', 'Téléphone', 'Code', 'Raison Sociale', 'Actions'].map((header, index) => (
                <TableCell key={index} style={{ fontWeight: 'bold', textAlign: 'center' }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id}>
                <TableCell>{client.nom_prenom}</TableCell>
                <TableCell>{client.telephone}</TableCell>
                <TableCell>{client.code}</TableCell>
                <TableCell>{client.raison_social}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <Button variant="outlined" color="secondary" startIcon={<Delete />} onClick={() => handleDelete(client._id)}>
                      Supprimer
                    </Button>
                    <Button variant="outlined" color="primary" startIcon={<Edit />} component={Link} to={`/clients/${client._id}`}>
                      Modifier
                    </Button>
                    <Button variant="outlined" color="info" startIcon={<Visibility />} component={Link} to={`/clients/details/${client._id}`}>
                      Détails
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <Button variant="outlined" disabled={page <= 1} onClick={() => setPage(page - 1)}>Précédent</Button>
        <Typography variant="body1">Page {page} / {totalPages}</Typography>
        <Button variant="outlined" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Suivant</Button>
      </div>
    </div>
  );
};

export default ClientList;
