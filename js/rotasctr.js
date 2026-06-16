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

    if (editStatus) editStatus.value = rota.status || "";
    if (editMotorista) editMotorista.value = rota.motorista || "";
    if (editVeiculo) editVeiculo.value = rota.veiculo || "";
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