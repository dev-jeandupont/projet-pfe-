import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DocumentList = () => {
    const [documents, setDocuments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/entetes")
            .then(response => setDocuments(response.data))
            .catch(error => console.error("Erreur de chargement des documents", error));
    }, []);

    return (
        <div className="document-list">
            <h2>📂 Liste des Documents</h2>
            <table>
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc) => (
                        <tr key={doc._id}>
                            <td>{doc.numero}</td>
                            <td>{doc.typeDocument}</td>
                            <td>{new Date(doc.date).toLocaleDateString()}</td>
                            <td>{doc.client.nom}</td>
                            <td>{doc.paiement === "payé" ? "✅ Payée" : "❌ Impayée"}</td>
                            <td>
                                <button onClick={() => navigate(`/documents/${doc._id}`)}>👁️ Voir</button>
                                <button onClick={() => navigate(`/documents/modifier/${doc._id}`)}>✏️ Modifier</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentList;
