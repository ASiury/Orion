document.addEventListener("DOMContentLoaded", function () {
    popularFiltrosRelatorio();
    renderRelatorio();

    document.getElementById("formRelatorio")?.addEventListener("submit", function (event) {
        event.preventDefault();
        renderRelatorio();
    });

    document.getElementById("btnLimparRelatorio")?.addEventListener("click", function () {
        document.getElementById("formRelatorio")?.reset();
        renderRelatorio();
    });
});

function popularFiltrosRelatorio() {
    const motoristaSelect = document.getElementById("relMotorista");
    const veiculoSelect = document.getElementById("relVeiculo");

    getStoredItems("motoristas").forEach((motorista) => {
        if (!motoristaSelect) return;
        motoristaSelect.innerHTML += `<option value="${escapeHtml(motorista.id)}">${escapeHtml(motorista.name || motorista.nome || motorista.id)} (${escapeHtml(motorista.id)})</option>`;
    });

    getStoredItems("veiculos").forEach((veiculo) => {
        if (!veiculoSelect) return;
        veiculoSelect.innerHTML += `<option value="${escapeHtml(veiculo.id)}">${escapeHtml(veiculo.modelo || veiculo.name || veiculo.id)} (${escapeHtml(veiculo.id)})</option>`;
    });
}

function renderRelatorio() {
    const filtros = obterFiltrosRelatorio();
    const rotas = filtrarRotas(getStoredItems("rotas"), filtros);
    const entregas = filtrarEntregas(getStoredItems("entregas"), filtros);
    const metricas = calcularMetricas(rotas, entregas);

    atualizarTextoRelatorio("relTotalRotas", rotas.length);
    atualizarTextoRelatorio("relTotalEntregas", entregas.length);
    atualizarTextoRelatorio("relCusto", formatCurrency(metricas.custo));
    atualizarTextoRelatorio("relEconomia", formatCurrency(metricas.economia));
    atualizarTextoRelatorio("relPeso", `${metricas.peso.toLocaleString("pt-BR")} kg`);
    atualizarTextoRelatorio("relConcluidas", metricas.concluidas);

    renderRelatorioRotas(rotas);
    renderRelatorioEntregas(entregas);
}

function obterFiltrosRelatorio() {
    return {
        inicio: document.getElementById("relInicio")?.value || "",
        fim: document.getElementById("relFim")?.value || "",
        motorista: document.getElementById("relMotorista")?.value || "",
        veiculo: document.getElementById("relVeiculo")?.value || "",
        status: document.getElementById("relStatus")?.value || ""
    };
}

function filtrarRotas(rotas, filtros) {
    return rotas.filter((rota) => {
        const dentroPeriodo = dataDentroDoPeriodo(rota.saida, filtros.inicio, filtros.fim);
        const mesmoMotorista = !filtros.motorista || rota.motorista === filtros.motorista;
        const mesmoVeiculo = !filtros.veiculo || rota.veiculo === filtros.veiculo;
        const mesmoStatus = !filtros.status || rota.status === filtros.status;

        return dentroPeriodo && mesmoMotorista && mesmoVeiculo && mesmoStatus;
    });
}

function filtrarEntregas(entregas, filtros) {
    return entregas.filter((entrega) => {
        const dentroPeriodo = dataDentroDoPeriodo(entrega.prazo, filtros.inicio, filtros.fim);
        const mesmoStatus = !filtros.status || normalizarStatusEntrega(entrega.status) === filtros.status;

        return dentroPeriodo && mesmoStatus;
    });
}

function calcularMetricas(rotas, entregas) {
    const custo = rotas.reduce((total, rota) => total + parseCurrency(rota.custo), 0);
    const economia = rotas.reduce((total, rota) => total + parseCurrency(rota.economia), 0);
    const peso = entregas.reduce((total, entrega) => total + Number(entrega.peso || 0), 0);
    const concluidas = entregas.filter((entrega) => entrega.status === "Concluida").length;

    return { custo, economia, peso, concluidas };
}

function renderRelatorioRotas(rotas) {
    const tbody = document.querySelector('[data-report-body="rotas"]');
    if (!tbody) return;

    if (!rotas.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Nenhuma rota encontrada para os filtros.</td></tr>`;
        return;
    }

    tbody.innerHTML = rotas.map((rota) => `
        <tr>
            <td class="fw-bold ps-4">${escapeHtml(rota.id || "-")}</td>
            <td>${createStatusBadge(rota.status || "-", "rotas")}</td>
            <td class="text-muted">${escapeHtml(rota.motorista || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.veiculo || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.custo || "-")}</td>
            <td class="text-success fw-semibold">${escapeHtml(rota.economia || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.chegada || "-")}</td>
        </tr>
    `).join("");
}

function renderRelatorioEntregas(entregas) {
    const tbody = document.querySelector('[data-report-body="entregas"]');
    if (!tbody) return;

    if (!entregas.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">Nenhuma entrega encontrada para os filtros.</td></tr>`;
        return;
    }

    tbody.innerHTML = entregas.map((entrega) => `
        <tr>
            <td class="fw-bold ps-4">${escapeHtml(entrega.id || "-")}</td>
            <td>${createStatusBadge(entrega.status || "Criada", "entregas")}</td>
            <td class="text-muted">${escapeHtml(entrega.origem || "-")}</td>
            <td class="text-muted">${escapeHtml(entrega.destino || "-")}</td>
            <td class="text-muted">${escapeHtml(entrega.peso || "-")} kg</td>
            <td class="text-muted">${escapeHtml(entrega.prazo || "-")}</td>
            <td class="text-muted">${escapeHtml(entrega.prioridade || "-")}</td>
        </tr>
    `).join("");
}

function dataDentroDoPeriodo(value, inicio, fim) {
    if (!inicio && !fim) return true;

    const data = parseDataPtBr(value);
    if (!data) return true;

    const inicioDate = inicio ? new Date(`${inicio}T00:00:00`) : null;
    const fimDate = fim ? new Date(`${fim}T23:59:59`) : null;

    if (inicioDate && data < inicioDate) return false;
    if (fimDate && data > fimDate) return false;
    return true;
}

function parseDataPtBr(value) {
    if (!value) return null;
    if (value.startsWith("Hoje")) return new Date();

    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s(\d{2}):(\d{2}))?/);
    if (!match) return null;

    const [, dia, mes, ano, hora = "00", minuto = "00"] = match;
    const data = new Date(`${ano}-${mes}-${dia}T${hora}:${minuto}:00`);
    return isNaN(data.getTime()) ? null : data;
}

function parseCurrency(value) {
    if (!value) return 0;
    return Number(String(value).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".")) || 0;
}

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function normalizarStatusEntrega(status) {
    if (status === "Em rota") return "Em progresso";
    if (status === "Concluida") return "Finalizada";
    return status;
}

function atualizarTextoRelatorio(id, valor) {
    const element = document.getElementById(id);
    if (element) element.textContent = valor;
}
