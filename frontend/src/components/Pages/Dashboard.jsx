import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LineChart from '../LineChart';
import PieChart from '../PieChart';
import BarChart from '../BarChart';

// Importez Swiper et ses styles
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'; // Styles de base de Swiper
import 'swiper/css/navigation'; // Styles pour les boutons de navigation
import 'swiper/css/pagination'; // Styles pour la pagination
import { Navigation, Pagination } from 'swiper/modules';


// Style personnalisé pour déplacer les points de pagination en bas
const customStyles = `
    .swiper-container {
        position: relative;
        padding-bottom: 500px; /* Espace pour les points de pagination */
    }
    .swiper-pagination {
        position: absolute !important;
        bottom: 0px !important; /* Déplacer les points en bas */
        top: auto !important; /* Désactiver la position par défaut en haut */
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        background-color: #3b82f6 !important; /* Couleur des points */
        opacity: 0.5;
        margin: 0 5px;
        cursor: pointer;
        border-radius: 50%;
    }
    .swiper-pagination-bullet-active {
        opacity: 1 !important;
        background-color: #3b82f6 !important; /* Couleur du point actif */
    }
`;

const Dashboard = () => {
    const [indicators, setIndicators] = useState({
        totalCooperatives: 0,
        totalProducts: 0,
        totalRevenue: 0,
    });

    const [revenueData, setRevenueData] = useState({
        labels: [],
        data: [],
    });

    const [revenueBySector, setRevenueBySector] = useState({
        labels: [],
        data: [],
    });

    const [cooperativesRanking, setCooperativesRanking] = useState({
        labels: [],
        data: [],
    });

    const [filter, setFilter] = useState('mois');

    useEffect(() => {
    const fetchIndicators = async () => {
        try {
            // Récupérer le token stocké
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error("Token non trouvé");

            // Ajouter le token dans les en-têtes des requêtes
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // Récupérer les indicateurs globaux
            const indicatorsResponse = await axios.get('http://localhost:5000/api/dashboard/indicators', config);
            setIndicators(indicatorsResponse.data);

            // Récupérer les données pour le graphique en courbes
            const revenueResponse = await axios.get(`http://localhost:5000/api/dashboard/revenue?filter=${filter}`, config);
            setRevenueData({
                labels: revenueResponse.data.labels,
                data: revenueResponse.data.data,
            });

            // Récupérer les données pour le graphique en camembert
            const revenueBySectorResponse = await axios.get('http://localhost:5000/api/dashboard/revenue-by-sector', config);
            setRevenueBySector({
                labels: revenueBySectorResponse.data.labels,
                data: revenueBySectorResponse.data.data,
            });

            // Récupérer les données pour le graphique en barres (classement des coopératives)
            const cooperativesRankingResponse = await axios.get('http://localhost:5000/api/dashboard/cooperatives-ranking?limit=10', config);
            setCooperativesRanking({
                labels: cooperativesRankingResponse.data.labels,
                data: cooperativesRankingResponse.data.data,
            });
        } catch (err) {
            
            console.error("Erreur lors de la récupération des données :", err);
        }
    };

    fetchIndicators();
}, [filter]);


    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord</h1>

            {/* Boutons de filtre */}
            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setFilter('mois')}
                    className={`px-4 py-2 rounded-lg ${filter === 'mois' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Par Mois
                </button>
                <button
                    onClick={() => setFilter('trimestre')}
                    className={`px-4 py-2 rounded-lg ${filter === 'trimestre' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Par Trimestre
                </button>
                <button
                    onClick={() => setFilter('annee')}
                    className={`px-4 py-2 rounded-lg ${filter === 'annee' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                    Par Année
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Carte pour les coopératives */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Coopératives</h2>
                            <p className="text-3xl font-bold">{indicators.totalCooperatives}</p>
                        </div>
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                    </div>
                </div>

                {/* Carte pour les produits */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Produits</h2>
                            <p className="text-3xl font-bold">{indicators.totalProducts}</p>
                        </div>
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                        </svg>
                    </div>
                </div>

                {/* Carte pour les utilisateurs */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Utilisateurs</h2>
                            <p className="text-3xl font-bold">0</p>
                        </div>
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                        </svg>
                    </div>
                </div>

                {/* Carte pour le chiffre d'affaires */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg text-white transform transition-transform hover:scale-105">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Chiffre d'affaires</h2>
                            <p className="text-3xl font-bold">{indicators.totalRevenue} Dhs</p>
                        </div>
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Slider pour les graphiques */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 relative">
                {/* Injecter le style personnalisé */}
                <style>{customStyles}</style>

                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={20}
                    slidesPerView={1}
                >
                    {/* Slide 1 : Évolution du chiffre d'affaires */}
                    <SwiperSlide>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Évolution du chiffre d'affaires</h2>
                        <LineChart data={revenueData.data} labels={revenueData.labels} />
                    </SwiperSlide>

                    {/* Slide 2 : Répartition du chiffre d'affaires par secteur */}
                    <SwiperSlide>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Répartition du chiffre d'affaires par secteur</h2>
                        <PieChart data={revenueBySector.data} labels={revenueBySector.labels} />
                    </SwiperSlide>

                    {/* Slide 3 : Top 10 des coopératives par chiffre d'affaires */}
                    <SwiperSlide>
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Top 10 des coopératives par chiffre d'affaires</h2>
                        <BarChart data={cooperativesRanking.data} labels={cooperativesRanking.labels} />
                    </SwiperSlide>
                </Swiper>
            </div>
        </div>
    );
};

export default Dashboard;