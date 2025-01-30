const mongoose = require('mongoose');

const CategorieProdSchema = new mongoose.Schema({
  nom: String,
  description: String,
});

module.exports = mongoose.model('CategorieProd', CategorieProdSchema);
