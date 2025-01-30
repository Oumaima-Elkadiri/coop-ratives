const express = require('express');
const router = express.Router();
const CategorieCoop = require('../models/CategorieCoop');

// Récupérer tous les categorieCoops
router.get('/', async (req, res) => {
  try {
    const categorieCoops = await CategorieCoop.find();
    res.json(categorieCoops);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Ajouter un nouveau categorieCoop
router.post('/', async (req, res) => {
  try {
    const categorieCoop = new CategorieCoop(req.body);
    await categorieCoop.save();
    res.status(201).json(categorieCoop);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
