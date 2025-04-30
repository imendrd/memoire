# Étape 1 : Utiliser l'image officielle de Node.js comme image de base pour construire le frontend
FROM node:18-alpine AS build

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers package.json et package-lock.json (ou yarn.lock) pour installer les dépendances
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier tous les fichiers du projet dans le conteneur
COPY . .

# Étape 6 : Construire l'application en mode production avec Vite
RUN npm run build

# Étape 7 : Utiliser Nginx pour servir l'application construite
FROM nginx:alpine

# Étape 8 : Copier les fichiers construits depuis l'étape précédente dans le répertoire Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Étape 9 : Exposer le port 80 pour Nginx
EXPOSE 80

# Étape 10 : Lancer Nginx pour servir l'application
CMD ["nginx", "-g", "daemon off;"]
