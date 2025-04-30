const nodemailer = require('nodemailer');
const Notification = require('../models/notification');
require('dotenv').config();

// Création du transporteur avec les variables d'environnement
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true pour 465, false pour d'autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Fonction pour envoyer une notification
exports.sendNotification = async (req, res) => {
  const { userEmail, subject, message } = req.body;

  try {
    // Options du mail
    const mailOptions = {
      from: `"Notification Service" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject,
      text: message,
      html: `<p>${message}</p>`
    };

    // Envoyer l'email
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);

    // Enregistrer l'historique dans la base de données
    const notification = new Notification({ userEmail, subject, message, status: 'sent' });
    await notification.save();

    res.status(200).json({ message: 'Notification envoyée avec succès', info });
  } catch (error) {
    // En cas d'erreur, on enregistre le statut "failed"
    const notification = new Notification({ userEmail, subject, message, status: 'failed' });
    await notification.save();
    
    res.status(500).json({ message: 'Erreur lors de l’envoi de la notification', error: error.message });
  }
};

// Fonction pour récupérer l'historique des notifications
exports.getNotificationHistory = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ sentAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications', error: error.message });
  }
};
