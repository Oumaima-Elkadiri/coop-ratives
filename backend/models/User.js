const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Super Administrateur', 'Administrateur', 'Responsable de coopérative', 'Analyste', 'Visiteur'],
        default: 'Visiteur',
    },
    idCooperative: { type: mongoose.Schema.Types.ObjectId, ref: 'Cooperative' },
    dateCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
