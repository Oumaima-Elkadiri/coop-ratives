const mongoose = require('mongoose');

const CategorieCoopSchema = new mongoose.Schema({
    nom: String,
    description: String,
});

module.exports = mongoose.model('CategorieCoop', CategorieCoopSchema);