const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); // Assurez-vous que le modèle est correct

// Création d'une tâche
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, userId } = req.body;

        if (!title || !userId) {
            return res.status(400).json({ message: "Le titre et l'ID utilisateur sont obligatoires" });
        }

        const task = new Task({
            title,
            description,
            dueDate,
            userId
        });

        await task.save();
        res.status(201).json({ message: "Tâche créée avec succès", task });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de la tâche", error });
    }
});

module.exports = router;
