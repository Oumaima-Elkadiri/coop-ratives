// SearchBar.js
import React, { useState } from "react";

const SearchBar = ({ onSearch, suggestions, onSelectSuggestion }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term); // Transmettre le terme de recherche au parent
    };

    const handleSelectSuggestion = (coop) => {
        setSearchTerm(coop.nom); // Remplir le champ de recherche avec le nom de la coopérative sélectionnée
        onSelectSuggestion(coop); // Transmettre la coopérative sélectionnée au parent
    };

    return (
        <div className="relative">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Rechercher par nom..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </form>

            {/* Affichage des suggestions */}
            {searchTerm && suggestions.length > 0 && (
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((coop) => (
                        <div
                            key={coop.id}
                            onClick={() => handleSelectSuggestion(coop)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {coop.nom}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;