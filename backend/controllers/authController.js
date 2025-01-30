const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || "votre_secret_key"; // Utilisation de la variable d'environnement pour la clé secrète

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Mot de passe incorrect" });

        if (!['Super Administrateur', 'Administrateur'].includes(user.role)) {
            return res.status(403).json({ message: "Accès refusé" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
