const User = require('../models/user'); // Assurez-vous que le modèle est bien importé
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔹 Inscription (Register)
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Cet utilisateur existe déjà' });

    // Hasher le mot de passe avant de l'enregistrer
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Enregistrer l'utilisateur avec le mot de passe hashé
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Connexion (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe invalide' });

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe invalide' });

    // Créer un token JWT
    const token = jwt.sign({ userId: user._id }, 'secret-key', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Obtenir le profil de l'utilisateur (nécessite authentification)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password'); // Ne pas envoyer le mot de passe
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Récupérer la liste de tous les utilisateurs (Admin ou Authentifié)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclure les mots de passe pour la sécurité
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
