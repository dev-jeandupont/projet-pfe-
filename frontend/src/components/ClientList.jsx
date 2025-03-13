import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
  TextField,
  Paper,
  Menu,
  MenuItem,
  Container,
} from '@mui/material';
import { Delete, Edit, Add, Visibility, FilterList } from '@mui/icons-material';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filters, setFilters] = useState({});
  const [openFilterMenu, setOpenFilterMenu] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [page, filters]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/clients', {
        params: { page, ...filters },
      });
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

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
    setOpenFilterMenu((prev) => !prev);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
    setOpenFilterMenu(false);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    fetchClients();
    handleFilterClose();
  };

  return (
    <Container maxWidth="lg" style={{ padding: '20px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Typography variant="h4" style={{ fontWeight: 'bold', color: '#1976d2', fontSize: '2rem' }}>
          Liste des Clients
        </Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/clients/new"
            startIcon={<Add style={{ fontSize: '1.5rem' }} />}
            style={{ marginRight: '10px', borderRadius: '20px', fontSize: '1rem', padding: '10px 20px' }}
          >
            Ajouter un client
          </Button>
          <IconButton
            onClick={handleFilterClick}
            color="primary"
            aria-label="filtrer"
            style={{ backgroundColor: '#1976d2', color: 'white', fontSize: '1.5rem' }}
          >
            <FilterList style={{ fontSize: '1.5rem' }} />
          </IconButton>
        </div>
      </div>

      <Paper elevation={3} style={{ borderRadius: '10px', overflow: 'hidden', width: '100%' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <CircularProgress size={50} />
          </div>
        ) : (
          <Table style={{ width: '100%' }}>
            <TableHead style={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                {['Nom & Prénom', 'Téléphone', 'Code', 'Raison Sociale', 'Actions'].map((header, index) => (
                  <TableCell
                    key={index}
                    style={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2', fontSize: '1.2rem', padding: '20px' }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client._id} hover style={{ height: '60px' }}>
                  <TableCell style={{ fontSize: '1.1rem', padding: '20px' }}>{client.nom_prenom}</TableCell>
                  <TableCell style={{ fontSize: '1.1rem', padding: '20px' }}>{client.telephone}</TableCell>
                  <TableCell style={{ fontSize: '1.1rem', padding: '20px' }}>{client.code}</TableCell>
                  <TableCell style={{ fontSize: '1.1rem', padding: '20px' }}>{client.raison_social}</TableCell>
                  <TableCell style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDelete(client._id)}
                        aria-label="supprimer"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <Delete style={{ fontSize: '1.5rem' }} />
                      </IconButton>
                      <IconButton
                        color="primary"
                        component={Link}
                        to={`/clients/${client._id}`}
                        aria-label="modifier"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <Edit style={{ fontSize: '1.5rem' }} />
                      </IconButton>
                      <IconButton
                        color="info"
                        component={Link}
                        to={`/clients/details/${client._id}`}
                        aria-label="détails"
                        style={{ fontSize: '1.5rem' }}
                      >
                        <Visibility style={{ fontSize: '1.5rem' }} />
                      </IconButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Menu
        anchorEl={filterAnchorEl}
        open={openFilterMenu}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <Paper style={{ padding: '20px', width: '300px', borderRadius: '10px' }}>
          <Typography variant="h6" style={{ marginBottom: '10px', color: '#1976d2', fontSize: '1.2rem' }}>
            Filtres
          </Typography>
          <TextField
            name="nom_prenom"
            label="Nom & Prénom"
            value={filters.nom_prenom || ''}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            variant="outlined"
            size="medium"
            style={{ fontSize: '1.1rem' }}
          />
          <TextField
            name="code"
            label="Code"
            value={filters.code || ''}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            variant="outlined"
            size="medium"
            style={{ fontSize: '1.1rem' }}
          />
          <TextField
            name="raison_social"
            label="Raison Sociale"
            value={filters.raison_social || ''}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            variant="outlined"
            size="medium"
            style={{ fontSize: '1.1rem' }}
          />
          <Button
            onClick={applyFilters}
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '10px', borderRadius: '20px', fontSize: '1rem', padding: '10px 20px' }}
          >
            Appliquer
          </Button>
        </Paper>
      </Menu>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <Button
          variant="outlined"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          style={{ borderRadius: '20px', fontSize: '1rem', padding: '10px 20px' }}
        >
          Précédent
        </Button>
        <Typography variant="body1" style={{ color: '#1976d2', fontSize: '1.2rem' }}>
          Page {page} / {totalPages}
        </Typography>
        <Button
          variant="outlined"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          style={{ borderRadius: '20px', fontSize: '1rem', padding: '10px 20px' }}
        >
          Suivant
        </Button>
      </div>
    </Container>
  );
};

export default ClientList;