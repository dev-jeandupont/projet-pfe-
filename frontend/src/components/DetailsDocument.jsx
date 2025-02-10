import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const DetailsDocument = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);

    useEffect(() => {
        axios.get(`/api/entetes/${id}`)
            .then(response => setDocument(response.data))
            .catch(error => console.error("Erreur de chargement du document", error));
    }, [id]);

    const supprimerDocument = () => {
        axios.delete(`/api/entetes/${id}`)
            .then(() => navigate("/documents"))
            .catch(error => console.error("Erreur lors de la suppression", error));
    };

    if (!document) return <p>Chargement...</p>;

    return (
        <div className="details-document">
            <h2>📄 Document : {document.typeDocument.toUpperCase()} {document.numero}</h2>
            <p>📅 Date : {new Date(document.date).toLocaleDateString()}</p>
            <p>👤 Client : {document.client.nom}</p>
            <p>🏷️ Statut : {document.paiement === "payé" ? "✅ Payée" : "❌ Impayée"}</p>
            
            <h3>🛒 Lignes du document :</h3>
            <table>
                <thead>
                    <tr>
                        <th>Désignation</th>
                        <th>Qté</th>
                        <th>PU</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {document.lignes.map((ligne, index) => (
                        <tr key={index}>
                            <td>{ligne.description}</td>
                            <td>{ligne.quantite}</td>
                            <td>{ligne.prixUnitaire}€</td>
                            <td>{ligne.totalLigne}€</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>💲 Total HT : {document.totalHT}€</h3>
            <h3>💲 Total TTC : {document.totalTTC}€</h3>
            
            <button onClick={() => console.log("Générer PDF")}>🖨️ Générer PDF</button>
            <button onClick={() => navigate(`/documents/modifier/${id}`)}>✏️ Modifier</button>
            <button onClick={supprimerDocument}>🗑️ Supprimer</button>
        </div>
    );
};

export default DetailsDocument;
