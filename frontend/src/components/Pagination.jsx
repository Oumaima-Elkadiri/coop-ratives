// Pagination.js
import React from "react";

function Pagination ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }){
    return (
        <div className="px-6 py-4 flex justify-between items-center">
            {/* Sélection du nombre d'éléments par page */}
            <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Afficher :</label>
                <select
                    value={itemsPerPage}
                    onChange={onItemsPerPageChange}
                    className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">coopératives par page</span>
            </div>

            {/* Navigation entre les pages */}
            <div className="flex space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Précédent
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-600">
                    Page {currentPage} sur {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default Pagination;