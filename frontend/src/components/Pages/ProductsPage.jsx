import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../Pagination';
import ProductFormModal from '../ProductFormModal';

function ProductsPage() {
    const { id } = useParams();
    const [produits, setProduits] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Récupérer les produits depuis l'API
    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/produits?cooperative=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch produits');
                }
                const data = await response.json();
                setProduits(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduits();
    }, [id]);

    // Récupérer les catégories depuis l'API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/categories-prod');
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCategories();
    }, []);

    // Gérer l'ajout d'un produit
    const handleAddProduct = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    // Gérer la modification d'un produit
    const handleEditProduct = (produit) => {
        setCurrentProduct(produit);
        setIsModalOpen(true);
    };

    // Gérer la suppression d'un produit
    const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5000/api/produits/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete produit');
                }

                setProduits(produits.filter((p) => p._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    // Gérer la soumission du formulaire (ajout ou modification)
    const handleSubmitProduct = async (produit) => {
        try {
            let response;
            if (currentProduct) {
                // Modifier un produit existant
                response = await fetch(`http://localhost:5000/api/produits/${currentProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(produit),
                });
            } else {
                // Ajouter un nouveau produit
                response = await fetch('http://localhost:5000/api/produits', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...produit, idCooperative: id }),
                });
            }

            if (!response.ok) {
                throw new Error('Failed to save produit');
            }

            const updatedProduit = await response.json();
            if (currentProduct) {
                setProduits(produits.map((p) => (p._id === updatedProduit._id ? updatedProduit : p)));
            } else {
                setProduits([...produits, updatedProduit]);
            }

            setIsModalOpen(false);
        } catch (err) {
            console.error("Erreur lors de la soumission :", err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6">
                <h1 className="text-2xl font-bold mb-6">Produits de la coopérative</h1>
                <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 mb-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                    Ajouter un produit
                </button>

                {/* Grille des produits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produits.map((produit) => (
                        <div key={produit._id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                            {/* Image du produit */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={produit.image || "https://via.placeholder.com/300"}
                                    alt={produit.nom}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Contenu de la carte */}
                            <div className="p-6">
                                {/* Nom du produit */}
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">{produit.nom}</h2>

                                {/* Description du produit */}
                                <p className="text-gray-600 mb-4">{produit.description}</p>

                                {/* Prix du produit */}
                                <p className="text-green-600 font-bold text-lg mb-4">{produit.prix} Dhs</p>

                                {/* Détails du produit */}
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Poids :</span> {produit.details?.poids || "Non spécifié"}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Origine :</span> {produit.details?.origine || "Non spécifié"}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium">Certification :</span> {produit.details?.certification || "Non spécifié"}
                                    </p>
                                </div>

                                {/* Boutons d'action */}
                                <div className="mt-6 flex space-x-2">
                                    <button
                                        onClick={() => handleEditProduct(produit)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(produit._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(produits.length / itemsPerPage)}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={(value) => {
                        setItemsPerPage(value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {/* Formulaire modal pour ajouter/modifier un produit */}
            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={currentProduct}
                onSubmit={handleSubmitProduct}
                categories={categories}
            />
        </div>
    );
}

export default ProductsPage;