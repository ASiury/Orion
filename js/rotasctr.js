document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const routeId = urlParams.get("id");

    const rotas = getStoredItems("rotas");
    const motoristas = getStoredItems("motoristas");
    const veiculos = getStoredItems("veiculos");

    let rota = null;

    if (routeId) {
        rota = rotas.find(r => r.id === routeId);
    }

    if (!rota && rotas.length) {
        rota = rotas[0];
    }

    if (!rota) {
        console.warn("Nenhuma rota encontrada.");
        return;
    }

    const motorista = motoristas.find(m => m.id === rota.motorista);
    const veiculo = veiculos.find(v => v.id === rota.veiculo);

    preencherDetalhes(rota, motorista, veiculo);
    configurarFormularioEdicao(rota, rotas);
    configurarBotaoCancelar(rota, rotas, motorista, veiculo);
});

function preencherDetalhes(rota, motorista, veiculo) {

    atualizarTexto('[data-route-map="origem"]', rota.origem);
    atualizarTexto('[data-route-map="destino"]', rota.destino);

    atualizarTexto('[data-route-detail="id"]', rota.id);
    atualizarTexto('[data-route-detail="status"]', rota.status);
    atualizarTexto('[data-route-detail="origem"]', rota.origem);
    atualizarTexto('[data-route-detail="destino"]', rota.destino);
    atualizarTexto('[data-route-detail="saida"]', rota.saida);
    atualizarTexto('[data-route-detail="chegada"]', rota.chegada);
    atualizarTexto('[data-route-detail="prazoLimite"]', rota.prazoLimite);
    atualizarTexto('[data-route-detail="statusPrazo"]', obterStatusPrazo(rota));
    atualizarTexto('[data-route-detail="custo"]', rota.custo);
    atualizarTexto('[data-route-detail="economia"]', rota.economia);

    atualizarTexto(
        '[data-route-detail="motorista"]',
        motorista
            ? `${motorista.name} (${motorista.id})`
            : rota.motorista || "Não informado"
    );

    atualizarTexto(
        '[data-route-detail="veiculo"]',
        veiculo
            ? `${veiculo.modelo} (${veiculo.id})`
            : rota.veiculo || "Não informado"
    );

    atualizarTexto(
        '[data-route-detail="tempo"]',
        calcularTempo(rota.status, rota)
    );

    atualizarBarraProgresso(rota.status);
    atualizarMapaDinamico(rota);

    const btnContatar = document.getElementById("btnContatarMotorista");
    if (btnContatar) {
        if (motorista && motorista.telefone) {
            btnContatar.href = `tel:${motorista.telefone}`;
            btnContatar.classList.remove("disabled");
        } else {
            btnContatar.removeAttribute("href");
            btnContatar.classList.add("disabled");
        }
    }

    preencherCamposEdicao(rota);
}

function preencherCamposEdicao(rota) {
    const editStatus = document.getElementById("editStatus");
    const editMotorista = document.getElementById("editMotorista");
    const editVeiculo = document.getElementById("editVeiculo");
    const editPrazoLimite = document.getElementById("editPrazoLimite");

    if (editStatus) editStatus.value = rota.status || "";
    if (editMotorista) editMotorista.value = rota.motorista || "";
    if (editVeiculo) editVeiculo.value = rota.veiculo || "";
    if (editPrazoLimite) editPrazoLimite.value = rota.prazoLimite || "Não informado";
}

function configurarFormularioEdicao(rota, rotas) {

    const form = document.getElementById("formEditRota");

    if (!form) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        rota.status = document.getElementById("editStatus").value;
        rota.motorista = document.getElementById("editMotorista").value;
        rota.veiculo = document.getElementById("editVeiculo").value;

        const index = rotas.findIndex(r => r.id === rota.id);

        if (index !== -1) {
            rotas[index] = rota;
            setStoredItems("rotas", rotas);
        }

        const motoristas = getStoredItems("motoristas");
        const veiculos = getStoredItems("veiculos");

        const motorista = motoristas.find(m => m.id === rota.motorista);
        const veiculo = veiculos.find(v => v.id === rota.veiculo);

        preencherDetalhes(rota, motorista, veiculo);

        const btnCancelar = document.getElementById("btnCancelarRota");
        if (btnCancelar) {
            btnCancelar.disabled = (rota.status === "Cancelada" || rota.status === "Finalizada");
        }

        const modal = bootstrap.Modal.getInstance(
            document.getElementById("modalEditRota")
        );

        modal?.hide();

        alert("Rota atualizada com sucesso!");
    });
}

function configurarBotaoCancelar(rota, rotas, motorista, veiculo) {
    const btnCancelar = document.getElementById("btnCancelarRota");
    if (!btnCancelar) return;

    if (rota.status === "Cancelada" || rota.status === "Finalizada") {
        btnCancelar.disabled = true;
    }

    btnCancelar.addEventListener("click", function () {
        if (confirm("Tem certeza que deseja cancelar esta rota? Esta ação não poderá ser desfeita.")) {
            rota.status = "Cancelada";
            const index = rotas.findIndex(r => r.id === rota.id);
            
            if (index !== -1) {
                rotas[index] = rota;
                setStoredItems("rotas", rotas);
            }

            preencherDetalhes(rota, motorista, veiculo);
            btnCancelar.disabled = true;
            alert("Rota cancelada com sucesso!");
        }
    });
}

function atualizarTexto(selector, valor) {
    const elemento = document.querySelector(selector);

    if (elemento) {
        elemento.textContent = valor || "Não informado";
    }
}

function obterStatusPrazo(rota) {
    if (!rota) return "Não informado";
    if (rota.status === "Atrasada") return "Prazo estourado";
    if (rota.status === "Finalizada") return "Entrega concluída";
    if (rota.status === "Cancelada") return "Rota cancelada";
    if (rota.statusPrazo) return rota.statusPrazo;
    if (!rota.prazoLimite || rota.prazoLimite === "Não informado") return "Não informado";

    return "Monitorando prazo";
}

function atualizarMapaDinamico(rota) {
    const imagem = document.querySelector("[data-route-map-image]");
    if (!imagem || !rota) return;

    const origem = escapeSvg(limitarTexto(rota.origem || "Origem", 18));
    const destino = escapeSvg(limitarTexto(rota.destino || "Destino", 20));
    const status = escapeSvg(rota.status || "Planejada");
    const prazo = escapeSvg(rota.prazoLimite || "Prazo não informado");
    const statusPrazo = escapeSvg(obterStatusPrazo(rota));
    const corStatus = rota.status === "Atrasada" ? "#dc3545" : rota.status === "Finalizada" ? "#198754" : "#0d6efd";
    const corPrazo = obterStatusPrazo(rota).toLowerCase().includes("risco") || rota.status === "Atrasada" ? "#dc3545" : "#198754";

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#eef6ff"/>
                    <stop offset="0.55" stop-color="#e8f5ee"/>
                    <stop offset="1" stop-color="#f7f7f7"/>
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#1f2937" flood-opacity="0.18"/>
                </filter>
            </defs>
            <rect width="1000" height="560" fill="url(#bg)"/>
            <path d="M60 96 C180 40 245 150 356 96 S570 56 665 126 S830 226 952 160" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="8 14"/>
            <path d="M80 430 C230 350 270 470 410 390 S610 250 760 326 S870 412 960 310" fill="none" stroke="#d6dee8" stroke-width="2" stroke-dasharray="8 14"/>
            <path d="M150 370 C260 210 430 420 550 260 S710 112 850 190" fill="none" stroke="#ffffff" stroke-width="34" stroke-linecap="round" filter="url(#shadow)"/>
            <path d="M150 370 C260 210 430 420 550 260 S710 112 850 190" fill="none" stroke="${corStatus}" stroke-width="12" stroke-linecap="round"/>
            <path d="M150 370 C260 210 430 420 550 260 S710 112 850 190" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-dasharray="16 20" opacity="0.9"/>
            <circle cx="150" cy="370" r="22" fill="#ffffff" stroke="#0d6efd" stroke-width="8"/>
            <circle cx="850" cy="190" r="24" fill="#dc3545" stroke="#ffffff" stroke-width="8" filter="url(#shadow)"/>
            <g transform="translate(105 405)" filter="url(#shadow)">
                <rect width="270" height="74" rx="12" fill="#ffffff"/>
                <text x="18" y="28" fill="#64748b" font-family="Arial, sans-serif" font-size="13" font-weight="700">PARTIDA</text>
                <text x="18" y="55" fill="#111827" font-family="Arial, sans-serif" font-size="24" font-weight="700">${origem}</text>
            </g>
            <g transform="translate(650 84)" filter="url(#shadow)">
                <rect width="300" height="82" rx="12" fill="#ffffff"/>
                <text x="18" y="28" fill="#64748b" font-family="Arial, sans-serif" font-size="13" font-weight="700">DESTINO</text>
                <text x="18" y="55" fill="#111827" font-family="Arial, sans-serif" font-size="24" font-weight="700">${destino}</text>
            </g>
            <g transform="translate(370 40)">
                <rect width="282" height="92" rx="16" fill="#111827" opacity="0.92"/>
                <text x="22" y="34" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="700">${status}</text>
                <text x="22" y="62" fill="#d1d5db" font-family="Arial, sans-serif" font-size="15">Prazo: ${prazo}</text>
                <circle cx="246" cy="30" r="9" fill="${corPrazo}"/>
                <text x="22" y="82" fill="${corPrazo}" font-family="Arial, sans-serif" font-size="14" font-weight="700">${statusPrazo}</text>
            </g>
            <g transform="translate(505 238)" filter="url(#shadow)">
                <circle r="31" fill="${corStatus}" stroke="#ffffff" stroke-width="6"/>
                <text x="-9" y="9" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" font-weight="700">&gt;</text>
            </g>
        </svg>
    `;

    imagem.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function limitarTexto(value, limite) {
    const texto = String(value).trim();
    return texto.length > limite ? `${texto.slice(0, limite - 1)}...` : texto;
}

function calcularTempo(status, rota) {

    switch (status) {
        case "Finalizada":
            return "Concluída";

        case "Em progresso":
            return rota && rota.tempo ? rota.tempo : "Em andamento";

        case "Atrasada":
            return rota && rota.tempo ? rota.tempo + " (Atrasada)" : "Atrasada";

        case "Cancelada":
            return "Cancelada";

        case "Planejada":
            return rota && rota.tempo ? rota.tempo : "Pendente";

        default:
            return "Pendente";
    }
}

function atualizarBarraProgresso(status) {

    const progressBar = document.querySelector(
        '[data-route-detail="progresso"]'
    );

    if (!progressBar) return;

    let progresso = 0;

    switch (status) {

        case "Finalizada":
            progresso = 100;
            break;

        case "Em progresso":
            progresso = 50;
            break;

        case "Atrasada":
            progresso = 30;
            break;

        case "Cancelada":
            progresso = 0;
            break;

        default:
            progresso = 10;
    }

    progressBar.style.width = `${progresso}%`;

    progressBar.setAttribute("aria-valuenow", progresso);

    progressBar.className = "progress-bar";

    if (status === "Finalizada") {
        progressBar.classList.add("bg-success");
    }
    else if (status === "Atrasada") {
        progressBar.classList.add("bg-danger");
    }
    else if (status === "Cancelada") {
        progressBar.classList.add("bg-secondary");
    }
    else {
        progressBar.classList.add("bg-primary");
    }
}
