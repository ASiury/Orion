    document.addEventListener("DOMContentLoaded", function() {
        const ctx = document.getElementById('costChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Custo',
                    data: [2.18, 2.21, 2.20, 2.20, 2.25, 2.25, 2.24, 2.28, 2.27, 2.31],
                    borderColor: '#7c3aed', // Roxo/Azul do gráfico
                    backgroundColor: '#7c3aed',
                    borderWidth: 2,
                    tension: 0.3, // Curva suave
                    pointRadius: 2,
                    pointBackgroundColor: '#7c3aed'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false } // Ocultar legenda padrão
                },
                scales: {
                    y: {
                        min: 2.1,
                        max: 2.35,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(1);
                            },
                            color: '#9ca3af',
                            font: { size: 11 }
                        },
                        grid: {
                            color: '#f3f4f6',
                            drawBorder: false,
                        },
                        border: { display: false }
                    },
                    x: {
                        grid: { display: false },
                        border: { display: false },
                        ticks: {
                            color: '#9ca3af',
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    });