// Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false); // État pour gérer l'ouverture du menu mobile

    return (
        <nav className="bg-blue-600 p-4 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo ou titre */}
                <Link to="/dashboard" className="text-xl font-bold">
                    Tableau de Bord
                </Link>

                {/* Menu pour les écrans larges */}
                <div className="hidden md:flex space-x-6">
                    <Link to="/Cooperatives" className="hover:text-gray-300 transition duration-300">
                        Coopératives
                    </Link>
                    {/* Bouton de déconnexion */}
                    <button
                        onClick={onLogout}
                        className="hover:text-gray-300 transition duration-300"
                    >
                        Déconnexion
                    </button>
                </div>

                {/* Bouton hamburger pour les écrans mobiles */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                        />
                    </svg>
                </button>
            </div>

            {/* Menu mobile (affiché uniquement sur les petits écrans) */}
            {isOpen && (
                <div className="md:hidden mt-4">
                    <Link
                        to="/Cooperatives"
                        className="block py-2 px-4 hover:bg-blue-700 transition duration-300"
                        onClick={() => setIsOpen(false)} // Fermer le menu après avoir cliqué sur un lien
                    >
                        Coopératives
                    </Link>
                    {/* Bouton de déconnexion pour mobile */}
                    <button
                        onClick={onLogout}
                        className="block py-2 px-4 hover:bg-blue-700 transition duration-300 w-full text-left"
                    >
                        Déconnexion
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;