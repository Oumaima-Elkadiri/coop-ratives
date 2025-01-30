import React, { useState, useEffect } from 'react';

const CooperativeFormModal = ({ isOpen, onClose, mode, currentCooperative, onInputChange, onSubmit, provinces, categories }) => {
    const [contact, setContact] = useState({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        fonction: "",
    });

    // Initialiser les informations du contact lorsque currentCooperative change
    useEffect(() => {
        console.log("currentCooperative dans CooperativeFormModal :", currentCooperative);
        console.log("contact dans CooperativeFormModal :", contact);
        if (mode === "edit" && currentCooperative.contact) {
            setContact(currentCooperative.contact); // Initialisez contact avec les valeurs de currentCooperative.contact
        } else {
            setContact({
                nom: "",
                prenom: "",
                telephone: "",
                email: "",
                fonction: "",
            });
        }
    }, [currentCooperative, mode]);

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setContact((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onInputChange({ target: { name: "image", value: reader.result } });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Vérifiez que tous les champs obligatoires sont remplis
            const requiredFields = [
                currentCooperative.nom,
                currentCooperative.description,
                currentCooperative.adresse,
                currentCooperative.idProvince,
                currentCooperative.idCategorieCoop,
                currentCooperative.chiffre_affaires,
                currentCooperative.membres_actifs, // Ajoutez ce champ
                contact.nom,
                contact.prenom,
                contact.telephone,
                contact.email,
                contact.fonction,
            ];
            if (requiredFields.some((field) => !field && field !== 0)) { // Permet une valeur de 0 pour membres_actifs
                alert("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            const dataToSend = {
                ...currentCooperative,
                contact: contact,
            };

            console.log("Données envoyées :", dataToSend);
            onSubmit(dataToSend);
        } catch (err) {
            console.error("Erreur lors de la soumission :", err);
            alert("Une erreur s'est produite lors de la soumission du formulaire.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-screen">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl p-6">
                    <h2 className="text-2xl font-bold text-white">
                        {mode === "add" ? "Ajouter une nouvelle coopérative" : "Modifier la coopérative"}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Champs de la coopérative */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={currentCooperative.nom || ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                value={currentCooperative.description || ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Adresse</label>
                            <input
                                type="text"
                                name="adresse"
                                value={currentCooperative.adresse || ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date de création</label>
                            <input
                                type="date"
                                name="dateCreation"
                                value={currentCooperative.dateCreation ? new Date(currentCooperative.dateCreation).toISOString().split('T')[0] : ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Province</label>
                            <select
                                name="idProvince"
                                value={currentCooperative.idProvince || ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Sélectionnez une province</option>
                                {provinces.map((province) => (
                                    <option key={province._id} value={province._id}>
                                        {province.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                            <select
                                name="idCategorieCoop"
                                value={currentCooperative.idCategorieCoop || ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">Sélectionnez une catégorie</option>
                                {categories.map((categorie) => (
                                    <option key={categorie._id} value={categorie._id}>
                                        {categorie.nom}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                accept="image/*"
                            />
                            {currentCooperative.image && (
                                <div className="mt-2">
                                    <img
                                        src={typeof currentCooperative.image === 'string' ? currentCooperative.image : URL.createObjectURL(currentCooperative.image)}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Chiffre d'affaire</label>
                            <input
                                type="text"
                                name="chiffre_affaires"
                                value={currentCooperative.chiffre_affaires || ""}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Membres Actifs</label>
                            <input
                                type="number"
                                name="membres_actifs"
                                value={currentCooperative.membres_actifs || 0}
                                onChange={onInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                min="0" // Pour éviter les valeurs négatives
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={contact.nom || ""}
                                    onChange={handleContactChange}
                                    placeholder="Nom"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    value={contact.prenom || ""}
                                    onChange={handleContactChange}
                                    placeholder="Prénom"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                                <input
                                    type="text"
                                    name="telephone"
                                    value={contact.telephone || ""}
                                    onChange={handleContactChange}
                                    placeholder="Téléphone"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={contact.email || ""}
                                    onChange={handleContactChange}
                                    placeholder="Email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fonction</label>
                                <input
                                    type="text"
                                    name="fonction"
                                    value={contact.fonction || ""}
                                    onChange={handleContactChange}
                                    placeholder="Fonction"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {mode === "add" ? "Ajouter" : "Modifier"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CooperativeFormModal;