const express = require('express');
const router = express.Router();
const Province = require('../models/Province');

// Récupérer tous les Provinces
router.get('/', async (req, res) => {
  try {
    const provinces = await Province.find();
    res.json(provinces);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
