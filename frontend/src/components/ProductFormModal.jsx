import React, { useState, useEffect } from 'react';

const ProductFormModal = ({ isOpen, onClose, product, onSubmit, categories }) => {
    const [nom, setNom] = useState(product ? product.nom : "");
    const [description, setDescription] = useState(product ? product.description : "");
    const [prix, setPrix] = useState(product ? product.prix : "");
    const [image, setImage] = useState(product ? product.image : "");
    const [idCategorieProd, setIdCategorieProd] = useState(product ? product.idCategorieProd : "");
    const [poids, setPoids] = useState(product ? product.details?.poids : "");
    const [origine, setOrigine] = useState(product ? product.details?.origine : "");
    const [certification, setCertification] = useState(product ? product.details?.certification : "");

    // Réinitialiser les champs lorsque le produit change
    useEffect(() => {
        if (product) {
            setNom(product.nom);
            setDescription(product.description);
            setPrix(product.prix);
            setImage(product.image);
            setIdCategorieProd(product.idCategorieProd);
            setPoids(product.details?.poids || "");
            setOrigine(product.details?.origine || "");
            setCertification(product.details?.certification || "");
        } else {
            setNom("");
            setDescription("");
            setPrix("");
            setImage("");
            setIdCategorieProd("");
            setPoids("");
            setOrigine("");
            setCertification("");
        }
    }, [product]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const produitData = {
            nom,
            description,
            prix,
            image,
            idCategorieProd,
            details: {
                poids,
                origine,
                certification,
            },
        };
        console.log("Données du produit à envoyer :", produitData);
        onSubmit(produitData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-screen">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-t-2xl p-6">
                    <h2 className="text-2xl font-bold text-white">
                        {product ? "Modifier le produit" : "Ajouter un produit"}
                    </h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Champs de base */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prix</label>
                            <input
                                type="number"
                                value={prix}
                                onChange={(e) => setPrix(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image</label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                accept="image/*"
                            />
                            {image && (
                                <div className="mt-2">
                                    <img
                                        src={image}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                            <select
                                value={idCategorieProd}
                                onChange={(e) => setIdCategorieProd(e.target.value)}
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
                    </div>

                    {/* Section Détails */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700">Détails du produit</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Poids</label>
                                <input
                                    type="text"
                                    value={poids}
                                    onChange={(e) => setPoids(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Origine</label>
                                <input
                                    type="text"
                                    value={origine}
                                    onChange={(e) => setOrigine(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Certification</label>
                                <input
                                    type="text"
                                    value={certification}
                                    onChange={(e) => setCertification(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            {product ? "Modifier" : "Ajouter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormModal;