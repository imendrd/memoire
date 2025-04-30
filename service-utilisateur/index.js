require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const { Pool } = require('pg'); // Import du client PostgreSQL
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database'); // Import de Sequelize

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration et connexion à PostgreSQL Neon
const pool = new Pool({
    connectionString: process.env.POSTGRES_URI || 'postgresql://neondb_owner:npg_zFypa3Nm2HGM@ep-late-sun-a8a3kfb7-pooler.eastus2.azure.neon.tech/neondb?sslmode=require',
});

pool.connect()
    .then(() => console.log('✅ Connexion réussie à PostgreSQL Neon'))
    .catch(err => console.error('❌ Erreur de connexion à PostgreSQL:', err));

// Synchronisation de la base de données avec Sequelize
sequelize.sync({ force: false }) // `force: true` recrée les tables à chaque démarrage
    .then(() => console.log('✅ Base de données synchronisée avec Sequelize'))
    .catch(err => console.error('❌ Erreur de synchronisation de la base de données:', err));

// Middleware pour analyser le JSON des requêtes
app.use(express.json());

// Définition des routes
app.use('/api/users', userRoutes);

// Route de test pour vérifier la connexion à PostgreSQL
app.get('/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route d'accueil
app.get('/', (req, res) => {
    res.send('🚀 Bienvenue sur le Service Utilisateur avec PostgreSQL !');
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`✅ Service Utilisateur en cours d'exécution sur le port ${PORT}`);
});
