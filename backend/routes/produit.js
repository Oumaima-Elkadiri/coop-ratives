const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');
const authenticateToken = require('../middleware/authMiddleware'); // Correction de l'importation

// Récupérer tous les produits d'une coopérative
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { cooperative } = req.query;
        let query = {};
        if (cooperative) {
            query.idCooperative = cooperative;
        }
        const produits = await Produit.find(query).populate('idCategorieProd idCooperative');
        res.json(produits);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Ajouter un nouveau produit
router.post('/', authenticateToken, async (req, res) => {
    try {
        const produit = new Produit(req.body);
        await produit.save();
        res.status(201).json(produit);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Modifier un produit
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!produit) {
            return res.status(404).send("Produit non trouvé");
        }
        res.json(produit);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Supprimer un produit
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        await Produit.findByIdAndDelete(req.params.id);
        res.send('Produit supprimé');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;