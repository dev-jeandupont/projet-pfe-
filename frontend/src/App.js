import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from "./pages/Settings";
import About from "./pages/About";
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import RefrshHandler from './RefrshHandler'; // Composant pour gérer l'authentification au rafraîchissement
import { Container } from '@mui/material';
import Home from './pages/Home';
import NavBar from './components/Navbar'; // Assurez-vous d'avoir un composant NavBar
import Sidenav from './components/Sidenav';
import Article from './pages/Article'; // Assurez-vous que le chemin est correct
import CreateArticle from './pages/createArticle'; 
import FamilleArticle from './pages/FamilleArticle'; // Assurez-vous que le chemin est correct
import CreateFamilleArticle from './pages/createFamilleArticle'; 
import CategorieArticle from './pages/CategorieArticle'; // Assurez-vous que le chemin est correct
import CreateCategorieArticle from './pages/createCategorieArticle';
import BonCommandePage from './pages/BonCommande';

import Devis from "./pages/Devis";
import DocumentForm from "./components/DocumentForm";
import BonCommande from "./pages/BonCommande";
import DevisConsulter from "./pages/DevisConsulter";
import BonCommandeConsulter from "./pages/BonCommandeConsulter";
import BonLivraisonConsulter from "./pages/BonLivraisonConsulter";
import BonCommandeForm from './pages/BonCommandeForm';
import BonLivraisionForm from './pages/BonLivraisionForm';



import './App.css';
import BonLivraisonPage from './pages/BonLivraision';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation(); // Hook pour obtenir l'URL actuelle

  // Gère la redirection après l'authentification (si l'utilisateur est déjà authentifié, il ne doit pas voir /login ou /signup)

  // Composant pour les routes protégées (nécessite authentification)
  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      {/* Gère l'authentification lors du rafraîchissement de la page */}
      <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
      
      {/* Afficher la barre de navigation si on n'est pas sur la page login ou signup */}
      {['/login', '/signup'].includes(location.pathname) ? null : (
        <>
          <NavBar />
          <Sidenav />
        </>
      )}

      <Container>
        <Routes>
          {/* Route par défaut redirige vers /login si l'utilisateur n'est pas authentifié */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />
          <Route path="/bon-commande" element={<BonCommandePage />} />

          {/* Routes protégées */}
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          <Route path="/clients" element={<PrivateRoute element={<ClientList />} />} />
          <Route path="/clients/new" element={<PrivateRoute element={<ClientForm />} />} />
          <Route path="/clients/:id" element={<PrivateRoute element={<ClientForm />} />} />  

          <Route path="/FamilleArticle" element={<FamilleArticle />} />
          <Route path="/FamilleArticle/create" element={<CreateFamilleArticle />} />
        

          <Route path="/Articles" element={<Article />} />
          <Route path="/Article/create" element={<CreateArticle />} />
        
          
          <Route path="/categorieArticle" element={<CategorieArticle />} />
          <Route path="/categorieArticle/create" element={<CreateCategorieArticle />}/>

      
          <Route path="/devis" element={<Devis />} />
          <Route path="/documents/modifier/:id" element={<DocumentForm />} />
          <Route path="/documents/nouveau" element={<DocumentForm />} />
          <Route path="/BonCommande" element={<BonCommande/>} />
          <Route path="/bon-livraison" element={<BonLivraisonPage/>} />
          <Route path="/devis-consulter" element={<DevisConsulter />} />
          <Route path="/Bon Commande-consulter" element={<BonCommandeConsulter />} />
          <Route path="/Bon livraison-consulter" element={<BonLivraisonConsulter />} />
          <Route path="/devis/ajouter" element={<Devis />} />
          <Route path="/Bon Commande/ajouter" element={<BonCommandeForm />} />
          <Route path="/Bon livraison/ajouter" element={<BonLivraisionForm />} />

          {/* Routes publiques */}
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />

          {/* Routes de login et signup */}
          <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" replace /> : <Signup />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
