document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('costChart');
    if(!ctx) return; 

    new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
            datasets: [{
                label: 'Custo por Km',
                data: [2.18, 2.21, 2.20, 2.20, 2.25, 2.25, 2.24, 2.28, 2.27, 2.31],
                borderColor: '#3b82f6', 
                backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                borderWidth: 3,
                tension: 0.4, 
                pointRadius: 4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                fill: true 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    titleFont: { size: 13 },
                    bodyFont: { size: 14, weight: 'bold' },
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'R$ ' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 2.1,
                    max: 2.35,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toFixed(2);
                        },
                        color: '#64748b',
                        font: { size: 12 }
                    },
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false,
                    },
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: {
                        color: '#64748b',
                        font: { size: 12 }
                    }
                }
            }
        }
    });
});