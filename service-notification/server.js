const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 6001;

// Définition de l'URI MongoDB
const MONGO_URI = "mongodb://localhost:27017/notification-app";  // URI directe

// Connexion à MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connecté à MongoDB'))
.catch((error) => console.error('❌ Erreur de connexion à MongoDB:', error));

app.use(express.json());

app.get('/', (req, res) => {
  res.send("🚀 Service Notification en cours d'exécution...");
});

app.listen(PORT, () => {
  console.log(`🚀 Service Notification fonctionne sur le port ${PORT}`);
});
