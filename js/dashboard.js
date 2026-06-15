document.addEventListener('DOMContentLoaded', function () {
    if (!document.getElementById('dashboardStatusChart')) return;

    const chartCanvas = document.getElementById('dashboardStatusChart');
    const indicatorsContainer = document.getElementById('dashboardIndicators');
    const reloadButton = document.getElementById('dashboardReload');

    const initialData = getDashboardMetrics();
    const statuses = initialData.statusCounts;

    const statusChart = new Chart(chartCanvas, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statuses),
            datasets: [{
                data: Object.values(statuses),
                backgroundColor: [
                    'rgba(54, 162, 235, 0.85)',
                    'rgba(255, 99, 132, 0.85)',
                    'rgba(255, 205, 86, 0.85)',
                    'rgba(75, 192, 192, 0.85)'
                ],
                borderColor: 'rgba(255, 255, 255, 0.75)',
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#34495e',
                        boxWidth: 12,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw || 0;
                            return `${context.label}: ${value}`;
                        }
                    }
                }
            }
        }
    });

    populateIndicatorCards(initialData, indicatorsContainer);
    updateKpiCards(initialData);
    if (typeof renderRotasCriticas === 'function') renderRotasCriticas();

    if (reloadButton) {
        reloadButton.addEventListener('click', function () {
            const refreshedData = getDashboardMetrics();
            statusChart.data.datasets[0].data = Object.values(refreshedData.statusCounts);
            statusChart.data.labels = Object.keys(refreshedData.statusCounts);
            statusChart.update();
            populateIndicatorCards(refreshedData, indicatorsContainer);
            updateKpiCards(refreshedData);
            if (typeof renderRotasCriticas === 'function') renderRotasCriticas();
        });
    }
});

function updateKpiCards(data) {
    const economia = document.querySelector('[data-kpi="economia"]');
    const ocupacao = document.querySelector('[data-kpi="ocupacao"]');
    const ocupacaoProgress = document.querySelector('[data-kpi-progress="ocupacao"]');
    const rotasAtivas = document.querySelector('[data-kpi="rotas-ativas"]');
    const alertas = document.querySelector('[data-kpi="alertas"]');

    if (economia) economia.textContent = `R$ ${formatCurrency(data.economia)}`;
    if (ocupacao) ocupacao.textContent = `${data.averageUse}%`;
    if (ocupacaoProgress) {
        ocupacaoProgress.style.width = `${data.averageUse}%`;
        ocupacaoProgress.setAttribute('aria-valuenow', data.averageUse);
    }
    if (rotasAtivas) rotasAtivas.textContent = data.totalRotas;
    if (alertas) alertas.textContent = data.delayedRotas;
}

function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

function getDashboardMetrics() {
    const rotas = getStoredItems('rotas');
    const motoristas = getStoredItems('motoristas');
    const veiculos = getStoredItems('veiculos');

    const statusCounts = rotas.reduce((acc, rota) => {
        const status = rota.status || 'Outro';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const totalRotas = rotas.length;
    const delayedRotas = rotas.filter(rota => rota.status === 'Atrasada').length;
    const inProgressRotas = rotas.filter(rota => rota.status === 'Em progresso').length;
    const completedRotas = rotas.filter(rota => rota.status === 'Finalizada').length;
    const activeDrivers = motoristas.filter(m => m.status === 'Ativo').length;
    const availableVehicles = veiculos.filter(v => v.status === 'Disponivel').length;
    const averageUse = totalRotas ? Math.round((inProgressRotas / totalRotas) * 100) : 0;
    const economia = totalRotas * 1200 + completedRotas * 250;

    return {
        statusCounts: Object.keys(statusCounts).length ? statusCounts : { 'Sem rotas': 1 },
        totalRotas,
        delayedRotas,
        inProgressRotas,
        completedRotas,
        activeDrivers,
        availableVehicles,
        averageUse,
        economia
    };
}

function populateIndicatorCards(data, container) {
    if (!container) return;

    container.innerHTML = `
        <div class="list-group-item bg-transparent border-0 px-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">Rotas ativas</h6>
                    <p class="mb-0 text-muted">Em andamento ou planejadas</p>
                </div>
                <span class="badge bg-primary bg-opacity-15 text-primary fs-6">${data.totalRotas}</span>
            </div>
        </div>
        <div class="list-group-item bg-transparent border-0 px-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">Motoristas ativos</h6>
                    <p class="mb-0 text-muted">Disponíveis para operação</p>
                </div>
                <span class="badge bg-success bg-opacity-15 text-success fs-6">${data.activeDrivers}</span>
            </div>
        </div>
        <div class="list-group-item bg-transparent border-0 px-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">Veículos disponíveis</h6>
                    <p class="mb-0 text-muted">Prontos para despacho</p>
                </div>
                <span class="badge bg-info bg-opacity-15 text-info fs-6">${data.availableVehicles}</span>
            </div>
        </div>
        <div class="list-group-item bg-transparent border-0 px-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">Rotas atrasadas</h6>
                    <p class="mb-0 text-muted">Atenção da operação</p>
                </div>
                <span class="badge bg-danger bg-opacity-15 text-danger fs-6">${data.delayedRotas}</span>
            </div>
        </div>
        <div class="list-group-item bg-transparent border-0 px-0 py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">Uso de frota</h6>
                    <p class="mb-0 text-muted">Taxa de ocupação atual</p>
                </div>
                <span class="badge bg-warning bg-opacity-15 text-warning fs-6">${data.averageUse}%</span>
            </div>
        </div>
    `;
}
