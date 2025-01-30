const express = require('express');
const router = express.Router();
const Cooperative = require('../models/Cooperative');
const Produit = require('../models/Produit');
const authenticateToken = require('../middleware/authMiddleware'); // Correction de l'importation

// Récupérer les indicateurs globaux
router.get('/indicators', authenticateToken, async (req, res) => {
    try {
        const totalCooperatives = await Cooperative.countDocuments();
        const totalProducts = await Produit.countDocuments();
        const totalRevenue = await Produit.aggregate([
            { $group: { _id: null, total: { $sum: "$prix" } } }
        ]);

        res.json({
            totalCooperatives,
            totalProducts,
            totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
        });
    } catch (err) {
        console.error("Erreur dans l'endpoint /indicators :", err);
        res.status(500).send(err.message);
    }
});

// Route pour récupérer les données du chiffre d'affaires
router.get('/revenue', authenticateToken, async (req, res) => {
    try {
        const { filter } = req.query; // Récupérer le filtre (mois, trimestre, année)

        // Récupérer les données depuis MongoDB
        const cooperatives = await Cooperative.find({}, { dateCreation: 1, chiffre_affaires: 1 });
        console.log("Données récupérées :", cooperatives); // Pour déboguer

        // Grouper les données en fonction du filtre
        const groupedData = {};

        cooperatives.forEach(coop => {
            // Vérifier si dateCreation existe
            if (!coop.dateCreation) {
                console.error(`Date manquante pour la coopérative ${coop._id}`);
                return; // Ignorer cette coopérative
            }

            const date = new Date(coop.dateCreation);

            // Vérifier si la date est valide
            if (isNaN(date.getTime())) {
                console.error(`Date invalide pour la coopérative ${coop._id}: ${coop.dateCreation}`);
                return; // Ignorer cette coopérative
            }

            let key;
            switch (filter) {
                case 'trimestre':
                    // Grouper par trimestre (ex: "T1 2023")
                    const quarter = Math.floor(date.getMonth() / 3) + 1;
                    key = `T${quarter} ${date.getFullYear()}`;
                    break;
                case 'annee':
                    // Grouper par année (ex: "2023")
                    key = date.getFullYear().toString();
                    break;
                default:
                    // Par défaut, grouper par mois (ex: "janvier 2023")
                    key = date.toLocaleString('fr', { month: 'long', year: 'numeric' });
                    break;
            }

            // Convertir chiffre_affaires en nombre
            const chiffreAffaires = parseFloat(coop.chiffre_affaires);

            if (isNaN(chiffreAffaires)) {
                console.error(`Chiffre d'affaires invalide pour la coopérative ${coop._id}: ${coop.chiffre_affaires}`);
                return; // Ignorer cette coopérative
            }

            if (!groupedData[key]) {
                groupedData[key] = 0;
            }

            groupedData[key] += chiffreAffaires;
        });

        // Formater les données pour le graphique
        const labels = Object.keys(groupedData);
        const data = Object.values(groupedData);

        res.json({
            labels,
            data,
        });
    } catch (err) {
        console.error("Erreur dans l'endpoint /revenue :", err);
        res.status(500).send(err.message);
    }
});

// Route pour récupérer la répartition du chiffre d'affaires par secteur
router.get('/revenue-by-sector', authenticateToken, async (req, res) => {
    try {
        // Récupérer toutes les coopératives avec leur catégorie et chiffre d'affaires
        const cooperatives = await Cooperative.find({})
            .populate('idCategorieCoop', 'nom'); // Récupérer le nom de la catégorie

        // Grouper le chiffre d'affaires par catégorie
        const revenueBySector = {};

        cooperatives.forEach(coop => {
            const categoryName = coop.idCategorieCoop?.nom || 'Non catégorisé';

            // Convertir chiffre_affaires en nombre
            const chiffreAffaires = parseFloat(coop.chiffre_affaires);

            if (isNaN(chiffreAffaires)) {
                console.error(`Chiffre d'affaires invalide pour la coopérative ${coop._id}: ${coop.chiffre_affaires}`);
                return; // Ignorer cette coopérative
            }

            if (!revenueBySector[categoryName]) {
                revenueBySector[categoryName] = 0;
            }

            revenueBySector[categoryName] += chiffreAffaires;
        });

        // Formater les données pour le graphique
        const labels = Object.keys(revenueBySector);
        const data = Object.values(revenueBySector);

        res.json({
            labels,
            data,
        });
    } catch (err) {
        console.error("Erreur dans l'endpoint /revenue-by-sector :", err);
        res.status(500).send(err.message);
    }
});

// Route pour récupérer le classement des coopératives par chiffre d'affaires
router.get('/cooperatives-ranking', authenticateToken, async (req, res) => {
    try {
        // Récupérer toutes les coopératives avec leur chiffre d'affaires
        const cooperatives = await Cooperative.find({})
            .populate('idCategorieCoop', 'nom') // Récupérer le nom de la catégorie
            .sort({ chiffre_affaires: -1 }); // Trier par chiffre d'affaires décroissant

        // Formater les données pour le graphique
        const labels = cooperatives.map(coop => coop.nom);
        const data = cooperatives.map(coop => parseFloat(coop.chiffre_affaires) || 0);

        res.json({
            labels,
            data,
        });
    } catch (err) {
        console.error("Erreur dans l'endpoint /cooperatives-ranking :", err);
        res.status(500).send(err.message);
    }
});

module.exports = router;