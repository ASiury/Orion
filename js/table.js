const ORION_TABLES = {
    storageKeys: {
        motoristas: "funcionarios",
        veiculos: "veiculos",
        rotas: "rotas"
    },
    defaults: {
        motoristas: [
            {
                id: "MOT-001",
                name: "Joao da Silva",
                cpf: "000.000.000-00",
                cnh: "12345678901",
                estadoCivil: "2",
                dataNascimento: "15/05/1980",
                telefone: "(11) 99999-0001",
                email: "joao.silva@email.com",
                status: "Ativo"
            },
            {
                id: "MOT-002",
                name: "Mariana Costa",
                cpf: "111.111.111-11",
                cnh: "23456789012",
                estadoCivil: "1",
                dataNascimento: "22/10/1985",
                telefone: "(21) 98888-0002",
                email: "mariana.costa@email.com",
                status: "Folga"
            },
            {
                id: "MOT-003",
                name: "Carlos Pereira",
                cpf: "222.222.222-22",
                cnh: "34567890123",
                estadoCivil: "2",
                dataNascimento: "10/03/1978",
                telefone: "(31) 97777-0003",
                email: "carlos.pereira@email.com",
                status: "Ativo"
            },
            {
                id: "MOT-004",
                name: "Ana Paula Souza",
                cpf: "333.333.333-33",
                cnh: "45678901234",
                estadoCivil: "3",
                dataNascimento: "05/12/1990",
                telefone: "(41) 96666-0004",
                email: "ana.souza@email.com",
                status: "Inativo"
            },
            {
                id: "MOT-005",
                name: "Roberto Gomes",
                cpf: "444.444.444-44",
                cnh: "56789012345",
                estadoCivil: "1",
                dataNascimento: "30/07/1982",
                telefone: "(51) 95555-0005",
                email: "roberto.gomes@email.com",
                status: "Ativo"
            }
        ],
        veiculos: [
            {
                id: "FR-101",
                modelo: "Mercedes-Benz Sprinter",
                placa: "ABC-1234",
                ano: "2020",
                km: "150.000",
                capacidade: "3/4",
                status: "Disponivel",
                ultimaManutencao: "10/05/2026"
            },
            {
                id: "FR-204",
                modelo: "Volvo VM 270",
                placa: "DEF-5678",
                ano: "2019",
                km: "220.000",
                capacidade: "Truck",
                status: "Em manutencao",
                ultimaManutencao: "28/05/2026"
            },
            {
                id: "FR-305",
                modelo: "Scania R450",
                placa: "GHI-9012",
                ano: "2022",
                km: "85.000",
                capacidade: "5 eixos",
                status: "Disponivel",
                ultimaManutencao: "15/01/2026"
            },
            {
                id: "FR-406",
                modelo: "Iveco Stralis",
                placa: "JKL-3456",
                ano: "2018",
                km: "310.000",
                capacidade: "Eixo extendido",
                status: "Indisponivel",
                ultimaManutencao: "20/12/2025"
            },
            {
                id: "FR-507",
                modelo: "Volkswagen Delivery 9.170",
                placa: "MNO-7890",
                ano: "2021",
                km: "110.000",
                capacidade: "Toco",
                status: "Disponivel",
                ultimaManutencao: "02/03/2026"
            }
        ],
        rotas: [
            {
                id: "A-332",
                status: "Em progresso",
                saida: "12/02/2026 09:45",
                chegada: "Hoje 14:30",
                origem: "Sao Paulo",
                destino: "Rio de Janeiro",
                motorista: "MOT-001",
                veiculo: "FR-101",
                custo: "R$ 5.000",
                economia: "R$ 750,00",
                url: "rotasctr.html"
            },
            {
                id: "B-678",
                status: "Atrasada",
                saida: "15/06/2026 07:10",
                chegada: "Hoje 14:30",
                origem: "Porto Velho",
                destino: "Curitiba",
                motorista: "MOT-002",
                veiculo: "FR-204",
                custo: "R$ 7.800",
                economia: "R$ 1.170,00",
                url: "rotasctr.html",
                critica: true
            },
            {
                id: "C-451",
                status: "Finalizada",
                saida: "14/06/2026 08:00",
                chegada: "14/06/2026 17:20",
                origem: "Campinas",
                destino: "Belo Horizonte",
                motorista: "MOT-001",
                veiculo: "FR-101",
                custo: "R$ 4.350",
                economia: "R$ 652,50",
                url: "rotasctr.html"
            }
        ]
    }
};

document.addEventListener("DOMContentLoaded", function () {
    seedTables();
    renderTables();
    setupFilters();
    setupManagementForms();
    setupDeleteModal();
});

function seedTables() {
    Object.entries(ORION_TABLES.storageKeys).forEach(([tableName, storageKey]) => {
        if (!localStorage.getItem(storageKey)) {
            localStorage.setItem(storageKey, JSON.stringify(ORION_TABLES.defaults[tableName]));
        }
    });
}

function resetDefaultData() {
    if (confirm("Tem certeza que deseja restaurar os dados iniciais do sistema? Todos os cadastros e edições manuais serão perdidos.")) {
        Object.values(ORION_TABLES.storageKeys).forEach(storageKey => {
            localStorage.removeItem(storageKey);
        });
        
        seedTables();
        window.location.reload();
    }
}

function getStoredItems(tableName) {
    const storageKey = ORION_TABLES.storageKeys[tableName];

    try {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
        console.error("Nao foi possivel ler a tabela:", tableName, error);
        return [];
    }
}

function setStoredItems(tableName, items) {
    localStorage.setItem(ORION_TABLES.storageKeys[tableName], JSON.stringify(items));
}

function renderTables() {
    renderMotoristas();
    renderVeiculos();
    renderRotas();
    renderRotasCriticas();
}

function renderMotoristas() {
    const tbody = document.querySelector('[data-table-body="motoristas"]');
    if (!tbody) return;

    const motoristas = getStoredItems("motoristas");

    if (!motoristas.length) {
        renderEmptyRow(tbody, 4, "Nenhum motorista cadastrado.");
        return;
    }

    tbody.innerHTML = motoristas.map((motorista, index) => {
        const id = motorista.id || createSequentialId("MOT", index);
        const name = motorista.name || motorista.nome || "Sem nome";
        const status = motorista.status || "Ativo";
        const telefone = motorista.telefone || "Não informado";
        const email = motorista.email || "";

        return `
            <tr>
                <td class="text-start fw-bold text-dark">${escapeHtml(id)}</td>
                <td class="text-start fw-semibold text-secondary">${escapeHtml(name)}</td>
                <td class="text-start text-muted" style="font-size: 0.9rem;"><i class="fa-solid fa-phone text-primary me-1"></i>${escapeHtml(telefone)}</td>
                <td class="text-start">${createStatusBadge(status, "motoristas")}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-sm btn-light text-primary me-1" title="Editar" onclick="openEditModal('motoristas', ${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-light text-danger" title="Excluir" data-bs-toggle="modal" data-bs-target="#modalExcluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function renderVeiculos() {
    const tbody = document.querySelector('[data-table-body="veiculos"]');
    if (!tbody) return;

    const veiculos = getStoredItems("veiculos");

    if (!veiculos.length) {
        renderEmptyRow(tbody, 5, "Nenhum veiculo cadastrado.");
        return;
    }

    tbody.innerHTML = veiculos.map((veiculo, index) => {
        const id = veiculo.id || createSequentialId("FR", index);
        const modelo = veiculo.modelo || veiculo.name || "Modelo nao informado";
        const status = veiculo.status || "Disponivel";
        const ultimaManutencao = veiculo.ultimaManutencao || veiculo.manutencao || "Nao registrada";

        return `
            <tr>
                <td class="text-start fw-bold text-dark">${escapeHtml(id)}</td>
                <td class="text-start text-muted">${escapeHtml(modelo)}</td>
                <td class="text-start">${createStatusBadge(status, "veiculos")}</td>
                <td class="text-start text-muted">${escapeHtml(ultimaManutencao)}</td>
                <td class="text-end">
                    <button type="button" class="btn btn-sm btn-light text-primary me-1" title="Editar" onclick="openEditModal('veiculos', ${index})">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-light text-danger" title="Excluir" data-bs-toggle="modal" data-bs-target="#modalExcluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function renderRotas() {
    const tbody = document.querySelector('[data-table-body="rotas"]');
    if (!tbody) return;

    const rotas = getStoredItems("rotas");

    if (!rotas.length) {
        renderEmptyRow(tbody, 10, "Nenhuma rota cadastrada.");
        return;
    }

    tbody.innerHTML = rotas.map((rota) => `
        <tr data-status="${escapeHtml(rota.status || "")}">
            <td class="id-text ps-4">${escapeHtml(rota.id || "-")}</td>
            <td>${createStatusText(rota.status)}</td>
            <td class="text-muted">${escapeHtml(rota.saida || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.chegada || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.origem || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.destino || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.motorista || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.veiculo || "-")}</td>
            <td class="text-muted">${escapeHtml(rota.custo || "-")}</td>
            <td class="text-success fw-semibold">${escapeHtml(rota.economia || "-")}</td>
            <td class="text-center">
                <a href="${escapeHtml(rota.url || "rotasctr.html")}?id=${escapeHtml(rota.id || "")}" class="btn btn-success btn-sm px-4 fw-semibold shadow-sm action-btn">Verificar</a>
            </td>
        </tr>
    `).join("");
}

function renderRotasCriticas() {
    const tbody = document.querySelector('[data-table-body="rotas-criticas"]');
    if (!tbody) return;

    const rotasCriticas = getStoredItems("rotas")
        .filter((rota) => rota.critica || rota.status === "Atrasada")
        .slice(0, 5);

    if (!rotasCriticas.length) {
        renderEmptyRow(tbody, 5, "Nenhuma rota critica no momento.");
        return;
    }

    tbody.innerHTML = rotasCriticas.map((rota) => `
        <tr>
            <td class="id-text">${escapeHtml(rota.id || "-")}</td>
            <td class="route-text">
                ${escapeHtml(rota.origem || "-")}
                <i class="fa-solid fa-arrow-right text-muted mx-1"></i>
                ${escapeHtml(rota.destino || "-")}
            </td>
            <td>${createStatusBadge(rota.status || "Em progresso", "rotas")}</td>
            <td class="text-dark fw-medium">${escapeHtml(rota.chegada || "-")}</td>
            <td>
                <a href="${escapeHtml(rota.url || "rotasctr.html")}?id=${escapeHtml(rota.id || "")}" class="btn btn-primary btn-sm rounded-pill px-4 fw-semibold shadow-sm action-btn">Verificar</a>
            </td>
        </tr>
    `).join("");
}

function setupFilters() {
    if (document.querySelector('[data-table-body="veiculos"]')) {
        setupTextFilter("myInput", "myTable");
        setupTextFilter("myInputVeiculos", "tableVeiculos");
        return;
    }

    const routeTable = document.querySelector('[data-table-body="rotas"]');
    if (!routeTable) return;

    const input = document.getElementById("myInput");
    const statusSelect = document.getElementById("filtroStatus");
    const applyRouteFilters = function () {
        const query = (input?.value || "").toLowerCase();
        const selectedStatus = getSelectedStatus(statusSelect);
        const rows = document.querySelectorAll("#myTable tbody tr");

        rows.forEach((row) => {
            const matchesText = row.textContent.toLowerCase().includes(query);
            const matchesStatus = !selectedStatus || (row.dataset.status || "").toLowerCase() === selectedStatus;
            row.style.display = matchesText && matchesStatus ? "" : "none";
        });
    };

    input?.addEventListener("keyup", applyRouteFilters);
    statusSelect?.addEventListener("change", applyRouteFilters);
}

function setupTextFilter(inputId, tableId) {
    const input = document.getElementById(inputId);
    const table = document.getElementById(tableId);

    if (!input || !table) return;

    input.addEventListener("keyup", function () {
        const filter = input.value.toLowerCase();
        const rows = table.querySelectorAll("tbody tr");

        rows.forEach((row) => {
            row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
        });
    });
}

function setupManagementForms() {
    const motoristaForm = document.querySelector("#modalMoto form");
    const veiculoForm = document.querySelector("#modalVeiculo form");
    const editMotoristaForm = document.querySelector("#formEditMotorista");
    const editVeiculoForm = document.querySelector("#formEditVeiculo");

    motoristaForm?.addEventListener("submit", saveMotorista, true);
    veiculoForm?.addEventListener("submit", saveVeiculo, true);
    editMotoristaForm?.addEventListener("submit", saveEditMotorista, true);
    editVeiculoForm?.addEventListener("submit", saveEditVeiculo, true);

    const modalMoto = document.getElementById("modalMoto");
    const modalVeiculo = document.getElementById("modalVeiculo");
    const modalEditMoto = document.getElementById("modalEditMotorista");
    const modalEditVeiculo = document.getElementById("modalEditVeiculo");

    modalMoto?.addEventListener("hidden.bs.modal", function () {
        if (motoristaForm) resetModalForm(motoristaForm, "modalMoto");
    });

    modalVeiculo?.addEventListener("hidden.bs.modal", function () {
        if (veiculoForm) resetModalForm(veiculoForm, "modalVeiculo");
    });

    modalEditMoto?.addEventListener("hidden.bs.modal", function () {
        if (editMotoristaForm) resetModalForm(editMotoristaForm, "modalEditMotorista");
    });

    modalEditVeiculo?.addEventListener("hidden.bs.modal", function () {
        if (editVeiculoForm) resetModalForm(editVeiculoForm, "modalEditVeiculo");
    });
}

function saveMotorista(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const motoristas = getStoredItems("motoristas");
    const nextNumber = motoristas.length + 1;
    
    motoristas.push({
        id: createSequentialId("MOT", nextNumber - 1),
        name: document.getElementById("name")?.value.trim(),
        cpf: document.getElementById("cpf")?.value.trim(),
        cnh: document.getElementById("CNH")?.value.trim(),
        estadoCivil: document.getElementById("EstadoCivil")?.value.trim(),
        dataNascimento: document.getElementById("DataNascimento")?.value.trim(),
        telefone: document.getElementById("telefone")?.value.trim(),
        email: document.getElementById("email")?.value.trim() || "",
        status: "Ativo"
    });

    setStoredItems("motoristas", motoristas);
    resetModalForm(form, "modalMoto");
    renderMotoristas();
}

function saveVeiculo(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const veiculos = getStoredItems("veiculos");
    const nextNumber = veiculos.length + 1;
    
    veiculos.push({
        id: createSequentialId("FR", nextNumber - 1),
        modelo: document.getElementById("modelo")?.value.trim(),
        placa: document.getElementById("placa")?.value.trim(),
        ano: document.getElementById("ano")?.value.trim(),
        km: document.getElementById("km")?.value.trim(),
        capacidade: document.getElementById("Capacidade")?.selectedOptions[0]?.textContent.trim(),
        status: "Disponivel",
        ultimaManutencao: "Nao registrada"
    });

    setStoredItems("veiculos", veiculos);
    resetModalForm(form, "modalVeiculo");
    renderVeiculos();
}

function saveEditMotorista(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const motoristas = getStoredItems("motoristas");
    const index = Number(form.dataset.editIndex);

    if (!isNaN(index) && motoristas[index]) {
        motoristas[index] = {
            ...motoristas[index],
            name: document.getElementById("edit_name")?.value.trim(),
            cpf: document.getElementById("edit_cpf")?.value.trim(),
            cnh: document.getElementById("edit_CNH")?.value.trim(),
            estadoCivil: document.getElementById("edit_EstadoCivil")?.value.trim(),
            dataNascimento: document.getElementById("edit_DataNascimento")?.value.trim(),
            telefone: document.getElementById("edit_telefone")?.value.trim(),
            email: document.getElementById("edit_email")?.value.trim() || ""
        };
        
        const pwd = document.getElementById("edit_pwd")?.value.trim();
        if (pwd) motoristas[index].password = pwd; // Salva se houver alteração de senha

        setStoredItems("motoristas", motoristas);
        renderMotoristas();
    }
    
    resetModalForm(form, "modalEditMotorista");
}

function saveEditVeiculo(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const form = event.currentTarget;
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const veiculos = getStoredItems("veiculos");
    const index = Number(form.dataset.editIndex);

    if (!isNaN(index) && veiculos[index]) {
        veiculos[index] = {
            ...veiculos[index],
            modelo: document.getElementById("edit_modelo")?.value.trim(),
            placa: document.getElementById("edit_placa")?.value.trim(),
            ano: document.getElementById("edit_ano")?.value.trim(),
            km: document.getElementById("edit_km")?.value.trim(),
            capacidade: document.getElementById("edit_Capacidade")?.selectedOptions[0]?.textContent.trim()
        };
        setStoredItems("veiculos", veiculos);
        renderVeiculos();
    }
    
    resetModalForm(form, "modalEditVeiculo");
}

function setupDeleteModal() {
    const modalExcluir = document.getElementById("modalExcluir");
    const itemExcluirNome = document.getElementById("itemExcluirNome");

    if (!modalExcluir || !itemExcluirNome) return;

    modalExcluir.addEventListener("show.bs.modal", function (event) {
        const button = event.relatedTarget;
        const row = button?.closest("tr");
        const itemName = row?.querySelector("td")?.textContent.trim();

        if (itemName) {
            itemExcluirNome.textContent = itemName;
        }
    });
}

function openEditModal(tableName, index) {
    const items = getStoredItems(tableName);
    const item = items[index];
    if (!item) return;

    let modalId;
    if (tableName === 'motoristas') {
        modalId = 'modalEditMotorista';
        const nameEl = document.getElementById('edit_name');
        const cpfEl = document.getElementById('edit_cpf');
        const cnhEl = document.getElementById('edit_CNH');
        const dataNascimentoEl = document.getElementById('edit_DataNascimento');
        const telefoneEl = document.getElementById('edit_telefone');
        const emailEl = document.getElementById('edit_email');
        const ecEl = document.getElementById('edit_EstadoCivil');

        if (nameEl) nameEl.value = item.name || item.nome || '';
        if (cpfEl) cpfEl.value = item.cpf || '';
        if (cnhEl) cnhEl.value = item.cnh || '';
        if (dataNascimentoEl) dataNascimentoEl.value = item.dataNascimento || '';
        if (telefoneEl) telefoneEl.value = item.telefone || '';
        if (emailEl) emailEl.value = item.email || '';
        if (ecEl) {
            Array.from(ecEl.options).forEach(opt => {
                if (opt.textContent.trim() === item.estadoCivil || opt.value === item.estadoCivil) opt.selected = true;
            });
        }
    } else if (tableName === 'veiculos') {
        modalId = 'modalEditVeiculo';
        const modeloEl = document.getElementById('edit_modelo');
        const placaEl = document.getElementById('edit_placa');
        const anoEl = document.getElementById('edit_ano');
        const kmEl = document.getElementById('edit_km');
        const capacidadeEl = document.getElementById('edit_Capacidade');

        if (modeloEl) modeloEl.value = item.modelo || item.name || '';
        if (placaEl) placaEl.value = item.placa || '';
        if (anoEl) anoEl.value = item.ano || '';
        if (kmEl) kmEl.value = item.km || '';
        if (capacidadeEl) {
            Array.from(capacidadeEl.options).forEach(opt => {
                if (opt.textContent.trim() === item.capacidade || opt.value === item.capacidade) opt.selected = true;
            });
        }
    }

    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        const form = modalElement.querySelector('form');
        if (form) form.dataset.editIndex = index;

        // Set fields to readonly and show inline edit buttons
        if (form) {
            const inputs = form.querySelectorAll('input:not([type="checkbox"]), select');
            inputs.forEach(input => {
                if (input.tagName === 'SELECT') input.setAttribute('disabled', 'true');
                else input.setAttribute('readonly', 'true');
            });
            const editBtns = form.querySelectorAll('.btn-edit-inline');
            editBtns.forEach(btn => {
                btn.classList.remove('d-none');
                btn.innerHTML = '<i class="fa-solid fa-pen"></i>';
            });
        }

        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.show();
    }
}

function resetModalForm(form, modalId) {
    form.reset();
    form.classList.remove("was-validated");
    delete form.dataset.editIndex;

    const inputs = form.querySelectorAll('input:not([type="checkbox"]), select');
    inputs.forEach(input => {
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
    });
    const editBtns = form.querySelectorAll('.btn-edit-inline');
    editBtns.forEach(btn => btn.classList.add('d-none'));

    const modalElement = document.getElementById(modalId);
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance?.hide();
}

function renderEmptyRow(tbody, colSpan, message) {
    tbody.innerHTML = `
        <tr>
            <td colspan="${colSpan}" class="text-center text-muted py-4">${escapeHtml(message)}</td>
        </tr>
    `;
}

function createSequentialId(prefix, index) {
    return `${prefix}-${String(index + 1).padStart(3, "0")}`;
}

function createStatusText(status = "") {
    const statusClass = {
        "Em progresso": "text-warning",
        "Atrasada": "text-danger",
        "Cancelada": "text-secondary",
        "Finalizada": "text-success"
    }[status] || "text-muted";

    return `<span class="${statusClass}">${escapeHtml(status || "-")}</span>`;
}

function createStatusBadge(status = "", type = "rotas") {
    const classes = {
        motoristas: {
            "Ativo": "bg-success bg-opacity-10 text-success",
            "Folga": "bg-warning bg-opacity-10 text-warning",
            "Inativo": "bg-secondary bg-opacity-10 text-secondary"
        },
        veiculos: {
            "Disponivel": "bg-success bg-opacity-10 text-success",
            "Em manutencao": "bg-warning bg-opacity-10 text-warning",
            "Indisponivel": "bg-danger bg-opacity-10 text-danger"
        },
        rotas: {
            "Em progresso": "bg-warning-subtle text-warning border border-warning-subtle rounded-pill",
            "Atrasada": "bg-danger-subtle text-danger border border-danger-subtle rounded-pill",
            "Cancelada": "bg-secondary-subtle text-secondary border border-secondary-subtle rounded-pill",
            "Finalizada": "bg-success-subtle text-success border border-success-subtle rounded-pill"
        }
    };

    const badgeClass = classes[type]?.[status] || "bg-secondary bg-opacity-10 text-secondary";
    return `<span class="badge ${badgeClass} px-2 py-1">${escapeHtml(status || "-")}</span>`;
}

function getSelectedStatus(statusSelect) {
    if (!statusSelect) return "";

    const selectedText = statusSelect.selectedOptions[0]?.textContent.trim().toLowerCase();
    return selectedText === "status" ? "" : selectedText;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function toggleFieldEdit(btn) {
    const container = btn.closest('.input-group');
    if (!container) return;
    const input = container.querySelector('input, select');
    if (input) {
        if (input.hasAttribute('readonly') || input.hasAttribute('disabled')) {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
            input.focus();
            btn.innerHTML = '<i class="fa-solid fa-check text-success"></i>';
        } else {
            if (input.tagName === 'SELECT') {
                input.setAttribute('disabled', 'disabled');
            } else {
                input.setAttribute('readonly', 'readonly');
            }
            btn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        }
    }
}
