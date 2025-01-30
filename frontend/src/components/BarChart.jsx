import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ data, labels }) => {
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
                type: 'bar',
                data: {
                    labels: labels, // Les noms des coopératives
                    datasets: [
                        {
                            label: 'Chiffre d\'affaires (Dhs)',
                            data: data, // Les données de chiffre d'affaires
                            backgroundColor: '#3b82f6', // Couleur des barres
                            borderColor: '#3b82f6', // Couleur de la bordure
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#333',
                                font: {
                                    size: 14,
                                },
                            },
                        },
                        tooltip: {
                            backgroundColor: '#3b82f6',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            displayColors: false,
                        },
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Coopératives',
                                color: '#333',
                                font: {
                                    size: 14,
                                },
                            },
                            grid: {
                                display: false,
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 12,
                                },
                            },
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Chiffre d\'affaires (Dhs)',
                                color: '#333',
                                font: {
                                    size: 14,
                                },
                            },
                            grid: {
                                color: '#e0e0e0',
                            },
                            ticks: {
                                color: '#666',
                                font: {
                                    size: 12,
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
        <div style={{ width: '100%', height: '300px', maxWidth: '800px', margin: '0 auto' }}>
            <canvas ref={chartRef} />
        </div>
    );
};

export default BarChart;