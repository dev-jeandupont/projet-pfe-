import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ReceiptIcon from "@mui/icons-material/Receipt"; // Factures
import DescriptionIcon from "@mui/icons-material/Description"; // Devis
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"; // Bons de commande
import LocalShippingIcon from "@mui/icons-material/LocalShipping"; // Bons de livraison
import CategoryIcon from "@mui/icons-material/Category"; // Icône pour Catégorie
import ArticleIcon from "@mui/icons-material/Article"; // Icône pour Article
import GroupWorkIcon from "@mui/icons-material/GroupWork"; // Icône pour Famille
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "drawerOpen", // Mise à jour ici
})(({ theme, drawerOpen }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(drawerOpen && {
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!drawerOpen && {
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidenav() {
  const theme = useTheme();
  const navigate = useNavigate();
  const drawerOpen = useAppStore((state) => state.dopen); // Mise à jour ici
  const setDrawerOpen = useAppStore((state) => state.setDopen); // Mise à jour ici

  // Fonction pour gérer l'ouverture et la fermeture du tiroir
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen); // Mise à jour ici
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" drawerOpen={drawerOpen}>
        {" "}
        {/* Mise à jour ici */}
        <DrawerHeader>
          <IconButton onClick={handleDrawerToggle}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Accueil */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              navigate("/");
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* À propos */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              navigate("/about");
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"About"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* Paramètres */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              navigate("/settings");
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Settings"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* Clients */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              navigate("/clients");
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Clients"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* Articles */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              navigate("/articles");
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary={"Articles"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* Famille d'articles */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              navigate("/FamilleArticle");
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <GroupWorkIcon />
              </ListItemIcon>
              <ListItemText primary={"Famille d'articles"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          {/* Catégorie d'articles */}
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => {
              navigate("/categorieArticle");
            }}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: drawerOpen ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary={"Catégorie d'articles"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

{/* Factures */}
<ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/factures")}>
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: drawerOpen ? "initial" : "center",
      px: 2.5,
    }}
  >
    <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}>
      <ReceiptIcon />
    </ListItemIcon>
    <ListItemText primary={"Factures"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
  </ListItemButton>
</ListItem>

{/* Devis */}
<ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/devis")}>
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: drawerOpen ? "initial" : "center",
      px: 2.5,
    }}
  >
    <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}>
      <DescriptionIcon />
    </ListItemIcon>
    <ListItemText primary={"Devis"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
  </ListItemButton>
</ListItem>

{/* Bons de commande */}
<ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/bons-commande")}>
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: drawerOpen ? "initial" : "center",
      px: 2.5,
    }}
  >
    <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}>
      <ShoppingCartIcon />
    </ListItemIcon>
    <ListItemText primary={"Bons de Commande"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
  </ListItemButton>
</ListItem>

{/* Bons de livraison */}
<ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate("/bons-livraison")}>
  <ListItemButton
    sx={{
      minHeight: 48,
      justifyContent: drawerOpen ? "initial" : "center",
      px: 2.5,
    }}
  >
    <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}>
      <LocalShippingIcon />
    </ListItemIcon>
    <ListItemText primary={"Bons de Livraison"} sx={{ opacity: drawerOpen ? 1 : 0 }} />
  </ListItemButton>
</ListItem>

        </List>
        <Divider />
        <List></List>
      </Drawer>
    </Box>
  );
}