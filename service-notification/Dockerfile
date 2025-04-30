# Utilise une image Node.js officielle (ici la version 16)
FROM node:16

# Crée le répertoire de l'application dans le conteneur
WORKDIR /usr/src/app

# Copie les fichiers package.json et package-lock.json (si présent)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie tout le code source dans le conteneur
COPY . .

# Expose le port sur lequel ton service écoute (ici 6000)
EXPOSE 6000

# Définit la commande de démarrage du service
CMD ["node", "server.js"]
