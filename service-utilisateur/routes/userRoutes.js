const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');

const router = express.Router();

// Routes
router.post('/register', userController.register);  // Inscription
router.post('/login', userController.login);        // Connexion
router.get('/', userController.getAllUsers);        // Liste des utilisateurs

module.exports = router;
