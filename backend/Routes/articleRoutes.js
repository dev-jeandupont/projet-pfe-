const express = require("express");
const router = express.Router();
const upload = require("../Middlewares/multerConfig");
const { 
    getArticles, 
    getArticleByID, 
    createArticle, 
    updateArticle, 
    deleteArticle 
} = require("../Controllers/ArticleController");

// Routes pour les articles
router.get("/", getArticles); // Récupérer tous les articles
router.get("/:id", getArticleByID); // Récupérer un article par ID
router.post("/", upload.single("image_article"), createArticle); // Ajouter un nouvel article (avec upload d'image)
router.put("/:id", updateArticle); // Modifier un article par ID
router.delete("/:id", deleteArticle); // Supprimer un article par ID

module.exports = router;
