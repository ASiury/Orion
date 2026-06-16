document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formEntrega");
    const modalElement = document.getElementById("modalEntrega");

    form?.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const entregas = getStoredItems("entregas");
        const editIndex = Number(form.dataset.editIndex);
        const entrega = coletarDadosEntrega(editIndex, entregas);

        if (!isNaN(editIndex) && entregas[editIndex]) {
            entregas[editIndex] = entrega;
        } else {
            entregas.push(entrega);
        }

        setStoredItems("entregas", entregas);
        renderEntregas();
        resetEntregaForm();

        const modal = bootstrap.Modal.getInstance(modalElement);
        modal?.hide();
    });

    modalElement?.addEventListener("hidden.bs.modal", resetEntregaForm);
});

function coletarDadosEntrega(editIndex, entregas) {
    const prazo = document.getElementById("entregaPrazo")?.value;
    const prazoFormatado = prazo ? formatarDataHora(prazo) : "";
    const entregaExistente = !isNaN(editIndex) ? entregas[editIndex] : null;

    return {
        id: entregaExistente?.id || createSequentialId("ENT", entregas.length),
        origem: document.getElementById("entregaOrigem")?.value.trim(),
        destino: document.getElementById("entregaDestino")?.value.trim(),
        peso: document.getElementById("entregaPeso")?.value.trim(),
        volume: document.getElementById("entregaVolume")?.value.trim(),
        prazo: prazoFormatado,
        prazoRaw: prazo,
        prioridade: document.getElementById("entregaPrioridade")?.value,
        status: document.getElementById("entregaStatus")?.value,
        observacoes: document.getElementById("entregaObservacoes")?.value.trim()
    };
}

function openEntregaModal(index = null) {
    const form = document.getElementById("formEntrega");
    const title = document.getElementById("modalEntregaLabel");
    const entregas = getStoredItems("entregas");
    const entrega = Number.isInteger(index) ? entregas[index] : null;

    if (title) title.textContent = entrega ? "Editar entrega" : "Nova entrega";
    if (form) {
        form.dataset.editIndex = entrega ? String(index) : "";
        form.classList.remove("was-validated");
    }

    preencherCampo("entregaOrigem", entrega?.origem);
    preencherCampo("entregaDestino", entrega?.destino);
    preencherCampo("entregaPeso", entrega?.peso);
    preencherCampo("entregaVolume", entrega?.volume);
    preencherCampo("entregaPrazo", entrega?.prazoRaw || converterParaDatetimeLocal(entrega?.prazo));
    preencherCampo("entregaPrioridade", entrega?.prioridade || "Media");
    preencherCampo("entregaStatus", entrega?.status || "Criada");
    preencherCampo("entregaObservacoes", entrega?.observacoes);

    const modalElement = document.getElementById("modalEntrega");
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.show();
}

function deleteEntrega(index) {
    if (!confirm("Deseja excluir esta entrega do prototipo?")) return;

    const entregas = getStoredItems("entregas");
    entregas.splice(index, 1);
    setStoredItems("entregas", entregas);
    renderEntregas();
}

function resetEntregaForm() {
    const form = document.getElementById("formEntrega");
    if (!form) return;

    form.reset();
    form.classList.remove("was-validated");
    delete form.dataset.editIndex;
    preencherCampo("entregaPrioridade", "Media");
    preencherCampo("entregaStatus", "Criada");
}

function preencherCampo(id, valor = "") {
    const campo = document.getElementById(id);
    if (campo) campo.value = valor || "";
}

function formatarDataHora(value) {
    const data = new Date(value);
    if (isNaN(data.getTime())) return value;

    return `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()} ${String(data.getHours()).padStart(2, "0")}:${String(data.getMinutes()).padStart(2, "0")}`;
}

function converterParaDatetimeLocal(value) {
    if (!value || !value.includes("/")) return "";

    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/);
    if (!match) return "";

    const [, dia, mes, ano, hora, minuto] = match;
    return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}
