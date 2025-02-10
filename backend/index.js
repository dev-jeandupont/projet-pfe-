const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter')
const clientRoutes = require('./Routes/clientRoutes');
const categorieRoutes = require("./Routes/categorieRoutes");
const familleRoutes = require("./Routes/familleRoutes");
const articleRoutes = require("./Routes/articleRoutes");
const enteteRoutes = require('./Routes/enteteRoutes');
const ligneRoutes = require('./Routes/ligneRoutes');
require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 5000;

app.get('/ping', (req, res) => {
    res.send('PONG');
});

app.use(bodyParser.json());
app.use(cors());
app.use('/auth', AuthRouter);

app.use('/clients', clientRoutes);
app.use('/articles', articleRoutes);
app.use('/categorie', categorieRoutes);
app.use('/famille', familleRoutes);

app.use('/entetes', enteteRoutes);
app.use('/lignes', ligneRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})