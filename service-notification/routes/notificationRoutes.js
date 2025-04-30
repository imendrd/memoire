const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Route pour envoyer une notification
router.post('/send', notificationController.sendNotification);

// Route pour récupérer l'historique des notifications
router.get('/history', notificationController.getNotificationHistory);

module.exports = router;
