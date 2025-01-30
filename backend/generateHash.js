const bcrypt = require('bcrypt');

(async () => {
    const password = "responsable123"; // Remplacez par votre mot de passe souhaité
    const hash = await bcrypt.hash(password, 10);
    console.log("Hash généré :", hash);
})();
