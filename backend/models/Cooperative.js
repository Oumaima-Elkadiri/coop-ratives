const mongoose = require('mongoose');

const CooperativeSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    adresse: { type: String, required: true },
    idProvince: { type: mongoose.Schema.Types.ObjectId, ref: 'Province', required: true },
    dateCreation: { type: Date, default: Date.now },
    idCategorieCoop: { type: mongoose.Schema.Types.ObjectId, ref: 'CategorieCoop', required: true },
    image: String,
    idContact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
    chiffre_affaires:{ type: String, required: true },
    membres_actifs:{ type: String, required: true }
});

module.exports = mongoose.model('Cooperative', CooperativeSchema);