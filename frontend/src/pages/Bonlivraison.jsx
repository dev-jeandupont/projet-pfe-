import React from "react";
import DocumentList from "../components/DocumentList";
import Sidenav from "../components/Sidenav";
import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";

export default function Bonlivraison() {
  return (
    <>
    <Navbar />
    <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <div>
            <h1>📜 Bonlivraison</h1>
            <DocumentList type="Bonlivraison" />
        </div>
        </Box>
      </Box>
    </>
  );
}