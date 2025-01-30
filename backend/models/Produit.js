const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
    nom: String,
    description: String,
    prix: Number,
    idCategorieProd: { type: mongoose.Schema.Types.ObjectId, ref: 'CategorieProd' },
    idCooperative: { type: mongoose.Schema.Types.ObjectId, ref: 'Cooperative' },
    image: String,
    avis: [
        {
            utilisateur: String,
            note: Number,
            commentaire: String,
        },
    ],
    details: {
        poids: String,
        origine: String,
        certification: String,
    },
});

module.exports = mongoose.model('Produit', ProduitSchema);