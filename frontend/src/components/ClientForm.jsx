import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Grid, Select, MenuItem } from '@mui/material';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom_prenom: '',
    telephone: '',
    code: '',
    raison_social: '',
    matricule_fiscale: '',
    adresse: '',
    register_commerce: '',
    solde_initial: 0,
    montant_raprochement: 0,
    code_rapprochement: '',
    rapeBl: '',
    solde_initiale_bl: 0,
    montant_reglement_bl: 0,
    taux_retenu: 0,

  });

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/clients/${id}`)
        .then((response) => {
          setForm(response.data);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération du client', error);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5000/clients/${id}`, form);
      } else {
        await axios.post('http://localhost:5000/clients', form);
      }
      navigate('/clients');
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire', error);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
          {id ? 'Modifier' : 'Ajouter'} un client
        </Typography>
        <Select
          fullWidth
          value={form.transporteur}
          onChange={(e) => setForm({ ...form, transporteur: e.target.value })}
          sx={{ marginBottom: 3 }}
        >
          <MenuItem value="FedEx">FedEx</MenuItem>
          <MenuItem value="DHL">DHL</MenuItem>
          <MenuItem value="UPS">UPS</MenuItem>
        </Select>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Informations sur l'adresse</Typography>
        <Grid container spacing={2}>
          {Object.keys(form).map((key) => (
            key !== 'transporteur' && (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key.replace('_', ' ')}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={form[key]}
                  onChange={(e) => setForm((prevForm) => ({ ...prevForm, [key]: e.target.value }))}
                  required={['nom_prenom', 'telephone', 'code', 'raison_social'].includes(key)}
                />
              </Grid>
            )
          ))}
        </Grid>
        <Button 
         type="submit" 
        variant="contained" 
        color="primary" 
        fullWidth 
        sx={{ marginTop: 3 }} 
          onClick={handleSubmit}
            >
             {id ? 'Modifier' : 'Ajouter'}
           </Button>
      </Box>
    </Container>
  );
};

export default ClientForm;
