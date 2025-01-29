const Task = require('../models/Task');

// Créer une tâche
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, userId } = req.body;
    const newTask = new Task({
      title,
      description,
      dueDate,
      userId
    });
    await newTask.save();
    res.status(201).json({ message: 'Tâche créée avec succès' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer toutes les tâches
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer une tâche par ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
