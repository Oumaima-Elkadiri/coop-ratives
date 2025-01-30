const express = require('express');
const router = express.Router();
const CategorieProd = require('../models/CategorieProd');

// Récupérer tous les CategorieProds
router.get('/', async (req, res) => {
  try {
    const categorieProds = await CategorieProd.find();
    res.json(categorieProds);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Ajouter un nouveau CategorieProd
router.post('/', async (req, res) => {
  try {
    const categorieProd = new CategorieProd(req.body);
    await categorieProd.save();
    res.status(201).json(categorieProd);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
