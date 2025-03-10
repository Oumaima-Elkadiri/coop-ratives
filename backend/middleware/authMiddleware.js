const jwt = require('jsonwebtoken');
 
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format : "Bearer <token>"

    if (!token) {
        return res.status(401).send("Token d'authentification manquant");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("Token invalide ou expiré");
        }
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;