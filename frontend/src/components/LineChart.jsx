import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const LineChart = ({ data, labels }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Détruire le graphique existant s'il y en a un
            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }

            // Créer un nouveau graphique
            chartRef.current.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels, // Les étiquettes de l'axe X (ex. mois, années)
                    datasets: [
                        {
                            label: 'Chiffre d\'affaires (Dhs)',
                            data: data, // Les données de l'axe Y
                            borderColor: '#3b82f6', // Couleur de la ligne
                            backgroundColor: 'rgba(59, 130, 246, 0.1)', // Couleur de fond
                            borderWidth: 2,
                            fill: true, // Remplir l'aire sous la courbe
                            tension: 0.4, // Courbure de la ligne
                            pointBackgroundColor: '#3b82f6', // Couleur des points
                            pointBorderColor: '#fff', // Bordure des points
                            pointHoverRadius: 5, // Taille des points au survol
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Permet de redimensionner librement
                    animation: {
                        duration: 1000, // Durée de l'animation en millisecondes
                        easing: 'easeInOutQuad', // Type d'animation
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#333', // Couleur du texte de la légende
                                font: {
                                    size: 14, // Taille de la police
                                },
                            },
                        },
                        tooltip: {
                            backgroundColor: '#3b82f6', // Couleur de fond des tooltips
                            titleColor: '#fff', // Couleur du titre des tooltips
                            bodyColor: '#fff', // Couleur du texte des tooltips
                            displayColors: false, // Masquer les couleurs dans les tooltips
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Période',
                                color: '#333', // Couleur du titre de l'axe X
                                font: {
                                    size: 14, // Taille de la police
                                },
                            },
                            grid: {
                                display: false, // Masquer la grille de l'axe X
                            },
                            ticks: {
                                color: '#666', // Couleur des étiquettes de l'axe X
                                font: {
                                    size: 12, // Taille de la police
                                },
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Chiffre d\'affaires (Dhs)',
                                color: '#333', // Couleur du titre de l'axe Y
                                font: {
                                    size: 14, // Taille de la police
                                },
                            },
                            grid: {
                                color: '#e0e0e0', // Couleur de la grille de l'axe Y
                            },
                            ticks: {
                                color: '#666', // Couleur des étiquettes de l'axe Y
                                font: {
                                    size: 12, // Taille de la police
                                },
                                callback: (value) => `${value} Dhs`, // Ajouter "Dhs" aux étiquettes
                            },
                        },
                    },
                },
            });
        }
    }, [data, labels]);

    return (
        <div style={{ width: '100%', height: '300px', maxWidth: '800px', margin: '30px auto' }}>
            <canvas ref={chartRef} />
        </div>
    );
};

export default LineChart;