import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import CooperativeFormModal from '../CooperativeFormModal '
import Pagination from '../Pagination'
import SearchBar from '../SearchBar'

export default function CooperativesPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mode, setMode] = useState("add");
    const [currentCooperative, setCurrentCooperative] = useState({
        nom: "",
        description: "",
        adresse: "",
        idProvince: "",
        telephone: "",
        email: "",
        dateCreation: "",
        idCategorieCoop: "",
        image: "",
    });

    const [cooperatives, setCooperatives] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Récupérer les coopératives, provinces et catégories depuis l'API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error("Token d'authentification manquant");
                }
    
                const [cooperativesRes, provincesRes, categoriesRes] = await Promise.all([
                    fetch('http://localhost:5000/api/cooperatives', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(res => {
                        if (!res.ok) {
                            throw new Error("Erreur lors de la récupération des coopératives");
                        }
                        return res.json();
                    }),
                    fetch('http://localhost:5000/api/provinces', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(res => res.json()),
                    fetch('http://localhost:5000/api/categories-coop', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }).then(res => res.json()),
                ]);
    
                setCooperatives(cooperativesRes);
                setProvinces(provincesRes);
                setCategories(categoriesRes);
            } catch (err) {
                setError(err.message);
                setCooperatives([]); // Initialiser avec un tableau vide en cas d'erreur
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    // Filtrer les coopératives en fonction du terme de recherche
    const filteredCooperatives = Array.isArray(cooperatives) ? cooperatives.filter((coop) =>
        coop.nom.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    // Calculer les coopératives à afficher pour la page actuelle
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCooperatives = filteredCooperatives.slice(indexOfFirstItem, indexOfLastItem);

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(filteredCooperatives.length / itemsPerPage);

    // Gérer la recherche en temps réel
    const handleSearch = (term) => {
        setSearchTerm(term);
        if (term) {
            const filteredSuggestions = cooperatives.filter((coop) =>
                coop.nom.toLowerCase().includes(term.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
        setCurrentPage(1);
    };

    // Gérer la sélection d'une suggestion
    const handleSelectSuggestion = (coop) => {
        setSearchTerm(coop.nom);
        setSuggestions([]);
    };

    // Ouvrir le pop-up en mode "ajout"
    const openAddModal = () => {
        setMode("add");
        setCurrentCooperative({
            nom: "",
            description: "",
            adresse: "",
            idProvince: "",
            telephone: "",
            email: "",
            dateCreation: "",
            idCategorieCoop: "",
            image: "",
        });
        setIsModalOpen(true);
    };

    // Ouvrir le pop-up en mode "modification"
    const openEditModal = (cooperative) => {
        setMode("edit");
        setCurrentCooperative({
            ...cooperative,
            idProvince: cooperative.idProvince?._id || "", // Assurez-vous que l'ID de la province est correct
            idCategorieCoop: cooperative.idCategorieCoop?._id || "", // Assurez-vous que l'ID de la catégorie est correct
            contact: cooperative.idContact || { // Assurez-vous que les informations de contact sont incluses
                nom: "",
                prenom: "",
                telephone: "",
                email: "",
                fonction: "",
            },
        });
        setIsModalOpen(true);
    };

    // Gérer les changements dans les champs du formulaire
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCooperative((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Obtenir le token depuis le localStorage ou le state global (selon ton implémentation)
const token = localStorage.getItem('authToken');
// Soumettre le formulaire (ajout ou modification)
const handleSubmit = async (cooperative) => {
    try {
        console.log("Données reçues dans handleSubmit :", cooperative);
        console.log(token)
        let response;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  // Ajout du token ici
        };

        if (mode === "add") {
            response = await fetch('http://localhost:5000/api/cooperatives', {
                method: 'POST',
                headers,
                body: JSON.stringify(cooperative),
            });
        } else if (mode === "edit") {
            response = await fetch(`http://localhost:5000/api/cooperatives/${cooperative._id}`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(cooperative),
            });
        }

        if (!response.ok) {
            throw new Error('Échec de l’enregistrement de la coopérative');
        }

        const updatedCooperative = await response.json();
        console.log("Réponse du backend :", updatedCooperative);

        if (mode === "add") {
            setCooperatives([...cooperatives, updatedCooperative]);
        } else if (mode === "edit") {
            setCooperatives(cooperatives.map((coop) =>
                coop._id === updatedCooperative._id ? updatedCooperative : coop
            ));
        }

        setIsModalOpen(false);
    } catch (err) {
        console.error("Erreur lors de la soumission :", err);
    }
};

// Supprimer une coopérative
const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cette coopérative ?");
    if (confirmDelete) {
        try {
            const response = await fetch(`http://localhost:5000/api/cooperatives/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Ajout du token ici
                },
            });

            if (!response.ok) {
                throw new Error('Échec de la suppression de la coopérative');
            }

            setCooperatives(cooperatives.filter((coop) => coop._id !== id));
        } catch (err) {
            console.error(err);
        }
    }
};


    // Changer le nombre d'éléments par page
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    // Aller à une page spécifique
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <h1 className="text-2xl font-bold p-6 bg-gray-100 text-gray-800">Liste des Coopératives</h1>
                <div className="flex items-center justify-between p-6">
                    {/* Barre de recherche avec suggestions */}
                    <SearchBar
                        onSearch={handleSearch}
                        suggestions={suggestions}
                        onSelectSuggestion={handleSelectSuggestion}
                    />

                    {/* Bouton "Nouvelle Coopérative" */}
                    <button
                        onClick={openAddModal}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
                    >
                        Nouvelle Coopérative
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Province</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Catégorie</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date de création</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Adresse</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
    {currentCooperatives.map((cooperative) => (
        <tr key={cooperative._id} className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <img src={cooperative.image} alt={cooperative.nom} className="w-16 h-16 object-cover rounded-md" />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{cooperative.nom}</td>
            <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">{cooperative.description}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {cooperative.idProvince?.nom} {/* Affiche le nom de la Province */}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {cooperative.idCategorieCoop?.nom} {/* Affiche le nom de la Catégorie */}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {cooperative.idContact?.nom} {cooperative.idContact?.prenom} - {cooperative.idContact?.fonction} {/* Affiche les informations du Contact */}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {new Date(cooperative.dateCreation).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cooperative.adresse}</td>
            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                <button
                    onClick={() => openEditModal(cooperative)}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Modifier
                </button>
                <button
                    onClick={() => handleDelete(cooperative._id)}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                    Supprimer
                </button>
                <Link
                    to={`/Cooperatives/${cooperative._id}`}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Produits
                </Link>
            </td>
        </tr>
    ))}
</tbody>
                    </table>
                </div>

                {/* Utilisation du composant Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            </div>

            {/* Utilisation du composant CooperativeFormModal */}
            <CooperativeFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={mode}
                currentCooperative={currentCooperative}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                provinces={provinces}
                categories={categories}
            />
        </div>
    );
}