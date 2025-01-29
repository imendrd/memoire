const express = require('express');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes'); // Chemin correct vers le fichier

const app = express();
const PORT = 4000;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/todo-app')
    .then(() => console.log('Connecté à MongoDB'))
    .catch((error) => console.log('Erreur de connexion à MongoDB:', error));

// Middleware pour parser le JSON
app.use(express.json());

// Utilisation des routes
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
    console.log(`Service Tâches en cours d'exécution sur le port ${PORT}`);
});
