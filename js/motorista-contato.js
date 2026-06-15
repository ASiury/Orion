// Adicionar esta função após a função renderMotoristas() para exibir detalhes de contato
function showMotoristaDetails(index) {
    const motoristas = getStoredItems("motoristas");
    const motorista = motoristas[index];
    
    if (!motorista) return;
    
    const detailsHTML = `
        <div class="motorista-details">
            <h5>${escapeHtml(motorista.name)}</h5>
            <p><strong>Telefone:</strong> <a href="tel:${motorista.telefone}">${escapeHtml(motorista.telefone)}</a></p>
            ${motorista.email ? `<p><strong>E-mail:</strong> <a href="mailto:${motorista.email}">${escapeHtml(motorista.email)}</a></p>` : ''}
            <p><strong>CPF:</strong> ${escapeHtml(motorista.cpf)}</p>
            <p><strong>Status:</strong> ${createStatusBadge(motorista.status, "motoristas")}</p>
        </div>
    `;
    
    return detailsHTML;
}

// Integração com rotas - para exibir contato do motorista
function renderRotasWithDriverContact() {
    const tbody = document.querySelector('[data-table-body="rotas"]');
    if (!tbody) return;

    const rotas = getStoredItems("rotas");
    const motoristas = getStoredItems("motoristas");

    if (!rotas.length) {
        renderEmptyRow(tbody, 10, "Nenhuma rota cadastrada.");
        return;
    }

    tbody.innerHTML = rotas.map((rota) => {
        const motorista = motoristas.find(m => m.id === rota.motorista);
        const driverContact = motorista ? `${escapeHtml(motorista.telefone || 'Não informado')}` : 'Motorista não encontrado';
        
        return `
        <tr data-status="${escapeHtml(rota.status || "")}">
            <td class="id-text ps-4">${escapeHtml(rota.id || "-")}</td>
            <td>${createStatusText(rota.status)}</td>
            <td class="text-muted">${escapeHtml(rota.saida || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.chegada || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.origem || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.destino || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.motorista || "-")}</td>
            <td class="text-muted" title="Contato do motorista"><i class="fa-solid fa-phone text-success me-1"></i>${driverContact}</td>
            <td class="text-muted">${escapeHtml(rota.veiculo || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.custo || "-")}</td>
            <td class="text-success fw-semibold">${escapeHtml(rota.economia || "-")}</td>
            <td class="text-center">
                <a href="${escapeHtml(rota.url || "rotasctr.html")}?id=${escapeHtml(rota.id || "")}" class="btn btn-success btn-sm px-4 fw-semibold shadow-sm action-btn">Verificar</a>
            </td>
        </tr>
    `;
    }).join("");
}
