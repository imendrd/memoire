# 1. Utiliser une image Node.js légère
FROM node:18-alpine

# 2. Définir le répertoire de travail dans le conteneur
WORKDIR /app

# 3. Copier les fichiers de dépendances
COPY package*.json ./

# 4. Installer les dépendances (dont pg pour PostgreSQL)
RUN npm install

# 5. Copier tous les fichiers de l'application
COPY . .

# 6. Exposer le port utilisé par l'application (vérifie que c'est bien 3000 ou 3001)
EXPOSE 3000

# 7. Définir la commande pour démarrer le service
CMD ["npm", "start"]
