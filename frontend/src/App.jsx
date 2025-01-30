import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './components/Pages/Dashboard';
import CooperativesPage from './components/Pages/CooperativesPage';
import ProductsPage from './components/Pages/ProductsPage';
import NotFoundPage from './components/NotFoundPage';
import Navbar from './components/Navbar';
import Login from './components/Pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
    const navigate = useNavigate();

    // Fonction pour gérer la déconnexion
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Supprimer le token
        setIsAuthenticated(false); // Mettre à jour l'état d'authentification
        navigate('/'); // Rediriger vers la page de login
    };

    // Vérifier l'authentification à chaque changement de route
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, [navigate]);

    return (
        <>
            {/* Affichez la Navbar uniquement si l'utilisateur est authentifié */}
            {isAuthenticated && <Navbar onLogout={handleLogout} />}
            <Routes>
                <Route
                    path="/"
                    element={<Login setIsAuthenticated={setIsAuthenticated} />} // Passer setIsAuthenticated
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/Cooperatives"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <CooperativesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/Cooperatives/:id"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <ProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
};

export default App;