const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    telephone: String,
    email: String,
    fonction: String,
});

module.exports = mongoose.model('Contact', ContactSchema);