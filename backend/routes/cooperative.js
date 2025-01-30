const express = require('express');
const router = express.Router();
const Cooperative = require('../models/Cooperative');
const Contact = require('../models/Contact');
const authenticateToken = require('../middleware/authMiddleware'); // Correction de l'importation

// Récupérer toutes les coopératives
router.get('/', authenticateToken, async (req, res) => {
    try {
        // Récupérer toutes les coopératives avec les données associées (Province, CategorieCoop et Contact)
        const cooperatives = await Cooperative.find()
            .populate('idProvince') // Récupère les données de la Province
            .populate('idCategorieCoop') // Récupère les données de la Catégorie
            .populate('idContact'); // Récupère les données du Contact

        res.json(cooperatives);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

//Ajouter une nouvelle coopérative
router.post('/', authenticateToken, async (req, res) => {
    try {
        console.log("Données reçues :", req.body);

        const { contact, ...cooperativeData } = req.body;

        // Vérifie que tous les champs obligatoires sont présents
        if (!cooperativeData.nom || !cooperativeData.description || !cooperativeData.adresse || !cooperativeData.chiffre_affaires || !cooperativeData.membres_actifs || 
            !cooperativeData.idProvince || !cooperativeData.idCategorieCoop || !contact) {
            console.log("Champs manquants :", { cooperativeData, contact });
            return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
        }

        // Enregistrer le contact
        const newContact = new Contact(contact);
        await newContact.save();
        console.log("Contact enregistré :", newContact);

        // Enregistrer la coopérative avec la référence au contact
        const cooperative = new Cooperative({
            ...cooperativeData,
            idContact: newContact._id, // Référence au contact
        });
        await cooperative.save();
        console.log("Coopérative enregistrée :", cooperative);

        res.status(201).json(cooperative);
    } catch (err) {
        console.error("Erreur dans la route POST :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});


// Modifier une coopérative
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        console.log("Données reçues dans la route PUT :", req.body);

        const { contact, ...cooperativeData } = req.body;

        // Mettre à jour la coopérative
        const cooperative = await Cooperative.findByIdAndUpdate(req.params.id, cooperativeData, { new: true });

        // Mettre à jour le contact associé
        if (contact) {
            await Contact.findByIdAndUpdate(cooperative.idContact, contact, { new: true });
        }

        console.log("Coopérative mise à jour :", cooperative);
        res.json(cooperative);
    } catch (err) {
        console.error("Erreur dans la route PUT :", err);
        res.status(500).send(err.message);
    }
});
// Supprimer une coopérative
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        // Récupérer la coopérative pour obtenir l'ID du contact
        const cooperative = await Cooperative.findById(req.params.id);

        // Supprimer la coopérative
        await Cooperative.findByIdAndDelete(req.params.id);

        // Supprimer le contact associé
        await Contact.findByIdAndDelete(cooperative.idContact);

        res.send('Cooperative et contact associé supprimés');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;