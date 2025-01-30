const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Charge les variables d'environnement

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/cooperativeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

// Routes 
app.use('/api/categories-coop', require('./routes/categorieCoop'));
app.use('/api/categories-prod', require('./routes/categorieProd'));
app.use('/api/contacts', require('./routes/contact'));
app.use('/api/cooperatives', require('./routes/cooperative'));
app.use('/api/produits', require('./routes/produit'));
app.use('/api/provinces', require('./routes/province'));
app.use('/api/dashboard', require('./routes/dashboard'));
console.log(require('./routes/dashboard'));
app.use('/api/auth', require('./routes/auth'));  // Auth route

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
