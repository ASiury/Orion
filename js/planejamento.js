let tempRotaData = null;

document.addEventListener("DOMContentLoaded", function() {
    populateSelects();

    const form = document.getElementById('formPlanejamento');
    const panelParametros = document.getElementById('panelParametros');
    const panelResultado = document.getElementById('panelResultado');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            if (!form.checkValidity()) {
                form.classList.add('was-validated');
                return;
            }

            if (panelParametros) {
                panelParametros.classList.remove('d-none');
            }

            const btnSubmit = form.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit.innerHTML;
            
            btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Calculando...';
            btnSubmit.disabled = true;

            setTimeout(() => {
                btnSubmit.innerHTML = textoOriginal;
                btnSubmit.disabled = false;
                
                const origem = document.getElementById('origemCarga').value;
                const destino = document.getElementById('destinoCarga').value;
                const peso = document.getElementById('pesoCarga').value;
                const restricoes = document.getElementById('restricoesCarga').value;
                const criterio = document.getElementById('criterioOtimizacao').value;
                const motoristaId = document.getElementById('Motorista').value;
                const veiculoId = document.getElementById('Veiculo').value;
                const dataSaida = document.getElementById('dataCarga').value;

                if(document.querySelector('[data-plan-param="origem"]')) {
                    document.querySelector('[data-plan-param="origem"]').innerText = origem || "Não informado";
                    document.querySelector('[data-plan-param="destino"]').innerText = destino || "Não informado";
                    document.querySelector('[data-plan-param="peso"]').innerText = peso ? `${peso} kg` : "Não informado";
                    document.querySelector('[data-plan-param="restricoes"]').innerText = restricoes || "Nenhuma";
                    document.querySelector('[data-plan-param="criterio"]').innerText = criterio || "Menor custo operacional";
                }

                // Cálculos e métricas geradas dinamicamente para simulação
                const distancia = Math.floor(Math.random() * 2000 + 500); 
                const tempoH = Math.floor(distancia / 70); 
                const custo = distancia * 8.5; 
                const economia = custo * 0.15; 

                if(document.querySelector('[data-plan-result="distancia"]')) {
                    document.querySelector('[data-plan-result="distancia"]').innerText = `${distancia.toLocaleString('pt-BR')} km`;
                    document.querySelector('[data-plan-result="tempo"]').innerText = `${tempoH}h`;
                    document.querySelector('[data-plan-result="custo"]').innerText = `R$ ${custo.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                    document.querySelector('[data-plan-result="economia"]').innerText = `R$ ${economia.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
                    document.querySelector('[data-plan-result="ocupacao"]').innerText = `${Math.floor(Math.random() * 20 + 80)}%`;
                }

                // Formatando a data
                let dataFormatada = dataSaida;
                if (dataSaida) {
                    const dateObj = new Date(dataSaida);
                    dataFormatada = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
                }

                // Guarda temporariamente os dados para caso seja aprovado
                tempRotaData = {
                    status: "Planejada",
                    saida: dataFormatada || "Não informada",
                    chegada: "Pendente",
                    origem: origem,
                    destino: destino,
                    motorista: motoristaId,
                    veiculo: veiculoId,
                    custo: `R$ ${custo.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                    economia: `R$ ${economia.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
                    url: "rotasctr.html"
                };

                if (panelResultado) {
                    panelResultado.classList.remove('d-none');
                }

                alert("Rota calculada com sucesso!");
            }, 1500);
        });
    }

    // Adiciona o Event Listener para o botão de "Aprovar"
    const btnAprovar = document.querySelector('[data-plan-action="aprovar"]');
    if (btnAprovar) {
        btnAprovar.addEventListener('click', aprovarRota);
    }
});

function populateSelects() {
    if (typeof getStoredItems !== 'function') return;

    const motoristaSelect = document.getElementById('Motorista');
    const veiculoSelect = document.getElementById('Veiculo');

    if (motoristaSelect) {
        const motoristas = getStoredItems("motoristas");
        motoristaSelect.innerHTML = '<option value="" selected="">Selecione</option>';
        motoristas.forEach(m => {
            if (m.status === "Ativo" || !m.status) {
                motoristaSelect.innerHTML += `<option value="${m.id}">${m.name || m.nome} (${m.id})</option>`;
            }
        });
    }

    if (veiculoSelect) {
        const veiculos = getStoredItems("veiculos");
        veiculoSelect.innerHTML = '<option value="" selected="">Selecione</option>';
        veiculos.forEach(v => {
            if (v.status === "Disponivel" || !v.status) {
                veiculoSelect.innerHTML += `<option value="${v.id}">${v.modelo || v.name} (${v.placa})</option>`;
            }
        });
    }
}

function aprovarRota() {
    if (!tempRotaData) {
        alert("Calcule a rota antes de aprovar.");
        return;
    }

    if (typeof getStoredItems !== 'function' || typeof setStoredItems !== 'function') {
        alert("Erro: Funções de armazenamento não encontradas.");
        return;
    }

    const rotas = getStoredItems("rotas");
    
    // Identificador em formato compatível com table.js
    let newId = `R-${String(rotas.length + 1).padStart(3, "0")}`;
    if (typeof createSequentialId === 'function') {
        newId = createSequentialId("R", rotas.length);
    }
    
    tempRotaData.id = newId;
    rotas.push(tempRotaData); // Adiciona na memória local
    
    setStoredItems("rotas", rotas);
    
    alert("Rota aprovada e salva com sucesso!");
    window.location.href = "rotas.html"; // Redireciona para exibir a nova rota ativa
}

function voltarParadashboard() {
    window.history.back();
}