const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Récupérer tous les contacts
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.find();
    res.json(contact);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Ajouter un nouveau contact
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
