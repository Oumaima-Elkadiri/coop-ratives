import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const PieChart = ({ data, labels }) => {
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
                type: 'pie',
                data: {
                    labels: labels, // Les étiquettes de chaque secteur
                    datasets: [
                        {
                            label: 'Chiffre d\'affaires par secteur',
                            data: data, // Les données de chaque secteur
                            backgroundColor: [
                                '#3b82f6', // Bleu
                                '#10b981', // Vert
                                '#f59e0b', // Orange
                                '#ef4444', // Rouge
                                '#8b5cf6', // Violet
                                '#06b6d4', // Cyan
                            ],
                            borderColor: '#fff', // Couleur de la bordure
                            borderWidth: 2,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'bottom',
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

export default PieChart;