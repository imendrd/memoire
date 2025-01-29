const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app')
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Middleware pour parser le JSON
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Service Utilisateur en cours d'exécution sur le port ${PORT}`);
});
