const mongoose = require('mongoose');

const ProvinceSchema = new mongoose.Schema({
    nom: String,
});

module.exports = mongoose.model('Province', ProvinceSchema);